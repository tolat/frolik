import httpFetch from "./http-fetch";
import { getServer } from "./env-utils";
import { dataActions } from "../store/data-slice";
import store from "../store";
import { Buffer } from "buffer";
import { Stream } from "stream";

export const fetchActivities = async (setData) => {
  const requestConfig = {
    url: `${getServer()}/activity/get-all`,
  };

  const handleResponse = (response) => {
    setData(response.activities);
  };

  const handleError = (err) => {
    throw new Error(err);
  };

  await httpFetch(requestConfig, handleResponse, handleError);
};

export const fetchProfilePic = async (userID) => {
  const requestConfig = {
    url: `${getServer()}/user/${userID}/profile-picture`,
  };

  const handleResponse = async (response) => {
    response.text().then((imageDataString) => {
      store.dispatch(
        dataActions.setUserProfilePicture({
          userID,
          photoString: imageDataString,
        })
      );
    });
  };

  const handleError = (err) => {
    throw new Error(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

export const fetchPhotosOLD = async (user) => {
  const dataStateUser = store.getState().data.users[user._id];
  for (let photoKey of user.photos) {
    // Check if photo has already been downloaded or queued
    if (
      !dataStateUser ||
      !dataStateUser.photos.find((p) => p.key === photoKey)
    ) {
      // Mark photo as queued for donwload in redux store
      await store.dispatch(
        dataActions.queueUserPhoto({ userID: user._id, photoKey })
      );

      const requestConfig = {
        url: `${getServer()}/user/${user._id}/photo/${photoKey}`,
      };

      const handleResponse = async (response) => {
        response.text().then((imageDataString) => {
          store.dispatch(
            dataActions.addUserPhoto({
              userID: user._id,
              photoKey,
              photoString: imageDataString,
            })
          );
        });
      };

      const handleError = (err) => {
        throw new Error(err);
      };

      httpFetch(requestConfig, handleResponse, handleError);
    }
  }
};


export const fetchPhotos = async (user) => {
  const requestConfig = {
    url: `${getServer()}/user/${user._id}/photos`,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ keys: user.photos }),
  };

  const handleResponse = async (response) => {
   /*  store.dispatch(
      dataActions.setUserPhotos({
        userID: user._id,
        stringsArray: response.photoStrings,
      })
    ); */

     readStreamToString(response.body).then((dataString) => {
      const dataObject = JSON.parse(
        `{${dataString.slice(0, dataString.length - 2)}}}`
      );

      console.log(dataObject)
      const streamMap = {}
      for (let key in dataObject) {
        const stream = dataObject[key].stream
        const data = dataObject[key].chunk.data
        console.log(stream)
        if(!streamMap[stream]){
          streamMap[stream] = {data}
        }else{
          streamMap[stream].data = streamMap[stream].data.concat(data)
        }
      }

      for (let key in streamMap) {
        const photoString = Buffer.from(streamMap[key].data).toString();
        store.dispatch(
          dataActions.addUserPhoto({ userID: user._id, photo: photoString })
        );
      }
    });
  };

  const handleError = (err) => {
    throw new Error(err);
  };

  httpFetch(requestConfig, handleResponse, handleError);
};

async function readStreamToString(readableStream) {
  const reader = readableStream.getReader();
  let result = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      // Assuming the content is a UTF-8 encoded buffer
      const chunkString = new TextDecoder().decode(value);
      result += chunkString;
    }

   
  } catch (error) {
    console.error("Error reading stream:", error);
  } finally {
    reader.releaseLock();
  }
  return result;
}

router.post("/:id/photos", reqAuthenticated, async (req, res) => {
  const imageKeys = req.body.keys;
  try {
    const imageStreams = await Promise.all(
      imageKeys.map(async (key) =>
        downloadFromS3(process.env.AWS_DEV_BUCKET, key)
      )
    );
    
    res.setHeader('Content-Type', 'application/octet-stream')
    const combinedStream = await combineStreams(imageStreams, res)
    combinedStream.pipe(res);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});


// combinedStreamModule.js
const { Readable } = require("stream");

class CombinedReadableStream extends Readable {
  constructor(streams, options) {
    super(options);
    this.streams = streams;
    this.currentStreamIndex = 0;

    this.on("resume", () => this.read());
  }

  _read() {
    const currentStream = this.streams[this.currentStreamIndex];

    if (!currentStream) {
      this.push(null);
    } else {
      this.readFromStreamAsync(currentStream)
        .then((chunk) => {
          if (chunk !== null) {
            const chunkWithMetadata = {
              streamIndex: this.currentStreamIndex,
              data: chunk,
            };
            const uniqueChunkId = Math.random()
            const chunkWithMetadataBuffer = Buffer.from(
              `"chunk_${uniqueChunkId}": ${JSON.stringify(chunkWithMetadata)},`
            );

            this.push(chunkWithMetadataBuffer);
          }
          this.currentStreamIndex++;
        })
        .catch((error) => {
          this.emit("error", error);
        });
    }
  }

  async readFromStreamAsync(stream) {
    return new Promise((resolve, reject) => {
      stream.once("readable", () => {
        const chunk = stream.read();
        resolve(chunk);
      });

      stream.once("end", () => resolve(null));
      stream.once("error", (error) => reject(error));
    });
  }
}

const combineStreams = async (streams, res) => {
  const combinedStream = new Readable({
    read() {},
  });

  let pendingStreams = streams.length;

  streams.forEach((stream) => {
    const streamIndex = ((Math.random() * 1000) % streams.length).toFixed(0);
    // Attach a 'data' event listener to each source stream
    function onData(chunk) {
      const uniqueChunkId = Math.random();
      const chunkWithId = `"chunk_${uniqueChunkId}": ${JSON.stringify({
        stream: `${streamIndex}`,
        chunk,
      })},`;
      combinedStream.push(chunkWithId);
    }
    stream.on("data", onData);

    // If a source stream ends, remove its 'data' listener
    stream.on("end", () => {
      stream.removeListener("data", onData);
      console.log(`stream ${streamIndex} done!`);
      pendingStreams--;
      console.log(pendingStreams);
      if (pendingStreams < 1) {
        res.end();
      }
    });
  });

  return combinedStream;
};

module.exports = { CombinedReadableStream, combineStreams };


const timeOperation = async (fun, name) => {
  let start = Date.now();
  const result = await fun();
  let end = Date.now();
  console.log(`"${name} request took: `, end - start, "ms");
  return result;
};

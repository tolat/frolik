const path = require("path");
const fs = require("fs")

module.exports.categoryColorMap = {
  Games: "rgb(117, 204, 255)",
  Art: "rgb(186, 255, 169)",
  Sports: "rgb(255 236 69)",
  Food: "rgb(238 183 220)",
  Adventure: "rgb(248 157 157)",
};

module.exports.statusMap = {
  Ready: "You are available for outing requests from anyone!",
  Busy: "You are busy doing other, less fun things.",
  Searching: "Your status is set to Searching when you are on the 'Go' page.",
  Inactive:
    "Your status will be set to Inactive after two weeks of inactivity.",
};

// Load city data
module.exports.loadCityData = async () => {
  const cityDataPath = path.join(__dirname, "/city-data/cities10000.json");
  const readCityData = new Promise((resolve, reject) => {
    fs.readFile(cityDataPath, "utf8", async (err, data) => {
      if (err) {
        console.error("Error reading JSON file:", err);
        reject();
        return;
      }

      const filteredData = JSON.parse(data).map((city) => {
        return {
          name: city.name,
          country: city.country_code,
          timezone: city.timezone,
        };
      });
      resolve(filteredData);
    });
  });

  return await readCityData;
};

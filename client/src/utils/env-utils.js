export function getServer() {
  if (process.env.REACT_APP_SERVER) {
    return process.env.REACT_APP_SERVER;
  } else {
    throw new Error("No Server Url Provided in .env");
  }
}

import { io } from "socket.io-client";
import { getServer } from "./utils/env-utils";

export const socket = io(getServer(), {
  autoConnect: false,
});

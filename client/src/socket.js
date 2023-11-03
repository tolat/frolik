import { io } from 'socket.io-client';
import { getServer } from './utils/env-utils';

// "undefined" means the URL will be computed from the `window.location` object
const URL = getServer()

export const socket = io(URL, {
    autoConnect: false
  });
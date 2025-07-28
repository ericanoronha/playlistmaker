import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'deviceId';

export const getDeviceId = () => {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
};

export const clearDeviceData = () => {
  localStorage.removeItem(DEVICE_ID_KEY);
};
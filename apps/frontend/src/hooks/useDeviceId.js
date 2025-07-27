import { useEffect, useState } from 'react';
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

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    setDeviceId(getDeviceId());
  }, []);

  return deviceId;
};

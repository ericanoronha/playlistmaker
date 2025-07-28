import { useEffect, useState } from 'react';
import { getDeviceId } from '../utils/deviceId';

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    setDeviceId(getDeviceId());
  }, []);

  return deviceId;
}
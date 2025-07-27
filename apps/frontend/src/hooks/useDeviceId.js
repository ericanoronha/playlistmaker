import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const KEY = 'playlist_device_id';

export default function useDeviceId() {
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    let storedId = localStorage.getItem(KEY);
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem(KEY, storedId);
    }
    setDeviceId(storedId);
  }, []);

  return deviceId;
}

const playlistData = {
  test123: {
    'mocked-id': {
      nome: 'Música 1',
      interprete: 'Artista 1',
      audio: 'https://youtube.com/example',
      novela: 'Vale Tudo',
      tipo: 'nacional',
    },
  },
};

const createMockRef = (pathStr, key = null) => ({
  _path: {
    pieces_: pathStr.split('/'),
  },
  key,
});

export const ref = (db, pathStr) => createMockRef(pathStr);

export const get = (ref) => {
  const path = ref._path.pieces_;
  if (path[0] === 'playlist') {
    const deviceId = path[1];
    const trackId = path[2];
    if (!trackId) {
      const playlist = playlistData[deviceId];
      return Promise.resolve({
        val: () => playlist,
        exists: () => !!playlist,
      });
    } else {
      const track = playlistData[deviceId]?.[trackId];
      return Promise.resolve({
        val: () => track,
        exists: () => !!track,
      });
    }
  }
  return Promise.resolve({ val: () => null, exists: () => false });
};

export const push = (refObj) => {
  const path = refObj._path.pieces_;
  const newKey = 'mocked-id';
  return createMockRef(path.join('/').trim(), newKey);
};

export const remove = (ref) => {
  const path = ref._path.pieces_;
  const deviceId = path[1];
  const trackId = path[2];
  if (playlistData[deviceId]?.[trackId]) {
    delete playlistData[deviceId][trackId];
    return Promise.resolve();
  }
  return Promise.reject(new Error('Not found'));
};

export const set = (ref, value) => {
  const path = ref._path.pieces_;
  if (path.length === 2) {
    playlistData[path[1]] = value;
  } else if (path.length === 3) {
    const deviceId = path[1];
    const trackId = path[2];
    if (!playlistData[deviceId]) playlistData[deviceId] = {};
    playlistData[deviceId][trackId] = value;
  }
  return Promise.resolve();
};

export const resetMockData = () => {
  playlistData.test123 = {
    'mocked-id': {
      nome: 'Música 1',
      interprete: 'Artista 1',
      audio: 'https://youtube.com/example',
      novela: 'Vale Tudo',
      tipo: 'nacional',
    },
  };
};

export default {
  ref,
  get,
  push,
  remove,
  set,
  resetMockData,
};
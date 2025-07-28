const playlistData = {
  test123: {
    'mocked-id': {
      nome: 'Chocolate com Pimenta',
      interprete: 'Deborah Blando',
      audio: 'https://www.youtube.com/watch?v=DJaO0AI93Wg',
      novela: 'Chocolate com Pimenta',
      tipo: 'nacional',
    },
  },
};

const createMockRef = (pathStr) => ({
  _path: {
    pieces_: pathStr.split('/'),
  },
});

export const ref = (db, pathStr) => createMockRef(pathStr);

export const get = (ref) => {
  const path = ref._path.pieces_;
  const [root, deviceId, trackId] = path;

  if (root === 'playlist') {
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

export const push = () => ({ key: 'mocked-id' });

export const remove = (ref) => {
  const [_, deviceId, trackId] = ref._path.pieces_;
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
    const [_, deviceId, trackId] = path;
    if (!playlistData[deviceId]) playlistData[deviceId] = {};
    playlistData[deviceId][trackId] = value;
  }
  return Promise.resolve();
};
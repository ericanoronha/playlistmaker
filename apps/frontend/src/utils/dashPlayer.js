import shaka from 'shaka-player';

export const initShaka = (audioRef, src) => {
  const player = new shaka.Player(audioRef);
  player.load(src).catch((e) => console.error('Erro ao carregar DASH:', e));
  return player;
};
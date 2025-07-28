import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../../data/trilhas-de-novelas.json');

router.get('/', (req, res) => {
  try {
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const novelas = JSON.parse(rawData);

    const songs = [];

    novelas.forEach((novela) => {
      novela.trilhas.forEach((trilha) => {
        trilha.faixas.forEach((faixa, index) => {
          songs.push({
            id: `${novela.nome}-${trilha.tipo}-${index}`,
            title: faixa.nome,
            artist: faixa.interprete,
            novela: novela.nome,
            ano: novela.ano,
            tipo: trilha.tipo,
            audio: faixa.audio,
          });
        });
      });
    });

    res.json(songs);
  } catch (error) {
    console.error('Erro ao carregar trilhas:', error.message);
    res.status(500).json({ error: 'Erro ao carregar as trilhas' });
  }
});

export default router;

import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

config();

let credentials;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    console.log('[firebase] Credenciais carregadas da variável de ambiente');
  } else {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const localPath = path.resolve(
      __dirname,
      '../firebase-service-account.json',
    );

    credentials = JSON.parse(readFileSync(localPath, 'utf8'));
    console.log('[firebase] Credenciais carregadas do arquivo local');
  }
} catch (err) {
  console.error(
    '[firebase] Erro ao carregar credenciais Firebase:',
    err.message,
  );
  throw new Error('Falha ao carregar credenciais do Firebase');
}

const app = initializeApp({
  credential: cert(credentials),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export const db = getDatabase(app);

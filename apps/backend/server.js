import app from './src/index.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3901; 

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

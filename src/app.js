import express from 'express'
import cors from 'cors'

const app = express();

// Configuração de Middlewares
app.use(cors())
app.use(express.json())

// Rota de verificação do estado da API
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'API de Controlo de Automóveis a funcionar corretamente!' 
  });
});

export default app
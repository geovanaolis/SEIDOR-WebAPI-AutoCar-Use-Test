import express from 'express'
import cors from 'cors'
import driverRoutes from './routes/driverRoutes.js'
import automobileRoutes from './routes/automobileRoutes.js'
import utilizationRoutes from './routes/utilizationRoutes.js'

const app = express()

// Configuração de Middlewares
app.use(cors())
app.use(express.json())

// Registo das Rotas da Aplicação
app.use('/drivers', driverRoutes)
app.use('/automobiles', automobileRoutes)
app.use('/utilizations', utilizationRoutes)

// Rota de verificação do estado da API
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'API de Controlo de Automóveis a funcionar corretamente!' 
  })
})

export default app
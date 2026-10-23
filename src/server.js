import dotenv from 'dotenv'
import app from './app.js'

dotenv.config()

const PORT = process.env.PORT || 3000

app.server = app.listen(PORT, () => {
  console.log(`Servidor a executar no endereço http://localhost:${PORT}`)
});

export default app
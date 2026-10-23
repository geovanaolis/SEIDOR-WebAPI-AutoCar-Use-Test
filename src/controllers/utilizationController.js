import { memoryDb } from '../models/database.js'

// Função auxiliar para gerar um identificador único
const generateId = () => Date.now().toString()

// Criar um novo registro de utilização
export const startUtilization = (req, res) => {
  try {
    const { driverId, automobileId, reason } = req.body

    if (!driverId || !automobileId || !reason) {
      return res.status(400).json({ 
        error: 'Os campos "driverId", "automobileId" e "reason" são obrigatórios.' 
      });
    }

    // Verificar se o motorista existe
    const driver = memoryDb.drivers.find(d => d.id === driverId)
    if (!driver) {
      return res.status(404).json({ error: 'Motorista não encontrado.' })
    }

    // Verificar se o automóvel existe
    const automobile = memoryDb.automobiles.find(a => a.id === automobileId)
    if (!automobile) {
      return res.status(404).json({ error: 'Automóvel não encontrado.' })
    }

    // Regra de Negócio 1: O automóvel já está a ser utilizado por outro motorista?
    const isAutoInUse = memoryDb.utilizations.some(
      u => u.automobileId === automobileId && !u.endDate
    )
    if (isAutoInUse) {
      return res.status(400).json({ 
        error: 'Este automóvel já está em utilização por outro motorista.' 
      })
    }

    // Regra de Negócio 2: O motorista já está a utilizar outro automóvel?
    const isDriverBusy = memoryDb.utilizations.some(
      u => u.driverId === driverId && !u.endDate
    )
    if (isDriverBusy) {
      return res.status(400).json({ 
        error: 'Este motorista já possui uma utilização de automóvel em aberto.' 
      })
    }

    const newUtilization = {
      id: generateId(),
      startDate: new Date().toISOString(),
      endDate: null,
      driverId,
      automobileId,
      reason
    }

    memoryDb.utilizations.push(newUtilization)
    return res.status(201).json(newUtilization)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao iniciar utilização de automóvel.' })
  }
}

// Finalizar a utilização de um automóvel
export const endUtilization = (req, res) => {
  try {
    const { id } = req.params

    const utilizationIndex = memoryDb.utilizations.findIndex(u => u.id === id)

    if (utilizationIndex === -1) {
      return res.status(404).json({ error: 'Registro de utilização não encontrado.' })
    }

    const utilization = memoryDb.utilizations[utilizationIndex]

    if (utilization.endDate) {
      return res.status(400).json({ error: 'Esta utilização já foi finalizada anteriormente.' })
    }

    memoryDb.utilizations[utilizationIndex].endDate = new Date().toISOString()

    return res.status(200).json(memoryDb.utilizations[utilizationIndex])
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao finalizar utilização de automóvel.' })
  }
}

// Listar os registros de utilização com os detalhes do motorista e do automóvel
export const getUtilizations = (req, res) => {
  try {
    const populatedUtilizations = memoryDb.utilizations.map(utilization => {
      const driver = memoryDb.drivers.find(d => d.id === utilization.driverId)
      const automobile = memoryDb.automobiles.find(a => a.id === utilization.automobileId)

      return {
        id: utilization.id,
        startDate: utilization.startDate,
        endDate: utilization.endDate,
        reason: utilization.reason,
        driver: driver ? { id: driver.id, nome: driver.nome } : null,
        automobile: automobile ? { 
          id: automobile.id, 
          placa: automobile.placa, 
          cor: automobile.cor, 
          marca: automobile.marca 
        } : null
      }
    })

    return res.status(200).json(populatedUtilizations)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao listar utilizações.' })
  }
}
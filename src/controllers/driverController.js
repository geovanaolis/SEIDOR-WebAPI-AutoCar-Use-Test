import { memoryDb } from '../models/database.js'

// Função auxiliar para gerar um identificador único baseado no timestamp atual
const generateId = () => Date.now().toString()

// Cadastrar um novo motorista
export const createDriver = (req, res) => {
  try {
    const { nome } = req.body

    if (!nome) {
      return res.status(400).json({ error: 'O campo "nome" é obrigatório.' })
    }

    const newDriver = {
      id: generateId(),
      nome
    }

    memoryDb.drivers.push(newDriver)
    return res.status(201).json(newDriver)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao criar motorista.' })
  }
}

// Listar os motoristas cadastrados com filtro opcional por nome
export const getDrivers = (req, res) => {
  try {
    const { nome } = req.query
    let drivers = memoryDb.drivers

    if (nome) {
      drivers = drivers.filter(driver => 
        driver.nome.toLowerCase().includes(nome.toLowerCase())
      )
    }

    return res.status(200).json(drivers)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao listar motoristas.' })
  }
}

// Recuperar um motorista pelo seu identificador único
export const getDriverById = (req, res) => {
  try {
    const { id } = req.params
    const driver = memoryDb.drivers.find(d => d.id === id)

    if (!driver) {
      return res.status(404).json({ error: 'Motorista não encontrado.' })
    }

    return res.status(200).json(driver)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao buscar motorista.' })
  }
}

// Atualizar um motorista cadastrado
export const updateDriver = (req, res) => {
  try {
    const { id } = req.params
    const { nome } = req.body

    const driverIndex = memoryDb.drivers.findIndex(d => d.id === id)

    if (driverIndex === -1) {
      return res.status(404).json({ error: 'Motorista não encontrado.' })
    }

    if (!nome) {
      return res.status(400).json({ error: 'O campo "nome" é obrigatório para a atualização.' })
    }

    memoryDb.drivers[driverIndex].nome = nome

    return res.status(200).json(memoryDb.drivers[driverIndex])
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao atualizar motorista.' })
  }
}

// Excluir um motorista cadastrado
export const deleteDriver = (req, res) => {
  try {
    const { id } = req.params
    const driverIndex = memoryDb.drivers.findIndex(d => d.id === id)

    if (driverIndex === -1) {
      return res.status(404).json({ error: 'Motorista não encontrado.' })
    }

    // Regra adicional de segurança: verificar se o motorista possui utilização ativa
    const activeUsage = memoryDb.utilizations.find(u => u.driverId === id && !u.endDate)
    if (activeUsage) {
      return res.status(400).json({ error: 'Não é possível excluir um motorista que possui uma utilização de automóvel em aberto.' })
    }

    const deletedDriver = memoryDb.drivers.splice(driverIndex, 1)

    return res.status(200).json({ 
      message: 'Motorista excluído com sucesso.', 
      driver: deletedDriver[0] 
    })
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao excluir motorista.' })
  }
}
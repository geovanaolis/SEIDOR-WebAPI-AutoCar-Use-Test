import { memoryDb } from '../models/database.js'

// Função auxiliar para gerar um identificador único
const generateId = () => Date.now().toString()

// Cadastrar um novo automóvel
export const createAutomobile = (req, res) => {
  try {
    const { placa, cor, marca } = req.body

    if (!placa || !cor || !marca) {
      return res.status(400).json({ 
        error: 'Os campos "placa", "cor" e "marca" são obrigatórios.' 
      })
    }

    // Verificar se a placa já existe cadastrada
    const existingAutomobile = memoryDb.automobiles.find(a => a.placa.toLowerCase() === placa.toLowerCase())
    if (existingAutomobile) {
      return res.status(400).json({ error: 'Já existe um automóvel cadastrado com esta placa.' })
    }

    const newAutomobile = {
      id: generateId(),
      placa,
      cor,
      marca
    }

    memoryDb.automobiles.push(newAutomobile)
    return res.status(201).json(newAutomobile)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao cadastrar automóvel.' })
  }
}

// Listar automóveis com filtros opcionais por cor e marca
export const getAutomobiles = (req, res) => {
  try {
    const { cor, marca } = req.query
    let automobiles = memoryDb.automobiles

    if (cor) {
      automobiles = automobiles.filter(a => 
        a.cor.toLowerCase().includes(cor.toLowerCase())
      )
    }

    if (marca) {
      automobiles = automobiles.filter(a => 
        a.marca.toLowerCase().includes(marca.toLowerCase())
      )
    }

    return res.status(200).json(automobiles)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao listar automóveis.' })
  }
}

// Recuperar um automóvel pelo seu identificador único
export const getAutomobileById = (req, res) => {
  try {
    const { id } = req.params
    const automobile = memoryDb.automobiles.find(a => a.id === id)

    if (!automobile) {
      return res.status(404).json({ error: 'Automóvel não encontrado.' })
    }

    return res.status(200).json(automobile)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao buscar automóvel.' })
  }
}

// Atualizar um automóvel cadastrado
export const updateAutomobile = (req, res) => {
  try {
    const { id } = req.params
    const { placa, cor, marca } = req.body

    const autoIndex = memoryDb.automobiles.findIndex(a => a.id === id)

    if (autoIndex === -1) {
      return res.status(404).json({ error: 'Automóvel não encontrado.' })
    }

    if (!placa || !cor || !marca) {
      return res.status(400).json({ 
        error: 'Os campos "placa", "cor" e "marca" são obrigatórios para a atualização.' 
      })
    }

    // Verificar conflito de placa com outro automóvel
    const duplicatePlaca = memoryDb.automobiles.find(a => a.placa.toLowerCase() === placa.toLowerCase() && a.id !== id)
    if (duplicatePlaca) {
      return res.status(400).json({ error: 'Já existe outro automóvel cadastrado com esta placa.' })
    }

    memoryDb.automobiles[autoIndex] = {
      ...memoryDb.automobiles[autoIndex],
      placa,
      cor,
      marca
    }

    return res.status(200).json(memoryDb.automobiles[autoIndex])
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao atualizar automóvel.' })
  }
}

// Excluir um automóvel cadastrado
export const deleteAutomobile = (req, res) => {
  try {
    const { id } = req.params
    const autoIndex = memoryDb.automobiles.findIndex(a => a.id === id)

    if (autoIndex === -1) {
      return res.status(404).json({ error: 'Automóvel não encontrado.' })
    }

    // Verificar se o automóvel possui uma utilização ativa
    const activeUsage = memoryDb.utilizations.find(u => u.automobileId === id && !u.endDate)
    if (activeUsage) {
      return res.status(400).json({ 
        error: 'Não é possível excluir um automóvel que está atualmente em utilização.' 
      })
    }

    const deletedAutomobile = memoryDb.automobiles.splice(autoIndex, 1)

    return res.status(200).json({ 
      message: 'Automóvel excluído com sucesso.', 
      automobile: deletedAutomobile[0] 
    })
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao excluir automóvel.' })
  }
}
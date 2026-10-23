import request from 'supertest'
import app from '../src/app.js'
import { memoryDb } from '../src/models/database.js'

describe('Módulo de Motoristas', () => {
  beforeEach(() => {
    // Limpa os dados em memória antes de cada teste
    memoryDb.drivers = []
  })

  it('Deve cadastrar um novo motorista com sucesso', async () => {
    const res = await request(app)
      .post('/drivers')
      .send({ nome: 'João Silva' })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.nome).toBe('João Silva')
  })

  it('Deve retornar erro 400 ao tentar cadastrar motorista sem o campo nome', async () => {
    const res = await request(app)
      .post('/drivers')
      .send({})

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('Deve listar os motoristas cadastrados', async () => {
    memoryDb.drivers.push({ id: '1', nome: 'Maria Santos' })

    const res = await request(app).get('/drivers')

    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].nome).toBe('Maria Santos')
  })

  it('Deve filtrar os motoristas por nome', async () => {
    memoryDb.drivers.push(
      { id: '1', nome: 'Carlos Eduardo' },
      { id: '2', nome: 'Ana Paula' }
    )

    const res = await request(app).get('/drivers?nome=carlos')

    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].nome).toBe('Carlos Eduardo')
  })

  it('Deve atualizar um motorista existente', async () => {
    memoryDb.drivers.push({ id: '1', nome: 'Pedro' })

    const res = await request(app)
      .put('/drivers/1')
      .send({ nome: 'Pedro Henrique' })

    expect(res.statusCode).toBe(200)
    expect(res.body.nome).toBe('Pedro Henrique')
  })

  it('Deve excluir um motorista existente', async () => {
    memoryDb.drivers.push({ id: '1', nome: 'Lucas' })

    const res = await request(app).delete('/drivers/1')

    expect(res.statusCode).toBe(200)
    expect(memoryDb.drivers.length).toBe(0)
  })
})
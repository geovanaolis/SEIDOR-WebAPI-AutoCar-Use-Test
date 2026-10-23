import request from 'supertest'
import app from '../src/app.js'
import { memoryDb } from '../src/models/database.js'

describe('Módulo de Automóveis', () => {
  beforeEach(() => {
    memoryDb.automobiles = []
  })

  it('Deve cadastrar um novo automóvel com sucesso', async () => {
    const res = await request(app)
      .post('/automobiles')
      .send({ placa: 'ABC-1234', cor: 'Azul', marca: 'Ford' })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.placa).toBe('ABC-1234')
  })

  it('Deve impedir o cadastro de automóveis com placa duplicada', async () => {
    memoryDb.automobiles.push({ id: '1', placa: 'ABC-1234', cor: 'Azul', marca: 'Ford' })

    const res = await request(app)
      .post('/automobiles')
      .send({ placa: 'ABC-1234', cor: 'Preto', marca: 'Fiat' })

    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Já existe um automóvel cadastrado com esta placa.')
  })

  it('Deve filtrar automóveis por cor e marca', async () => {
    memoryDb.automobiles.push(
      { id: '1', placa: 'AAA-1111', cor: 'Vermelho', marca: 'Ferrari' },
      { id: '2', placa: 'BBB-2222', cor: 'Azul', marca: 'Ford' }
    )

    const res = await request(app).get('/automobiles?cor=azul&marca=ford')

    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].placa).toBe('BBB-2222')
  })
})
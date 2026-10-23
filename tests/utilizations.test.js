import request from 'supertest'
import app from '../src/app.js'
import { memoryDb } from '../src/models/database.js'

describe('Módulo de Utilização de Automóveis (Regras de Negócio)', () => {
  beforeEach(() => {
    memoryDb.drivers = [{ id: 'driver1', nome: 'Motorista 1' }, { id: 'driver2', nome: 'Motorista 2' }]
    memoryDb.automobiles = [{ id: 'auto1', placa: 'AAA-1111', cor: 'Preto', marca: 'BMW' }, { id: 'auto2', placa: 'BBB-2222', cor: 'Branco', marca: 'Audi' }]
    memoryDb.utilizations = []
  })

  it('Deve iniciar uma utilização de automóvel com sucesso', async () => {
    const res = await request(app)
      .post('/utilizations')
      .send({
        driverId: 'driver1',
        automobileId: 'auto1',
        reason: 'Viagem de negócios'
      })

    expect(res.statusCode).toBe(201)
    expect(res.body.startDate).toBeDefined()
    expect(res.body.endDate).toBeNull()
  })

  it('Regra 1: Deve impedir que um automóvel seja utilizado por dois motoristas ao mesmo tempo', async () => {
    memoryDb.utilizations.push({
      id: 'util1',
      startDate: new Date().toISOString(),
      endDate: null,
      driverId: 'driver1',
      automobileId: 'auto1',
      reason: 'Uso atual'
    })

    const res = await request(app)
      .post('/utilizations')
      .send({
        driverId: 'driver2',
        automobileId: 'auto1',
        reason: 'Tentativa de uso do mesmo carro'
      })

    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Este automóvel já está em utilização por outro motorista.')
  })

  it('Regra 2: Deve impedir que um motorista utilize dois automóveis ao mesmo tempo', async () => {
    memoryDb.utilizations.push({
      id: 'util1',
      startDate: new Date().toISOString(),
      endDate: null,
      driverId: 'driver1',
      automobileId: 'auto1',
      reason: 'Uso atual'
    })

    const res = await request(app)
      .post('/utilizations')
      .send({
        driverId: 'driver1',
        automobileId: 'auto2',
        reason: 'Tentativa de uso de outro carro'
      })

    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Este motorista já possui uma utilização de automóvel em aberto.')
  })

  it('Deve finalizar uma utilização em aberto com sucesso', async () => {
    memoryDb.utilizations.push({
      id: 'util1',
      startDate: new Date().toISOString(),
      endDate: null,
      driverId: 'driver1',
      automobileId: 'auto1',
      reason: 'Uso em andamento'
    })

    const res = await request(app).patch('/utilizations/util1/end')

    expect(res.statusCode).toBe(200)
    expect(res.body.endDate).not.toBeNull()
  })
})
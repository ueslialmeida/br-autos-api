import { ListEngineService } from '@modules/engines/services/list-engine.service';

describe('ListEngineService', () => {
  const makeRepositoryMock = () => ({
    findAll: jest.fn(),
  });

  it('deve retornar a lista de motores', async () => {
    const repository = makeRepositoryMock();
    const service = new ListEngineService(repository as never);

    const engines = [
      {
        code: 'ENG-001',
        displacement: 1.6,
        power: 120,
        torque: 150,
        fuelType: 'Gasolina',
        valves: 16,
        cylinders: 4,
        synchronism: 'Corrente',
        aspiration: 'Natural',
        layout: 'Dianteiro',
        manufacturerId: 'mfr-1',
      },
    ];

    repository.findAll.mockResolvedValue(engines);

    const result = await service.execute();

    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual(engines);
  });

  it('deve retornar uma lista vazia quando não houver motores', async () => {
    const repository = makeRepositoryMock();
    const service = new ListEngineService(repository as never);

    repository.findAll.mockResolvedValue([]);

    const result = await service.execute();

    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});

import { CreateEngineService } from '@modules/engines/services/create-engine.service';

describe('CreateEngineService', () => {
  const makeRepositoryMock = () => ({
    findByCode: jest.fn(),
    create: jest.fn(),
  });

  it('deve criar um motor com sucesso', async () => {
    const repository = makeRepositoryMock();
    const service = new CreateEngineService(repository as never);

    const input = {
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
    };

    const createdEngine = {
      id: '00000000-0000-0000-0000-000000000000',
      ...input,
    };

    repository.create.mockResolvedValue(createdEngine);

    const result = await service.execute(input);

    expect(repository.create).toHaveBeenCalledWith(input);
    expect(result).toEqual({ ...input, id: '00000000-0000-0000-0000-000000000000' });
  });
});

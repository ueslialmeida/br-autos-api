import type {
  EngineFilters,
  EnginePaginationOptions,
} from '@modules/engines/repositories/engines.repository';
import { ListEngineService } from '@modules/engines/services/list-engine.service';

const MANUFACTURER_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('ListEngineService', () => {
  const makeRepositoryMock = () => ({
    findAll: jest.fn(),
  });

  const sampleEngine = {
    id: '660e8400-e29b-41d4-a716-446655440001',
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
    manufacturerId: MANUFACTURER_UUID,
  };

  it('deve retornar a lista de motores com paginação padrão quando nada for informado', async () => {
    const repository = makeRepositoryMock();
    const service = new ListEngineService(repository as never);

    repository.findAll.mockResolvedValue({
      data: [sampleEngine],
      totalItems: 1,
      page: 1,
      limit: 20,
    });

    const result = await service.execute();

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.findAll).toHaveBeenCalledWith({}, {});
    expect(result).toEqual({
      data: [sampleEngine],
      pagination: {
        page: 1,
        limit: 20,
        totalItems: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it('deve repassar filtros e opções de paginação para repository.findAll', async () => {
    const repository = makeRepositoryMock();
    const service = new ListEngineService(repository as never);

    const filters: EngineFilters = {
      code: '200 TSI',
      fuelType: 'Flex',
      aspiration: 'Turbo',
      manufacturerId: MANUFACTURER_UUID,
      manufacturerName: 'Volkswagen',
    };
    const pagination: EnginePaginationOptions = {
      page: 2,
      limit: 5,
      sortBy: 'power',
      order: 'desc',
    };

    repository.findAll.mockResolvedValue({
      data: [sampleEngine],
      totalItems: 12,
      page: 2,
      limit: 5,
    });

    const result = await service.execute(filters, pagination);

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.findAll).toHaveBeenCalledWith(filters, pagination);
    expect(result).toEqual({
      data: [sampleEngine],
      pagination: {
        page: 2,
        limit: 5,
        totalItems: 12,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      },
    });
  });

  it('deve retornar uma lista vazia e metadados zerados quando não houver motores', async () => {
    const repository = makeRepositoryMock();
    const service = new ListEngineService(repository as never);

    repository.findAll.mockResolvedValue({
      data: [],
      totalItems: 0,
      page: 1,
      limit: 20,
    });

    const result = await service.execute();

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.findAll).toHaveBeenCalledWith({}, {});
    expect(result).toEqual({
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it('deve propagar erro caso repository.findAll falhe', async () => {
    const repository = makeRepositoryMock();
    const service = new ListEngineService(repository as never);

    repository.findAll.mockRejectedValue(new Error('Falha ao listar motores'));

    await expect(service.execute({ fuelType: 'Flex' })).rejects.toThrow('Falha ao listar motores');
  });
});

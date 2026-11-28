import type {
  VehicleFilters,
  VehiclePaginationOptions,
  VehiclesRepository,
} from '@modules/vehicles/repositories/vehicles.repository';

import { ListVehicleService } from './list-vehicle.service';

const FIRST_VEHICLE_UUID = '550e8400-e29b-41d4-a716-446655440000';
const SECOND_VEHICLE_UUID = '660e8400-e29b-41d4-a716-446655440001';
const MANUFACTURER_UUID = '770e8400-e29b-41d4-a716-446655440002';
const ENGINE_UUID = '880e8400-e29b-41d4-a716-446655440003';

describe('ListVehicleService', () => {
  let service: ListVehicleService;
  let repository: jest.Mocked<Pick<VehiclesRepository, 'findAll'>>;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
    };

    service = new ListVehicleService(repository as unknown as VehiclesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve listar veículos com paginação padrão quando nenhum filtro ou opção for informada', async () => {
    const vehicles = [
      { id: FIRST_VEHICLE_UUID, model: 'Onix Plus' },
      { id: SECOND_VEHICLE_UUID, model: 'Corolla' },
    ];

    repository.findAll.mockResolvedValue({
      data: vehicles,
      totalItems: 2,
      page: 1,
      limit: 20,
    } as never);

    const result = await service.execute();

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.findAll).toHaveBeenCalledWith({}, {});
    expect(result).toEqual({
      data: vehicles,
      pagination: {
        page: 1,
        limit: 20,
        totalItems: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it('deve repassar todos os filtros e opções de paginação para repository.findAll', async () => {
    const filters: VehicleFilters = {
      startYear: 2020,
      endYear: 2024,
      model: 'Cobalt',
      manufacturerId: MANUFACTURER_UUID,
      manufacturerName: 'Chevrolet',
      engineId: ENGINE_UUID,
      engineCode: 'SPE/4 1.8',
    };
    const pagination: VehiclePaginationOptions = {
      page: 2,
      limit: 5,
      sortBy: 'model',
      order: 'asc',
    };

    const filteredVehicles = [{ id: FIRST_VEHICLE_UUID, model: 'Cobalt' }];
    repository.findAll.mockResolvedValue({
      data: filteredVehicles,
      totalItems: 6,
      page: 2,
      limit: 5,
    } as never);

    const result = await service.execute(filters, pagination);

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.findAll).toHaveBeenCalledWith(filters, pagination);
    expect(result).toEqual({
      data: filteredVehicles,
      pagination: {
        page: 2,
        limit: 5,
        totalItems: 6,
        totalPages: 2,
        hasNextPage: false,
        hasPreviousPage: true,
      },
    });
  });

  it('deve calcular corretamente totalPages, hasNextPage e hasPreviousPage em página intermediária', async () => {
    const vehicles = [{ id: SECOND_VEHICLE_UUID, model: 'HB20' }];
    repository.findAll.mockResolvedValue({
      data: vehicles,
      totalItems: 25,
      page: 2,
      limit: 10,
    } as never);

    const result = await service.execute({ model: 'HB20' }, { page: 2, limit: 10 });

    expect(result.pagination).toEqual({
      page: 2,
      limit: 10,
      totalItems: 25,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  it('deve retornar totalPages 0 e flags falsas quando não houver resultados', async () => {
    repository.findAll.mockResolvedValue({
      data: [],
      totalItems: 0,
      page: 1,
      limit: 20,
    } as never);

    const result = await service.execute({ model: 'Inexistente' });

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
    const dbError = new Error('Falha ao listar veículos');
    repository.findAll.mockRejectedValue(dbError);

    await expect(service.execute({ model: 'Civic' })).rejects.toThrow('Falha ao listar veículos');
    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.findAll).toHaveBeenCalledWith({ model: 'Civic' }, {});
  });
});

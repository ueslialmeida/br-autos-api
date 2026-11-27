import type {
  VehicleFilters,
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

  it('deve listar todos os veículos quando nenhum filtro for informado', async () => {
    const vehicles = [
      { id: FIRST_VEHICLE_UUID, model: 'Onix Plus' },
      { id: SECOND_VEHICLE_UUID, model: 'Corolla' },
    ];

    repository.findAll.mockResolvedValue(vehicles as never);

    const result = await service.execute();

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(vehicles);
  });

  it('deve repassar todos os filtros de VehicleFilters para repository.findAll', async () => {
    const filters: VehicleFilters = {
      startYear: 2020,
      endYear: 2024,
      model: 'Cobalt',
      manufacturerId: MANUFACTURER_UUID,
      manufacturerName: 'Chevrolet',
      engineId: ENGINE_UUID,
      engineCode: 'SPE/4 1.8',
    };

    const filteredVehicles = [{ id: FIRST_VEHICLE_UUID, ...filters }];
    repository.findAll.mockResolvedValue(filteredVehicles as never);

    const result = await service.execute(filters);

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.findAll).toHaveBeenCalledWith(filters);
    expect(result).toEqual(filteredVehicles);
  });

  it('deve repassar filtros parciais corretamente', async () => {
    const filters: VehicleFilters = {
      startYear: 2022,
      endYear: 2022,
      model: 'HB20',
    };

    repository.findAll.mockResolvedValue([] as never);

    const result = await service.execute(filters);

    expect(repository.findAll).toHaveBeenCalledWith(filters);
    expect(result).toEqual([]);
  });

  it('deve propagar erro caso repository.findAll falhe', async () => {
    const dbError = new Error('Falha ao listar veículos');
    repository.findAll.mockRejectedValue(dbError);

    await expect(service.execute({ model: 'Civic' })).rejects.toThrow('Falha ao listar veículos');
    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.findAll).toHaveBeenCalledWith({ model: 'Civic' });
  });
});

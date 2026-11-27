import type { CreateVehicleDTO } from '@modules/vehicles/dtos/index';
import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';

import { CreateVehicleService } from './create-vehicle.service';

const MANUFACTURER_UUID = '550e8400-e29b-41d4-a716-446655440000';
const ENGINE_UUID = '660e8400-e29b-41d4-a716-446655440001';
const VEHICLE_UUID = '770e8400-e29b-41d4-a716-446655440002';

describe('CreateVehicleService', () => {
  let service: CreateVehicleService;
  let repository: jest.Mocked<Pick<VehiclesRepository, 'create'>>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
    };

    service = new CreateVehicleService(repository as unknown as VehiclesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar e retornar um veículo chamando repository.create com o DTO', async () => {
    const dto = {
      model: 'Onix Plus',
      generation: 2,
      manufacturerId: MANUFACTURER_UUID,
      engineId: ENGINE_UUID,
      category: 'Hatchback',
      bodyType: 'Sedan',
      manufacturingPeriodStart: 2020,
      manufacturingPeriodEnd: 2024,
    } as CreateVehicleDTO;

    const createdVehicle = {
      id: VEHICLE_UUID,
      ...dto,
    };

    repository.create.mockResolvedValue(createdVehicle as never);

    const result = await service.execute(dto);

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(createdVehicle);
  });

  it('deve permitir criar veículos com mesmo modelo e geração sem bloquear duplicidade', async () => {
    const firstVehicleDto = {
      model: 'HB20',
      generation: 1,
      manufacturerId: MANUFACTURER_UUID,
      engineId: ENGINE_UUID,
      category: 'Hatchback',
      bodyType: 'Sedan',
      manufacturingPeriodStart: 2020,
      manufacturingPeriodEnd: 2024,
    } as CreateVehicleDTO;

    const secondVehicleDto = {
      model: 'HB20',
      generation: 1,
      manufacturerId: MANUFACTURER_UUID,
      engineId: ENGINE_UUID,
      category: 'Hatchback',
      bodyType: 'Sedan',
      manufacturingPeriodStart: 2020,
      manufacturingPeriodEnd: 2024,
    } as CreateVehicleDTO;

    repository.create
      .mockResolvedValueOnce({ id: VEHICLE_UUID, ...firstVehicleDto } as never)
      .mockResolvedValueOnce({
        id: '880e8400-e29b-41d4-a716-446655440003',
        ...secondVehicleDto,
      } as never);

    const firstResult = await service.execute(firstVehicleDto);
    const secondResult = await service.execute(secondVehicleDto);

    expect(repository.create).toHaveBeenCalledTimes(2);
    expect(firstResult.id).toBe(VEHICLE_UUID);
    expect(secondResult.manufacturingPeriodStart).toBe(2020);
  });

  it('deve propagar o erro caso repository.create falhe', async () => {
    const dto = {
      model: 'Civic',
      manufacturerId: MANUFACTURER_UUID,
      engineId: ENGINE_UUID,
    } as CreateVehicleDTO;

    const dbError = new Error('Falha ao persistir veículo no banco');
    repository.create.mockRejectedValue(dbError);

    await expect(service.execute(dto)).rejects.toThrow('Falha ao persistir veículo no banco');
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith(dto);
  });
});

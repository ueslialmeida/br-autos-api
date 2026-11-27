import type { UpdateVehicleDTO } from '@modules/vehicles/dtos/index';
import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';
import { NotFoundError } from '@shared/errors/AppError';

import { UpdateVehicleService } from './update-vehicle.service';

const VEHICLE_UUID = '550e8400-e29b-41d4-a716-446655440000';
const MISSING_VEHICLE_UUID = '660e8400-e29b-41d4-a716-446655440001';
const ENGINE_UUID = '660e8400-e29b-41d4-a716-446655440001';
const MANUFACTURER_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('UpdateVehicleService', () => {
  let service: UpdateVehicleService;
  let repository: jest.Mocked<Pick<VehiclesRepository, 'findById' | 'update'>>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    service = new UpdateVehicleService(repository as unknown as VehiclesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve atualizar e retornar o veículo quando ele existir', async () => {
    const existingVehicle = {
      id: VEHICLE_UUID,
      model: 'Cobalt LTZ',
      generation: 1,
      manufacturerId: MANUFACTURER_UUID,
      engineId: ENGINE_UUID,
      category: 'Hatchback',
      bodyType: 'Sedan',
      manufacturingPeriodStart: 2020,
      manufacturingPeriodEnd: 2024,
    };
    const updateData = {
      id: VEHICLE_UUID,
      model: 'Cobalt LTZ 1.8',
      generation: 1,
      manufacturerId: MANUFACTURER_UUID,
      engineId: ENGINE_UUID,
      category: 'Hatchback',
      bodyType: 'Sedan',
      manufacturingPeriodStart: 2020,
      manufacturingPeriodEnd: 2024,
    } as UpdateVehicleDTO;

    const updatedVehicle = {
      ...existingVehicle,
      ...updateData,
    };

    repository.findById.mockResolvedValue(existingVehicle as never);
    repository.update.mockResolvedValue(updatedVehicle as never);

    const result = await service.execute(VEHICLE_UUID, updateData);

    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(VEHICLE_UUID);
    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith(VEHICLE_UUID, updateData);
    expect(result).toEqual(updatedVehicle);
  });

  it('deve lançar NotFoundError e não chamar update quando o veículo não existir', async () => {
    const updateData = { model: 'Onix Plus' } as UpdateVehicleDTO;
    repository.findById.mockResolvedValue(null as never);

    await expect(service.execute(MISSING_VEHICLE_UUID, updateData)).rejects.toThrow(NotFoundError);
    await expect(service.execute(MISSING_VEHICLE_UUID, updateData)).rejects.toThrow(
      'Veículo não encontrado.',
    );
    expect(repository.findById).toHaveBeenCalledWith(MISSING_VEHICLE_UUID);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('deve propagar erro caso repository.findById falhe', async () => {
    const updateData = { model: 'Cruze' } as UpdateVehicleDTO;
    const dbError = new Error('Falha ao buscar veículo');
    repository.findById.mockRejectedValue(dbError);

    await expect(service.execute(VEHICLE_UUID, updateData)).rejects.toThrow(
      'Falha ao buscar veículo',
    );
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('deve propagar erro caso repository.update falhe após encontrar o veículo', async () => {
    const existingVehicle = { id: VEHICLE_UUID, model: 'Civic' };
    const updateData = { model: 'Civic Touring' } as UpdateVehicleDTO;
    const dbError = new Error('Falha ao atualizar veículo');

    repository.findById.mockResolvedValue(existingVehicle as never);
    repository.update.mockRejectedValue(dbError);

    await expect(service.execute(VEHICLE_UUID, updateData)).rejects.toThrow(
      'Falha ao atualizar veículo',
    );
    expect(repository.findById).toHaveBeenCalledWith(VEHICLE_UUID);
    expect(repository.update).toHaveBeenCalledWith(VEHICLE_UUID, updateData);
  });
});

import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';
import { NotFoundError } from '@shared/errors/AppError';

import { GetVehicleByIdService } from './get-vehicle-by-id.service';

const VEHICLE_UUID = '550e8400-e29b-41d4-a716-446655440000';
const MISSING_VEHICLE_UUID = '660e8400-e29b-41d4-a716-446655440001';

describe('GetVehicleByIdService', () => {
  let service: GetVehicleByIdService;
  let repository: jest.Mocked<Pick<VehiclesRepository, 'findById'>>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
    };

    service = new GetVehicleByIdService(repository as unknown as VehiclesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o veículo quando encontrado pelo id', async () => {
    const vehicle = {
      id: VEHICLE_UUID,
      model: 'Onix Plus',
      generation: '2ª geração',
    };

    repository.findById.mockResolvedValue(vehicle as never);

    const result = await service.execute(VEHICLE_UUID);

    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(VEHICLE_UUID);
    expect(result).toEqual(vehicle);
  });

  it('deve lançar NotFoundError quando o veículo não for encontrado', async () => {
    repository.findById.mockResolvedValue(null as never);

    await expect(service.execute(MISSING_VEHICLE_UUID)).rejects.toThrow(NotFoundError);
    await expect(service.execute(MISSING_VEHICLE_UUID)).rejects.toThrow('Veículo não encontrado.');
    expect(repository.findById).toHaveBeenCalledWith(MISSING_VEHICLE_UUID);
  });

  it('deve propagar erro caso repository.findById falhe', async () => {
    const dbError = new Error('Erro ao consultar veículo por id');
    repository.findById.mockRejectedValue(dbError);

    await expect(service.execute(VEHICLE_UUID)).rejects.toThrow('Erro ao consultar veículo por id');
    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(VEHICLE_UUID);
  });
});

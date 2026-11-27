import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';
import { NotFoundError } from '@shared/errors/AppError';

import { DeleteVehicleService } from './delete-vehicle.service';

const VEHICLE_UUID = '550e8400-e29b-41d4-a716-446655440000';
const MISSING_UUID = '660e8400-e29b-41d4-a716-446655440001';

describe('DeleteVehicleService', () => {
  let service: DeleteVehicleService;
  let repository: jest.Mocked<Pick<VehiclesRepository, 'findById'>>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
    };

    service = new DeleteVehicleService(repository as unknown as VehiclesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve concluir sem erros quando o veículo existir', async () => {
    const existingVehicle = {
      id: VEHICLE_UUID,
      model: 'Onix Plus',
    };

    repository.findById.mockResolvedValue(existingVehicle as never);

    await expect(service.execute(VEHICLE_UUID)).resolves.toBeUndefined();
    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(VEHICLE_UUID);
  });

  it('deve lançar NotFoundError quando o veículo não for encontrado', async () => {
    repository.findById.mockResolvedValue(null as never);

    await expect(service.execute(MISSING_UUID)).rejects.toThrow(NotFoundError);
    await expect(service.execute(MISSING_UUID)).rejects.toThrow('Veículo não encontrado.');
    expect(repository.findById).toHaveBeenCalledWith(MISSING_UUID);
  });

  it('deve propagar erro caso repository.findById falhe', async () => {
    const dbError = new Error('Erro de conexão com o banco');
    repository.findById.mockRejectedValue(dbError);

    await expect(service.execute(VEHICLE_UUID)).rejects.toThrow('Erro de conexão com o banco');
    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(VEHICLE_UUID);
  });
});

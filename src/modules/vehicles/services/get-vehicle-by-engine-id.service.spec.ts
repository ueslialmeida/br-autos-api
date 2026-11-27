import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';
import { NotFoundError } from '@shared/errors/AppError';

import { GetVehicleByEngineIdService } from './get-vehicle-by-engine-id.service';

const ENGINE_UUID = '550e8400-e29b-41d4-a716-446655440000';
const MISSING_ENGINE_UUID = '660e8400-e29b-41d4-a716-446655440001';
const FIRST_VEHICLE_UUID = '770e8400-e29b-41d4-a716-446655440002';
const SECOND_VEHICLE_UUID = '880e8400-e29b-41d4-a716-446655440003';

describe('GetVehicleByEngineIdService', () => {
  let service: GetVehicleByEngineIdService;
  let repository: jest.Mocked<Pick<VehiclesRepository, 'findByEngineId'>>;

  beforeEach(() => {
    repository = {
      findByEngineId: jest.fn(),
    };

    service = new GetVehicleByEngineIdService(repository as unknown as VehiclesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar os veículos encontrados para o engineId informado', async () => {
    const vehicles = [
      { id: FIRST_VEHICLE_UUID, model: 'Onix', engineId: ENGINE_UUID },
      { id: SECOND_VEHICLE_UUID, model: 'Tracker', engineId: ENGINE_UUID },
    ];

    repository.findByEngineId.mockResolvedValue(vehicles as never);

    const result = await service.execute(ENGINE_UUID);

    expect(repository.findByEngineId).toHaveBeenCalledTimes(1);
    expect(repository.findByEngineId).toHaveBeenCalledWith(ENGINE_UUID);
    expect(result).toEqual(vehicles);
  });

  it('deve lançar NotFoundError quando nenhum veículo for encontrado para o engineId', async () => {
    repository.findByEngineId.mockResolvedValue([] as never);

    await expect(service.execute(MISSING_ENGINE_UUID)).rejects.toThrow(NotFoundError);
    await expect(service.execute(MISSING_ENGINE_UUID)).rejects.toThrow(
      'Veículos não encontrados para esse motor.',
    );
    expect(repository.findByEngineId).toHaveBeenCalledWith(MISSING_ENGINE_UUID);
  });

  it('deve propagar erro caso repository.findByEngineId falhe', async () => {
    const dbError = new Error('Falha na consulta por engineId');
    repository.findByEngineId.mockRejectedValue(dbError);

    await expect(service.execute(ENGINE_UUID)).rejects.toThrow('Falha na consulta por engineId');
    expect(repository.findByEngineId).toHaveBeenCalledTimes(1);
    expect(repository.findByEngineId).toHaveBeenCalledWith(ENGINE_UUID);
  });
});

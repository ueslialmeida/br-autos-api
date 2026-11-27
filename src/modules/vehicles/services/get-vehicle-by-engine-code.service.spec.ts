import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';
import { NotFoundError } from '@shared/errors/AppError';

import { GetVehicleByEngineCodeService } from './get-vehicle-by-engine-code.service';

const VEHICLE_UUID = '550e8400-e29b-41d4-a716-446655440000';
const SECOND_VEHICLE_UUID = '660e8400-e29b-41d4-a716-446655440001';

describe('GetVehicleByEngineCodeService', () => {
  let service: GetVehicleByEngineCodeService;
  let repository: jest.Mocked<Pick<VehiclesRepository, 'findByEngineCode'>>;

  beforeEach(() => {
    repository = {
      findByEngineCode: jest.fn(),
    };

    service = new GetVehicleByEngineCodeService(repository as unknown as VehiclesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar os veículos encontrados para o código de motor informado', async () => {
    const engineCode = '2ZR-FBE';
    const vehicles = [
      { id: VEHICLE_UUID, model: 'Corolla', engineCode },
      { id: SECOND_VEHICLE_UUID, model: 'Corolla Cross', engineCode },
    ];

    repository.findByEngineCode.mockResolvedValue(vehicles as never);

    const result = await service.execute(engineCode);

    expect(repository.findByEngineCode).toHaveBeenCalledTimes(1);
    expect(repository.findByEngineCode).toHaveBeenCalledWith(engineCode);
    expect(result).toEqual(vehicles);
  });

  it('deve lançar NotFoundError quando nenhum veículo for encontrado para o código de motor', async () => {
    const engineCode = 'INEXISTENTE-123';
    repository.findByEngineCode.mockResolvedValue([] as never);

    await expect(service.execute(engineCode)).rejects.toThrow(NotFoundError);
    await expect(service.execute(engineCode)).rejects.toThrow(
      'Veículos não encontrados para esse código de motor.',
    );
    expect(repository.findByEngineCode).toHaveBeenCalledWith(engineCode);
  });

  it('deve propagar erro caso repository.findByEngineCode falhe', async () => {
    const engineCode = 'CSS-PRIME-1.0';
    const dbError = new Error('Falha na consulta por código de motor');
    repository.findByEngineCode.mockRejectedValue(dbError);

    await expect(service.execute(engineCode)).rejects.toThrow(
      'Falha na consulta por código de motor',
    );
    expect(repository.findByEngineCode).toHaveBeenCalledTimes(1);
    expect(repository.findByEngineCode).toHaveBeenCalledWith(engineCode);
  });
});

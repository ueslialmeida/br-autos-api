import type { VehiclesRepository } from '@modules/vehicles/repositories/vehicles.repository';
import { NotFoundError } from '@shared/errors/AppError';

import { GetVehicleByManufacturerIdService } from './get-vehicle-by-manufacturer-id.service';

const MANUFACTURER_UUID = '550e8400-e29b-41d4-a716-446655440000';
const MISSING_MANUFACTURER_UUID = '660e8400-e29b-41d4-a716-446655440001';
const FIRST_VEHICLE_UUID = '770e8400-e29b-41d4-a716-446655440002';
const SECOND_VEHICLE_UUID = '880e8400-e29b-41d4-a716-446655440003';

describe('GetVehicleByManufacturerIdService', () => {
  let service: GetVehicleByManufacturerIdService;
  let repository: jest.Mocked<Pick<VehiclesRepository, 'findByManufacturerId'>>;

  beforeEach(() => {
    repository = {
      findByManufacturerId: jest.fn(),
    };

    service = new GetVehicleByManufacturerIdService(repository as unknown as VehiclesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar os veículos encontrados para o manufacturerId informado', async () => {
    const vehicles = [
      { id: FIRST_VEHICLE_UUID, model: 'Onix', manufacturerId: MANUFACTURER_UUID },
      { id: SECOND_VEHICLE_UUID, model: 'Cobalt', manufacturerId: MANUFACTURER_UUID },
    ];

    repository.findByManufacturerId.mockResolvedValue(vehicles as never);

    const result = await service.execute(MANUFACTURER_UUID);

    expect(repository.findByManufacturerId).toHaveBeenCalledTimes(1);
    expect(repository.findByManufacturerId).toHaveBeenCalledWith(MANUFACTURER_UUID);
    expect(result).toEqual(vehicles);
  });

  it('deve lançar NotFoundError quando nenhum veículo for encontrado para o manufacturerId', async () => {
    repository.findByManufacturerId.mockResolvedValue([] as never);

    await expect(service.execute(MISSING_MANUFACTURER_UUID)).rejects.toThrow(NotFoundError);
    await expect(service.execute(MISSING_MANUFACTURER_UUID)).rejects.toThrow(
      'Veículos não encontrados para esse fabricante.',
    );
    expect(repository.findByManufacturerId).toHaveBeenCalledWith(MISSING_MANUFACTURER_UUID);
  });

  it('deve propagar erro caso repository.findByManufacturerId falhe', async () => {
    const dbError = new Error('Falha na consulta por manufacturerId');
    repository.findByManufacturerId.mockRejectedValue(dbError);

    await expect(service.execute(MANUFACTURER_UUID)).rejects.toThrow(
      'Falha na consulta por manufacturerId',
    );
    expect(repository.findByManufacturerId).toHaveBeenCalledTimes(1);
    expect(repository.findByManufacturerId).toHaveBeenCalledWith(MANUFACTURER_UUID);
  });
});

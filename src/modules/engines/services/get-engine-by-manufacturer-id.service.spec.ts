import { GetEngineByManufacturerIdService } from '@modules/engines/services/get-engine-by-manufacturer-id.service';
import { NotFoundError } from '@shared/errors/AppError';

describe('GetEngineByManufacturerIdService', () => {
  const makeRepositoryMock = () => ({
    findByManufacturerId: jest.fn(),
  });

  it('deve retornar os motores quando o manufacturerId existir', async () => {
    const repository = makeRepositoryMock();
    const service = new GetEngineByManufacturerIdService(repository as never);

    const engines = [
      {
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
        manufacturerId: 'mfr-1',
      },
    ];

    repository.findByManufacturerId.mockResolvedValue(engines);

    const result = await service.execute('mfr-1');

    expect(repository.findByManufacturerId).toHaveBeenCalledWith('mfr-1');
    expect(result).toEqual(engines);
  });

  it('deve lançar NotFoundError quando não houver motores para o manufacturerId especificado', async () => {
    const repository = makeRepositoryMock();
    const service = new GetEngineByManufacturerIdService(repository as never);

    repository.findByManufacturerId.mockResolvedValue(null);

    await expect(service.execute('mfr-inexistente')).rejects.toBeInstanceOf(NotFoundError);
    expect(repository.findByManufacturerId).toHaveBeenCalledWith('mfr-inexistente');
  });
});

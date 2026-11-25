import { GetEngineByManufacturerNameService } from '@modules/engines/services/get-engine-by-manufacturer-name.service';
import { NotFoundError } from '@shared/errors/AppError';

describe('GetEngineByManufacturerNameService', () => {
  const makeRepositoryMock = () => ({
    findByManufacturerName: jest.fn(),
  });

  it('deve retornar os motores quando o manufacturerName existir', async () => {
    const repository = makeRepositoryMock();
    const service = new GetEngineByManufacturerNameService(repository as never);

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

    repository.findByManufacturerName.mockResolvedValue(engines);

    const result = await service.execute('mfr-1');

    expect(repository.findByManufacturerName).toHaveBeenCalledWith('mfr-1');
    expect(result).toEqual(engines);
  });

  it('deve lançar NotFoundError quando não houver motores para o manufacturerName especificado', async () => {
    const repository = makeRepositoryMock();
    const service = new GetEngineByManufacturerNameService(repository as never);

    repository.findByManufacturerName.mockResolvedValue(null);

    await expect(service.execute('mfr-inexistente')).rejects.toBeInstanceOf(NotFoundError);
    expect(repository.findByManufacturerName).toHaveBeenCalledWith('mfr-inexistente');
  });
});

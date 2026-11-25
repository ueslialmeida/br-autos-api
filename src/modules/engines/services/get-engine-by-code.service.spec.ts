import { GetEngineByCodeService } from '@modules/engines/services/get-engine-by-code.service';
import { NotFoundError } from '@shared/errors/AppError';

describe('GetEngineByCodeService', () => {
  const makeRepositoryMock = () => ({
    findByCode: jest.fn(),
  });

  it('deve retornar o motor quando o código existir', async () => {
    const repository = makeRepositoryMock();
    const service = new GetEngineByCodeService(repository as never);

    const engine = {
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
    };

    repository.findByCode.mockResolvedValue(engine);

    const result = await service.execute(engine.code);

    expect(repository.findByCode).toHaveBeenCalledWith(engine.code);
    expect(result).toEqual(engine);
  });

  it('deve lançar NotFoundError quando o motor não for encontrado pelo código', async () => {
    const repository = makeRepositoryMock();
    const service = new GetEngineByCodeService(repository as never);

    repository.findByCode.mockResolvedValue(null);

    await expect(service.execute('ENG-002')).rejects.toBeInstanceOf(NotFoundError);
    expect(repository.findByCode).toHaveBeenCalledWith('ENG-002');
  });
});

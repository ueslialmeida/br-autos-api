import { GetEngineByIdService } from '@modules/engines/services/get-engine-by-id.service';
import { NotFoundError } from '@shared/errors/AppError';

describe('GetEngineByIdService', () => {
  const makeRepositoryMock = () => ({
    findById: jest.fn(),
  });

  it('deve retornar o motor quando o id existir', async () => {
    const repository = makeRepositoryMock();
    const service = new GetEngineByIdService(repository as never);

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

    repository.findById.mockResolvedValue(engine);

    const result = await service.execute('eng-1');

    expect(repository.findById).toHaveBeenCalledWith('eng-1');
    expect(result).toEqual(engine);
  });

  it('deve lançar NotFoundError quando o motor não for encontrado pelo id', async () => {
    const repository = makeRepositoryMock();
    const service = new GetEngineByIdService(repository as never);

    repository.findById.mockResolvedValue(null);

    await expect(service.execute('id-inexistente')).rejects.toBeInstanceOf(NotFoundError);
    expect(repository.findById).toHaveBeenCalledWith('id-inexistente');
  });
});

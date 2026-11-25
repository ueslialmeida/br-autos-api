import { UpdateEngineService } from '@modules/engines/services/update-engine.service';
import { NotFoundError } from '@shared/errors/AppError';

describe('UpdateEngineService', () => {
  const makeRepositoryMock = () => ({
    findById: jest.fn(),
    update: jest.fn(),
  });

  it('deve atualizar o motor quando o id existir', async () => {
    const repository = makeRepositoryMock();
    const service = new UpdateEngineService(repository as never);

    const existingEngine = {
      id: 'eng-1',
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

    const updatedEngine = {
      id: 'eng-1',
      code: 'ENG-001',
      displacement: 2.0,
      power: 150,
      torque: 180,
      fuelType: 'Gasolina',
      valves: 16,
      cylinders: 4,
      synchronism: 'Corrente',
      aspiration: 'Natural',
      layout: 'Dianteiro',
      manufacturerId: 'mfr-1',
    };

    repository.findById.mockResolvedValue(existingEngine);
    repository.update.mockResolvedValue(updatedEngine);

    const result = await service.execute('eng-1', updatedEngine);

    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(existingEngine.id);
    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith('eng-1', updatedEngine);
    expect(result).toEqual(updatedEngine);
  });

  it('deve lançar NotFoundError quando o motor não for encontrado pelo id', async () => {
    const repository = makeRepositoryMock();
    const service = new UpdateEngineService(repository as never);

    repository.findById.mockResolvedValue(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await expect(service.execute('id-inexistente', {} as any)).rejects.toBeInstanceOf(
      NotFoundError,
    );

    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith('id-inexistente');
    expect(repository.update).not.toHaveBeenCalled();
  });
});

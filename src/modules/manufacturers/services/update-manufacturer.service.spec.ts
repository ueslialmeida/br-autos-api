import { UpdateManufacturerService } from '@modules/manufacturers/services/update-manufacturer.service';
import { NotFoundError } from '@shared/errors/AppError';

describe('UpdateManufacturerService', () => {
  const makeRepositoryMock = () => ({
    findById: jest.fn(),
    update: jest.fn(),
  });

  it('deve atualizar e retornar o fabricante quando o id existir', async () => {
    const repository = makeRepositoryMock();
    const service = new UpdateManufacturerService(repository as never);

    const existingManufacturer = {
      id: 'mfr-1',
      name: 'Gurgel',
      country: 'Brasil',
    };

    const input = {
      name: 'Gurgel Motores',
    };

    const updatedManufacturer = {
      ...existingManufacturer,
      ...input,
    };

    repository.findById.mockResolvedValue(existingManufacturer);
    repository.update.mockResolvedValue(updatedManufacturer);

    const result = await service.execute('mfr-1', input);

    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith('mfr-1');
    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith('mfr-1', input);
    expect(result).toEqual(updatedManufacturer);
  });

  it('deve lançar NotFoundError e não atualizar quando o fabricante não existir', async () => {
    const repository = makeRepositoryMock();
    const service = new UpdateManufacturerService(repository as never);

    repository.findById.mockResolvedValue(null);

    await expect(service.execute('id-inexistente', { name: 'Novo Nome' })).rejects.toBeInstanceOf(
      NotFoundError,
    );

    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith('id-inexistente');
    expect(repository.update).not.toHaveBeenCalled();
  });
});

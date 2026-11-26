import { GetManufacturerByNameService } from '@modules/manufacturers/services/get-manufacturer-by-name.service';
import { NotFoundError } from '@shared/errors/AppError';

describe('GetManufacturerByNameService', () => {
  const makeRepositoryMock = () => ({
    findByName: jest.fn(),
  });

  it('deve retornar o fabricante quando o nome existir', async () => {
    const repository = makeRepositoryMock();
    const service = new GetManufacturerByNameService(repository as never);

    const mockManufacturer = {
      id: 'mfr-1',
      name: 'Honda',
    };

    repository.findByName.mockResolvedValue(mockManufacturer);

    const result = await service.execute('Honda');

    expect(repository.findByName).toHaveBeenCalledTimes(1);
    expect(repository.findByName).toHaveBeenCalledWith('Honda');
    expect(result).toEqual(mockManufacturer);
  });

  it('deve lançar NotFoundError quando o fabricante não for encontrado', async () => {
    const repository = makeRepositoryMock();
    const service = new GetManufacturerByNameService(repository as never);

    repository.findByName.mockResolvedValue(null);

    await expect(service.execute('nome-inexistente')).rejects.toBeInstanceOf(NotFoundError);
    expect(repository.findByName).toHaveBeenCalledTimes(1);
    expect(repository.findByName).toHaveBeenCalledWith('nome-inexistente');
  });
});

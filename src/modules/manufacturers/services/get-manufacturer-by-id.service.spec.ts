import { GetManufacturerByIdService } from '@modules/manufacturers/services/get-manufacturer-by-id.service';
import { NotFoundError } from '@shared/errors/AppError';

describe('GetManufacturerByIdService', () => {
  const makeRepositoryMock = () => ({
    findById: jest.fn(),
  });

  it('deve retornar o fabricante quando o id existir', async () => {
    const repository = makeRepositoryMock();
    const service = new GetManufacturerByIdService(repository as never);

    const mockManufacturer = {
      id: 'mfr-1',
      name: 'Honda',
    };

    repository.findById.mockResolvedValue(mockManufacturer);

    const result = await service.execute('mfr-1');

    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith('mfr-1');
    expect(result).toEqual(mockManufacturer);
  });

  it('deve lançar NotFoundError quando o fabricante não for encontrado', async () => {
    const repository = makeRepositoryMock();
    const service = new GetManufacturerByIdService(repository as never);

    repository.findById.mockResolvedValue(null);

    await expect(service.execute('id-inexistente')).rejects.toBeInstanceOf(NotFoundError);
    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith('id-inexistente');
  });
});

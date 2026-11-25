import { DeleteManufacturerService } from '@modules/manufacturers/services/delete-manufacturer.service';
import { NotFoundError } from '@shared/errors/AppError';

describe('DeleteManufacturerService', () => {
  const makeRepositoryMock = () => ({
    delete: jest.fn(),
  });

  it('deve remover o fabricante quando o id existir', async () => {
    const repository = makeRepositoryMock();
    const service = new DeleteManufacturerService(repository as never);

    repository.delete.mockResolvedValue(true);

    await expect(service.execute('mfr-1')).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledTimes(1);
    expect(repository.delete).toHaveBeenCalledWith('mfr-1');
  });

  it('deve lançar NotFoundError quando o fabricante não for encontrado para exclusão', async () => {
    const repository = makeRepositoryMock();
    const service = new DeleteManufacturerService(repository as never);

    repository.delete.mockResolvedValue(false);

    await expect(service.execute('id-inexistente')).rejects.toBeInstanceOf(NotFoundError);
    expect(repository.delete).toHaveBeenCalledTimes(1);
    expect(repository.delete).toHaveBeenCalledWith('id-inexistente');
  });
});

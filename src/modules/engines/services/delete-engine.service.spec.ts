import { DeleteEngineService } from '@modules/engines/services/delete-engine.service';
import { NotFoundError } from '@shared/errors/AppError';

describe('DeleteEngineService', () => {
  const makeRepositoryMock = () => ({
    delete: jest.fn(),
  });

  it('deve remover o motor quando o id existir', async () => {
    const respository = makeRepositoryMock();
    const service = new DeleteEngineService(respository as never);

    respository.delete.mockResolvedValue(true);

    await expect(service.execute('eng-1')).resolves.toBeUndefined();
    expect(respository.delete).toHaveBeenCalledTimes(1);
    expect(respository.delete).toHaveBeenCalledWith('eng-1');
  });

  it('deve lançar NotFoundError quando o motor não for encontrado para exclusão', async () => {
    const respository = makeRepositoryMock();
    const service = new DeleteEngineService(respository as never);

    respository.delete.mockResolvedValue(false);

    await expect(service.execute('id-inexistente')).rejects.toBeInstanceOf(NotFoundError);
    expect(respository.delete).toHaveBeenCalledTimes(1);
    expect(respository.delete).toHaveBeenCalledWith('id-inexistente');
  });
});

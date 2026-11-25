import { CreateManufacturerService } from '@modules/manufacturers/services/create-manufacturer.service';
import { ConflictError } from '@shared/errors/AppError';

describe('CreateManufacturerService', () => {
  const makeRepositoryMock = () => ({
    findByName: jest.fn(),
    create: jest.fn(),
  });

  it('deve criar um fabricante quando o nome ainda não existir', async () => {
    const repository = makeRepositoryMock();
    const service = new CreateManufacturerService(repository as never);

    const input = {
      name: 'Honda',
    };

    const createdManufacturer = {
      id: 'mfr-1',
      ...input,
    };

    repository.findByName.mockResolvedValue(null);
    repository.create.mockResolvedValue(createdManufacturer);

    const result = await service.execute(input);

    expect(repository.findByName).toHaveBeenCalledTimes(1);
    expect(repository.findByName).toHaveBeenCalledWith('Honda');
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(createdManufacturer);
  });

  it('deve lançar ConflictError e não criar quando já existir fabricante com o mesmo nome', async () => {
    const repository = makeRepositoryMock();
    const service = new CreateManufacturerService(repository as never);

    const input = {
      name: 'Honda',
    };

    repository.findByName.mockResolvedValue({
      id: 'mfr-existing',
      name: 'Honda',
    });

    await expect(service.execute(input)).rejects.toBeInstanceOf(ConflictError);
    expect(repository.findByName).toHaveBeenCalledTimes(1);
    expect(repository.findByName).toHaveBeenCalledWith('Honda');
    expect(repository.create).not.toHaveBeenCalled();
  });
});

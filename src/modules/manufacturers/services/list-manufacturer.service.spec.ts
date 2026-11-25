import { ListManufacturerService } from '@modules/manufacturers/services/list-manufacturer.service';

describe('ListManufacturerService', () => {
  const makeRepositoryMock = () => ({
    findAll: jest.fn(),
  });

  it('deve retornar a lista de fabricantes cadastrados', async () => {
    const repository = makeRepositoryMock();
    const service = new ListManufacturerService(repository as never);

    const mockManufacturers = [
      { id: 'mfr-1', name: 'Gurgel', country: 'Brasil' },
      { id: 'mfr-2', name: 'Troller', country: 'Brasil' },
    ];

    repository.findAll.mockResolvedValue(mockManufacturers);

    const result = await service.execute();

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockManufacturers);
  });

  it('deve retornar um array vazio quando não houver fabricantes cadastrados', async () => {
    const repository = makeRepositoryMock();
    const service = new ListManufacturerService(repository as never);

    repository.findAll.mockResolvedValue([]);

    const result = await service.execute();

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });
});

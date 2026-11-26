import { ManufacturersController } from '@modules/manufacturers/manufacturers.controller';
import type { Request, Response } from 'express';

describe('ManufacturersController', () => {
  const makeServicesMock = () => ({
    createManufacturerService: { execute: jest.fn() },
    listManufacturerService: { execute: jest.fn() },
    getManufacturerByIdService: { execute: jest.fn() },
    getManufacturerByNameService: { execute: jest.fn() },
    updateManufacturerService: { execute: jest.fn() },
    deleteManufacturerService: { execute: jest.fn() },
  });

  const makeController = () => {
    const services = makeServicesMock();
    const controller = new ManufacturersController(
      services.createManufacturerService as never,
      services.listManufacturerService as never,
      services.getManufacturerByIdService as never,
      services.getManufacturerByNameService as never,
      services.updateManufacturerService as never,
      services.deleteManufacturerService as never,
    );
    return { controller, services };
  };

  const makeResponseMock = () => {
    const res = {
      status: jest.fn(),
      json: jest.fn(),
      send: jest.fn(),
    };
    res.status.mockReturnValue(res);
    res.json.mockReturnValue(res);
    res.send.mockReturnValue(res);
    return res as unknown as Response;
  };

  it('deve criar um fabricante e retornar status 201', async () => {
    const { controller, services } = makeController();
    const req = {
      body: { name: 'Gurgel' },
    } as Request;
    const res = makeResponseMock();

    const createdManufacturer = { id: 'mfr-1', name: 'Gurgel' };
    services.createManufacturerService.execute.mockResolvedValue(createdManufacturer);

    await controller.create(req, res);

    expect(services.createManufacturerService.execute).toHaveBeenCalledTimes(1);
    expect(services.createManufacturerService.execute).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: createdManufacturer,
    });
  });

  it('deve listar fabricantes e retornar status 200', async () => {
    const { controller, services } = makeController();
    const req = {} as Request;
    const res = makeResponseMock();

    const manufacturers = [
      { id: 'mfr-1', name: 'Gurgel' },
      { id: 'mfr-2', name: 'Troller' },
    ];
    services.listManufacturerService.execute.mockResolvedValue(manufacturers);

    await controller.list(req, res);

    expect(services.listManufacturerService.execute).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: manufacturers,
    });
  });

  it('deve buscar fabricante por id e retornar status 200', async () => {
    const { controller, services } = makeController();
    const req = {
      params: { id: '00000000-0000-0000-0000-000000000000' },
    } as unknown as Request;
    const res = makeResponseMock();

    const manufacturer = { id: '00000000-0000-0000-0000-000000000000', name: 'Gurgel' };
    services.getManufacturerByIdService.execute.mockResolvedValue(manufacturer);

    await controller.getById(req, res);

    expect(services.getManufacturerByIdService.execute).toHaveBeenCalledTimes(1);
    expect(services.getManufacturerByIdService.execute).toHaveBeenCalledWith(
      '00000000-0000-0000-0000-000000000000',
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: manufacturer,
    });
  });

  it('deve buscar fabricante por nome e retornar status 200', async () => {
    const { controller, services } = makeController();
    const req = {
      params: { name: 'Gurgel' },
    } as unknown as Request;
    const res = makeResponseMock();

    const manufacturer = { id: '00000000-0000-0000-0000-000000000000', name: 'Gurgel' };
    services.getManufacturerByNameService.execute.mockResolvedValue(manufacturer);

    await controller.getByName(req, res);

    expect(services.getManufacturerByNameService.execute).toHaveBeenCalledTimes(1);
    expect(services.getManufacturerByNameService.execute).toHaveBeenCalledWith('Gurgel');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: manufacturer,
    });
  });

  it('deve atualizar fabricante e retornar status 200', async () => {
    const { controller, services } = makeController();
    const req = {
      params: { id: '00000000-0000-0000-0000-000000000000' },
      body: { name: 'Gurgel Motores' },
    } as unknown as Request;
    const res = makeResponseMock();

    const updatedManufacturer = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Gurgel Motores',
    };
    services.updateManufacturerService.execute.mockResolvedValue(updatedManufacturer);

    await controller.update(req, res);

    expect(services.updateManufacturerService.execute).toHaveBeenCalledTimes(1);
    expect(services.updateManufacturerService.execute).toHaveBeenCalledWith(
      '00000000-0000-0000-0000-000000000000',
      req.body,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: updatedManufacturer,
    });
  });

  it('deve remover fabricante e retornar status 204 sem corpo', async () => {
    const { controller, services } = makeController();
    const req = {
      params: { id: '00000000-0000-0000-0000-000000000000' },
    } as unknown as Request;
    const res = makeResponseMock();

    services.deleteManufacturerService.execute.mockResolvedValue(undefined);

    await controller.delete(req, res);

    expect(services.deleteManufacturerService.execute).toHaveBeenCalledTimes(1);
    expect(services.deleteManufacturerService.execute).toHaveBeenCalledWith(
      '00000000-0000-0000-0000-000000000000',
    );
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.json).not.toHaveBeenCalled();
  });
});

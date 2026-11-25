import { EnginesController } from '@modules/engines/engines.controller';
import type { Request, Response } from 'express';

describe('EnginesController', () => {
  const makeServicesMock = () => ({
    createEngineService: { execute: jest.fn() },
    listEngineService: { execute: jest.fn() },
    getEngineByIdService: { execute: jest.fn() },
    getEngineByCodeService: { execute: jest.fn() },
    getEngineByManufacturerIdService: { execute: jest.fn() },
    getEngineByManufacturerNameService: { execute: jest.fn() },
    updateEngineService: { execute: jest.fn() },
    deleteEngineService: { execute: jest.fn() },
  });

  const makeController = () => {
    const services = makeServicesMock();
    const controller = new EnginesController(
      services.createEngineService as never,
      services.listEngineService as never,
      services.getEngineByIdService as never,
      services.getEngineByCodeService as never,
      services.getEngineByManufacturerIdService as never,
      services.getEngineByManufacturerNameService as never,
      services.updateEngineService as never,
      services.deleteEngineService as never,
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

  it('deve criar um motor e retornar status 201', async () => {
    const { controller, services } = makeController();
    const req = {
      body: { code: 'ENG-001', name: 'Motor 1' },
    } as Request;
    const res = makeResponseMock();

    const createdEngine = { id: 'eng-1', code: 'ENG-001', name: 'Motor 1' };
    services.createEngineService.execute.mockResolvedValue(createdEngine);

    await controller.create(req, res);

    expect(services.createEngineService.execute).toHaveBeenCalledTimes(1);
    expect(services.createEngineService.execute).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: createdEngine,
    });
  });

  it('deve listar motores e retornar status 200', async () => {
    const { controller, services } = makeController();
    const req = {} as Request;
    const res = makeResponseMock();

    const enginesList = [
      { id: 'eng-1', code: 'ENG-001', name: 'Motor 1' },
      { id: 'eng-2', code: 'ENG-002', name: 'Motor 2' },
    ];
    services.listEngineService.execute.mockResolvedValue(enginesList);

    await controller.list(req, res);

    expect(services.listEngineService.execute).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: enginesList,
    });
  });

  it('deve obter um motor por ID e retornar status 200', async () => {
    const { controller, services } = makeController();
    const req = {
      params: { id: '00000000-0000-0000-0000-000000000000' },
    } as unknown as Request;
    const res = makeResponseMock();

    const engine = { id: '00000000-0000-0000-0000-000000000000', code: 'ENG-001', name: 'Motor 1' };
    services.getEngineByIdService.execute.mockResolvedValue(engine);

    await controller.getById(req, res);

    expect(services.getEngineByIdService.execute).toHaveBeenCalledTimes(1);
    expect(services.getEngineByIdService.execute).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: engine,
    });
  });

  it('deve obter um motor por código e retornar status 200', async () => {
    const { controller, services } = makeController();
    const req = {
      params: { code: 'ENG-001' },
    } as unknown as Request;
    const res = makeResponseMock();

    const engine = { id: '00000000-0000-0000-0000-000000000000', code: 'ENG-001', name: 'Motor 1' };
    services.getEngineByCodeService.execute.mockResolvedValue(engine);

    await controller.getByCode(req, res);

    expect(services.getEngineByCodeService.execute).toHaveBeenCalledTimes(1);
    expect(services.getEngineByCodeService.execute).toHaveBeenCalledWith(req.params.code);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: engine,
    });
  });

  it('deve obter motores por ID do fabricante e retornar status 200', async () => {
    const { controller, services } = makeController();
    const req = {
      params: { manufacturerId: '00000000-0000-0000-0000-000000000000' },
    } as unknown as Request;
    const res = makeResponseMock();

    const enginesList = [
      { id: '00000000-0000-0000-0000-000000000001', code: 'ENG-001', name: 'Motor 1' },
      { id: '00000000-0000-0000-0000-000000000002', code: 'ENG-002', name: 'Motor 2' },
    ];
    services.getEngineByManufacturerIdService.execute.mockResolvedValue(enginesList);

    await controller.getByManufacturerId(req, res);

    expect(services.getEngineByManufacturerIdService.execute).toHaveBeenCalledTimes(1);
    expect(services.getEngineByManufacturerIdService.execute).toHaveBeenCalledWith(
      req.params.manufacturerId,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: enginesList,
    });
  });

  it('deve obter motores por nome do fabricante e retornar status 200', async () => {
    const { controller, services } = makeController();
    const req = {
      params: { manufacturerName: 'Fabricante 1' },
    } as unknown as Request;
    const res = makeResponseMock();

    const enginesList = [
      { id: '00000000-0000-0000-0000-000000000001', code: 'ENG-001', name: 'Motor 1' },
      { id: '00000000-0000-0000-0000-000000000002', code: 'ENG-002', name: 'Motor 2' },
    ];
    services.getEngineByManufacturerNameService.execute.mockResolvedValue(enginesList);

    await controller.getByManufacturerName(req, res);

    expect(services.getEngineByManufacturerNameService.execute).toHaveBeenCalledTimes(1);
    expect(services.getEngineByManufacturerNameService.execute).toHaveBeenCalledWith(
      req.params.manufacturerName,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: enginesList,
    });
  });

  it('deve atualizar um motor e retornar status 200', async () => {
    const { controller, services } = makeController();
    const req = {
      params: { id: '00000000-0000-0000-0000-000000000000' },
      body: { name: 'Motor Atualizado' },
    } as unknown as Request;
    const res = makeResponseMock();

    const updatedEngine = {
      id: '00000000-0000-0000-0000-000000000000',
      code: 'ENG-001',
      name: 'Motor Atualizado',
    };
    services.updateEngineService.execute.mockResolvedValue(updatedEngine);

    await controller.update(req, res);

    expect(services.updateEngineService.execute).toHaveBeenCalledTimes(1);
    expect(services.updateEngineService.execute).toHaveBeenCalledWith(req.params.id, req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: updatedEngine,
    });
  });

  it('deve deletar um motor e retornar status 204', async () => {
    const { controller, services } = makeController();
    const req = {
      params: { id: '00000000-0000-0000-0000-000000000000' },
    } as unknown as Request;
    const res = makeResponseMock();

    services.deleteEngineService.execute.mockResolvedValue(undefined);

    await controller.delete(req, res);

    expect(services.deleteEngineService.execute).toHaveBeenCalledTimes(1);
    expect(services.deleteEngineService.execute).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});

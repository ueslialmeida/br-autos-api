import {
  CreateVehicleService,
  DeleteVehicleService,
  GetVehicleByEngineIdService,
  GetVehicleByIdService,
  GetVehicleByManufacturerIdService,
  ListVehicleService,
  UpdateVehicleService,
} from '@modules/vehicles/services/index';
import { VehiclesController } from '@modules/vehicles/vehicles.controller';
import { Request, Response } from 'express';
import { ZodError } from 'zod';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const SECOND_UUID = '660e8400-e29b-41d4-a716-446655440001';

describe('VehiclesController', () => {
  let controller: VehiclesController;

  let createVehicleService: jest.Mocked<Pick<CreateVehicleService, 'execute'>>;
  let listVehicleService: jest.Mocked<Pick<ListVehicleService, 'execute'>>;
  let getVehicleByIdService: jest.Mocked<Pick<GetVehicleByIdService, 'execute'>>;
  let getVehicleByManufacturerIdService: jest.Mocked<
    Pick<GetVehicleByManufacturerIdService, 'execute'>
  >;
  let getVehicleByEngineIdService: jest.Mocked<Pick<GetVehicleByEngineIdService, 'execute'>>;
  let updateVehicleService: jest.Mocked<Pick<UpdateVehicleService, 'execute'>>;
  let deleteVehicleService: jest.Mocked<Pick<DeleteVehicleService, 'execute'>>;

  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    createVehicleService = { execute: jest.fn() };
    listVehicleService = { execute: jest.fn() };
    getVehicleByIdService = { execute: jest.fn() };
    getVehicleByManufacturerIdService = { execute: jest.fn() };
    getVehicleByEngineIdService = { execute: jest.fn() };
    updateVehicleService = { execute: jest.fn() };
    deleteVehicleService = { execute: jest.fn() };

    controller = new VehiclesController(
      createVehicleService as unknown as CreateVehicleService,
      listVehicleService as unknown as ListVehicleService,
      getVehicleByIdService as unknown as GetVehicleByIdService,
      getVehicleByManufacturerIdService as unknown as GetVehicleByManufacturerIdService,
      getVehicleByEngineIdService as unknown as GetVehicleByEngineIdService,
      updateVehicleService as unknown as UpdateVehicleService,
      deleteVehicleService as unknown as DeleteVehicleService,
    );

    jsonMock = jest.fn();
    sendMock = jest.fn();
    statusMock = jest.fn(() => ({
      json: jsonMock,
      send: sendMock,
    }));

    mockRes = {
      status: statusMock as unknown as Response['status'],
    };

    mockReq = {
      body: {},
      params: {},
      query: {},
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um veículo e retornar status 201 com os dados', async () => {
      const payload = {
        model: 'Onix Plus',
        manufacturerId: VALID_UUID,
        engineId: SECOND_UUID,
        year: 2024,
      };
      const createdVehicle = { id: VALID_UUID, ...payload };

      mockReq.body = payload;
      createVehicleService.execute.mockResolvedValue(createdVehicle as never);

      await controller.create(mockReq as Request, mockRes as Response);

      expect(createVehicleService.execute).toHaveBeenCalledTimes(1);
      expect(createVehicleService.execute).toHaveBeenCalledWith(payload);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        data: createdVehicle,
      });
    });

    it('deve propagar erro se CreateVehicleService falhar', async () => {
      const error = new Error('Erro ao criar veículo');
      mockReq.body = { model: 'HB20' };
      createVehicleService.execute.mockRejectedValue(error);

      await expect(controller.create(mockReq as Request, mockRes as Response)).rejects.toThrow(
        'Erro ao criar veículo',
      );
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  describe('list', () => {
    it('deve listar veículos sem filtros e retornar status 200', async () => {
      const vehicles = [{ id: VALID_UUID, model: 'Gol' }];
      mockReq.query = {};
      listVehicleService.execute.mockResolvedValue(vehicles as never);

      await controller.list(mockReq as Request, mockRes as Response);

      expect(listVehicleService.execute).toHaveBeenCalledWith({
        startYear: undefined,
        endYear: undefined,
        model: undefined,
        manufacturerId: undefined,
        manufacturerName: undefined,
        engineId: undefined,
        engineCode: undefined,
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        data: vehicles,
      });
    });

    it('deve transformar manufacturingPeriod no formato AAAA-AAAA em startYear e endYear', async () => {
      mockReq.query = {
        manufacturingPeriod: '2018-2023',
        model: 'Corolla',
        manufacturerId: VALID_UUID,
        manufacturerName: 'Toyota',
        engineId: SECOND_UUID,
        engineCode: '2ZR-FBE',
      };
      listVehicleService.execute.mockResolvedValue([] as never);

      await controller.list(mockReq as Request, mockRes as Response);

      expect(listVehicleService.execute).toHaveBeenCalledWith({
        startYear: 2018,
        endYear: 2023,
        model: 'Corolla',
        manufacturerId: VALID_UUID,
        manufacturerName: 'Toyota',
        engineId: SECOND_UUID,
        engineCode: '2ZR-FBE',
      });
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('deve usar o mesmo ano para startYear e endYear quando manufacturingPeriod tiver apenas AAAA', async () => {
      mockReq.query = { manufacturingPeriod: '2025' };
      listVehicleService.execute.mockResolvedValue([] as never);

      await controller.list(mockReq as Request, mockRes as Response);

      expect(listVehicleService.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          startYear: 2025,
          endYear: 2025,
        }),
      );
    });

    it('deve lançar ZodError quando manufacturingPeriod tiver formato inválido', async () => {
      mockReq.query = { manufacturingPeriod: '2025-25' };

      await expect(controller.list(mockReq as Request, mockRes as Response)).rejects.toThrow(
        ZodError,
      );
      expect(listVehicleService.execute).not.toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('deve lançar ZodError quando manufacturerId ou engineId não forem UUIDs válidos', async () => {
      mockReq.query = { manufacturerId: 'id-invalido' };

      await expect(controller.list(mockReq as Request, mockRes as Response)).rejects.toThrow(
        ZodError,
      );
      expect(listVehicleService.execute).not.toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('deve retornar um veículo pelo id com status 200', async () => {
      const vehicle = { id: VALID_UUID, model: 'Civic' };
      mockReq.params = { id: VALID_UUID };
      getVehicleByIdService.execute.mockResolvedValue(vehicle as never);

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(getVehicleByIdService.execute).toHaveBeenCalledWith(VALID_UUID);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        data: vehicle,
      });
    });

    it('deve lançar ZodError se id não for um UUID válido', async () => {
      mockReq.params = { id: '123' };

      await expect(controller.getById(mockReq as Request, mockRes as Response)).rejects.toThrow(
        ZodError,
      );
      expect(getVehicleByIdService.execute).not.toHaveBeenCalled();
    });
  });

  describe('getByManufacturerId', () => {
    it('deve retornar veículos por manufacturerId com status 200', async () => {
      const vehicles = [{ id: VALID_UUID, manufacturerId: SECOND_UUID }];
      mockReq.params = { id: SECOND_UUID };
      getVehicleByManufacturerIdService.execute.mockResolvedValue(vehicles as never);

      await controller.getByManufacturerId(mockReq as Request, mockRes as Response);

      expect(getVehicleByManufacturerIdService.execute).toHaveBeenCalledWith(SECOND_UUID);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        data: vehicles,
      });
    });

    it('deve lançar ZodError se id do fabricante for inválido', async () => {
      mockReq.params = { id: 'abc' };

      await expect(
        controller.getByManufacturerId(mockReq as Request, mockRes as Response),
      ).rejects.toThrow(ZodError);
      expect(getVehicleByManufacturerIdService.execute).not.toHaveBeenCalled();
    });
  });

  describe('getByEngineId', () => {
    it('deve retornar veículos por engineId com status 200', async () => {
      const vehicles = [{ id: VALID_UUID, engineId: SECOND_UUID }];
      mockReq.params = { id: SECOND_UUID };
      getVehicleByEngineIdService.execute.mockResolvedValue(vehicles as never);

      await controller.getByEngineId(mockReq as Request, mockRes as Response);

      expect(getVehicleByEngineIdService.execute).toHaveBeenCalledWith(SECOND_UUID);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        data: vehicles,
      });
    });

    it('deve lançar ZodError se id do motor for inválido', async () => {
      mockReq.params = { id: 'not-a-uuid' };

      await expect(
        controller.getByEngineId(mockReq as Request, mockRes as Response),
      ).rejects.toThrow(ZodError);
      expect(getVehicleByEngineIdService.execute).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('deve atualizar um veículo e retornar status 200', async () => {
      const updateData = { model: 'Onix RS' };
      const updatedVehicle = { id: VALID_UUID, ...updateData };

      mockReq.params = { id: VALID_UUID };
      mockReq.body = updateData;
      updateVehicleService.execute.mockResolvedValue(updatedVehicle as never);

      await controller.update(mockReq as Request, mockRes as Response);

      expect(updateVehicleService.execute).toHaveBeenCalledWith(VALID_UUID, updateData);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        data: updatedVehicle,
      });
    });

    it('deve lançar ZodError se id for inválido no update', async () => {
      mockReq.params = { id: 'invalid-id' };
      mockReq.body = { model: 'Onix RS' };

      await expect(controller.update(mockReq as Request, mockRes as Response)).rejects.toThrow(
        ZodError,
      );
      expect(updateVehicleService.execute).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deve remover um veículo e retornar status 204 sem corpo', async () => {
      mockReq.params = { id: VALID_UUID };
      deleteVehicleService.execute.mockResolvedValue(undefined as never);

      await controller.delete(mockReq as Request, mockRes as Response);

      expect(deleteVehicleService.execute).toHaveBeenCalledWith(VALID_UUID);
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalledTimes(1);
    });

    it('deve lançar ZodError se id for inválido no delete', async () => {
      mockReq.params = { id: '12345' };

      await expect(controller.delete(mockReq as Request, mockRes as Response)).rejects.toThrow(
        ZodError,
      );
      expect(deleteVehicleService.execute).not.toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });
  });
});

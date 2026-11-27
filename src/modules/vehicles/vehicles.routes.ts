import { Router } from 'express';

import { VehiclesRepository } from './repositories/vehicles.repository';
import {
  CreateVehicleService,
  DeleteVehicleService,
  GetVehicleByEngineIdService,
  GetVehicleByIdService,
  GetVehicleByManufacturerIdService,
  ListVehicleService,
  UpdateVehicleService,
} from './services/index';
import { VehiclesController } from './vehicles.controller';

const repository = new VehiclesRepository();

const createVehicleService = new CreateVehicleService(repository);
const listVehicleService = new ListVehicleService(repository);
const getVehicleByIdService = new GetVehicleByIdService(repository);
const getVehicleByManufacturerIdService = new GetVehicleByManufacturerIdService(repository);
const getVehicleByEngineIdService = new GetVehicleByEngineIdService(repository);
const updateVehicleService = new UpdateVehicleService(repository);
const deleteVehicleService = new DeleteVehicleService(repository);

const controller = new VehiclesController(
  createVehicleService,
  listVehicleService,
  getVehicleByIdService,
  getVehicleByManufacturerIdService,
  getVehicleByEngineIdService,
  updateVehicleService,
  deleteVehicleService,
);

const vehiclesRoutes = Router();

vehiclesRoutes.post('/', (req, res) => controller.create(req, res));
vehiclesRoutes.get('/', (req, res) => controller.list(req, res)); // Atende /vehicles e /vehicles?filtros...
vehiclesRoutes.get('/:id', (req, res) => controller.getById(req, res));
vehiclesRoutes.get('/manufacturer/id/:id', (req, res) => controller.getByManufacturerId(req, res));
vehiclesRoutes.get('/engine/id/:id', (req, res) => controller.getByEngineId(req, res));
vehiclesRoutes.patch('/:id', (req, res) => controller.update(req, res));
vehiclesRoutes.delete('/:id', (req, res) => controller.delete(req, res));

export { vehiclesRoutes };

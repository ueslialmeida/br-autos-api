import { Router } from 'express';

import { EnginesController } from './engines.controller';
import { EnginesRepository } from './repositories/engines.repository';
import {
  CreateEngineService,
  DeleteEngineService,
  GetEngineByCodeService,
  GetEngineByIdService,
  GetEngineByManufacturerIdService,
  GetEngineByManufacturerNameService,
  ListEngineService,
  UpdateEngineService,
} from './services/index';

const repository = new EnginesRepository();

const createEngineService = new CreateEngineService(repository);
const listEngineService = new ListEngineService(repository);
const getEngineByIdService = new GetEngineByIdService(repository);
const getEngineByCodeService = new GetEngineByCodeService(repository);
const getEngineByManufacturerIdService = new GetEngineByManufacturerIdService(repository);
const getEngineByManufacturerNameService = new GetEngineByManufacturerNameService(repository);
const updateEngineService = new UpdateEngineService(repository);
const deleteEngineService = new DeleteEngineService(repository);

const controller = new EnginesController(
  createEngineService,
  listEngineService,
  getEngineByIdService,
  getEngineByCodeService,
  getEngineByManufacturerIdService,
  getEngineByManufacturerNameService,
  updateEngineService,
  deleteEngineService,
);

const enginesRoutes = Router();

enginesRoutes.post('/', (req, res) => controller.create(req, res));
enginesRoutes.get('/', (req, res) => controller.list(req, res));
enginesRoutes.get('/:id', (req, res) => controller.getById(req, res));
enginesRoutes.get('/:code', (req, res) => controller.getByCode(req, res));
enginesRoutes.get('/manufacturer/id/:manufacturerId', (req, res) =>
  controller.getByManufacturerId(req, res),
);
enginesRoutes.get('/manufacturer/name/:manufacturerName', (req, res) =>
  controller.getByManufacturerName(req, res),
);
enginesRoutes.patch('/:id', (req, res) => controller.update(req, res));
enginesRoutes.delete('/:id', (req, res) => controller.delete(req, res));

export { enginesRoutes };

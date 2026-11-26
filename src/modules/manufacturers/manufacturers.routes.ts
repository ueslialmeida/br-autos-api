import {
  CreateManufacturerService,
  DeleteManufacturerService,
  GetManufacturerByIdService,
  GetManufacturerByNameService,
  ListManufacturerService,
  UpdateManufacturerService,
} from '@modules/manufacturers/services/index';
import { Router } from 'express';

import { ManufacturersController } from './manufacturers.controller';
import { ManufacturersRepository } from './repositories/manufacturers.repository';

const repository = new ManufacturersRepository();

const createManufacturerService = new CreateManufacturerService(repository);
const listManufacturerService = new ListManufacturerService(repository);
const getManufacturerByIdService = new GetManufacturerByIdService(repository);
const getManufacturerByNameService = new GetManufacturerByNameService(repository);
const updateManufacturerService = new UpdateManufacturerService(repository);
const deleteManufacturerService = new DeleteManufacturerService(repository);

const controller = new ManufacturersController(
  createManufacturerService,
  listManufacturerService,
  getManufacturerByIdService,
  getManufacturerByNameService,
  updateManufacturerService,
  deleteManufacturerService,
);

const manufacturersRoutes = Router();

manufacturersRoutes.post('/', (req, res) => controller.create(req, res));
manufacturersRoutes.get('/', (req, res) => controller.list(req, res));
manufacturersRoutes.get('/:id', (req, res) => controller.getById(req, res));
manufacturersRoutes.get('/name/:name', (req, res) => controller.getByName(req, res));
manufacturersRoutes.patch('/:id', (req, res) => controller.update(req, res));
manufacturersRoutes.delete('/:id', (req, res) => controller.delete(req, res));

export { manufacturersRoutes };

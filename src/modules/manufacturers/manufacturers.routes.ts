import { Router } from 'express';

import { ManufacturersController } from './manufacturers.controller';
import { ManufacturersRepository } from './repositories/manufacturers.repository';
import { CreateManufacturerService } from './services/create-manufacturer.service';
import { DeleteManufacturerService } from './services/delete-manufacturer.service';
import { GetManufacturerByIdService } from './services/get-manufacturer-by-id.service';
import { ListManufacturerService } from './services/list-manufacturer.service';
import { UpdateManufacturerService } from './services/update-manufacturer.service';

const repository = new ManufacturersRepository();

const createManufacturerService = new CreateManufacturerService(repository);
const listManufacturerService = new ListManufacturerService(repository);
const getManufacturerByIdService = new GetManufacturerByIdService(repository);
const updateManufacturerService = new UpdateManufacturerService(repository);
const deleteManufacturerService = new DeleteManufacturerService(repository);

const controller = new ManufacturersController(
  createManufacturerService,
  listManufacturerService,
  getManufacturerByIdService,
  updateManufacturerService,
  deleteManufacturerService,
);

const manufacturersRoutes = Router();

manufacturersRoutes.post('/', (req, res) => controller.create(req, res));
manufacturersRoutes.get('/', (req, res) => controller.list(req, res));
manufacturersRoutes.get('/:id', (req, res) => controller.getById(req, res));
manufacturersRoutes.patch('/:id', (req, res) => controller.update(req, res));
manufacturersRoutes.delete('/:id', (req, res) => controller.delete(req, res));

export { manufacturersRoutes };

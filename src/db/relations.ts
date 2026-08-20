import { defineRelations } from 'drizzle-orm';

import { engines } from '../modules/engines/engines.schema';
import { manufacturers } from '../modules/manufacturers/manufacturers.schema';
import { vehicles } from '../modules/vehicles/vehicles.schema';

export const appRelations = defineRelations({ manufacturers, vehicles, engines }, (r) => ({
  manufacturers: {
    vehicles: r.many.vehicles(),
  },
  vehicles: {
    manufacturers: r.one.manufacturers({
      from: r.vehicles.manufacturerId,
      to: r.manufacturers.id,
    }),
    engines: r.one.engines({
      from: r.vehicles.engineId,
      to: r.engines.id,
    }),
  },
  engines: {
    vehicles: r.many.vehicles(),
  },
}));

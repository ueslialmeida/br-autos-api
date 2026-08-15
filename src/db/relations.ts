import { defineRelations } from 'drizzle-orm';

import { engines } from '../modules/engines/engines.schema';
import { manufactures } from '../modules/manufactures/manufactures.schema';
import { vehicles } from '../modules/vehicles/vehicles.schema';

export const appRelations = defineRelations({ manufactures, vehicles, engines }, (r) => ({
  manufactures: {
    vehicles: r.many.vehicles(),
  },
  vehicles: {
    manufactures: r.one.manufactures({
      from: r.vehicles.manufacturerId,
      to: r.manufactures.id,
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

import { defineRelations } from 'drizzle-orm';

import { engines } from '../modules/engines/engines.schema';
import { manufactures } from '../modules/manufactures/manufactures.schema';
import { vehicles } from '../modules/vehicles/vehicles.schema';

export const appRelations = defineRelations({ manufactures, vehicles, engines }, (r) => ({
  manufactures: {
    vehicles: r.many.vehicles(),
  },
  vehicles: {
    manufactures: r.one.manufactures(),
    engines: r.one.engines(),
  },
  engines: {
    vehicles: r.many.vehicles(),
  },
}));

import { PaginationInput } from '../common/types/backend';
import { AuthScope } from '../config';
import { db } from '../models';
import { Mission } from '../models/mission';
import { ShipAttributes } from '../models/ship';

const get = async ({ pagination }: { pagination: PaginationInput }, authScope: AuthScope): Promise<ShipAttributes[]> => {
  const ships = await db.Ship.findAll({
    include: [{ model: Mission, as: 'missions' }],
  });
  return ships;
};

const shipController = {
  get,
};
export { shipController };

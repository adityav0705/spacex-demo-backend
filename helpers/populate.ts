if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
}
import { db } from '../models';
import { cleanDb } from '../helpers/testHelpers';
import fetch from 'node-fetch';
import { Ship, Mission } from '../common/types/ship';

const populate = async () => {
  await cleanDb();
  console.log('Populating database...');

  const ships: Ship[] = await fetch('https://spacex-production.up.railway.app/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '{ ships { id name image class active missions { flight name } } }' }),
  })
    .then(res => res.json())
    .then(data => (data as { data: { ships: Ship[] } }).data.ships);

  const dbData = await Promise.all(
    ships.map(ship => {
      return db.Ship.create({
        active: ship.active,
        name: ship.name,
        class: String(ship.class),
        image: ship.image,
      });
    }),
  );

  const missions: Promise<Mission>[] = ships.reduce((acc: Promise<Mission>[], ship, ind: number) => {
    if (ship.missions) {
      const shipMissions = ship.missions.map(mission => {
        return db.Mission.create({
          flight: mission.flight,
          name: mission.name || 'mission',
          shipId: dbData[ind].id,
        });
      });
      return acc.concat(shipMissions as Promise<Mission>[]);
    }
    return acc;
  }, []);

  await Promise.all(missions);

  await db.sequelize.close();
};

if (require.main === module) {
  populate();
}

export { populate };

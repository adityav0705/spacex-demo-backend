import { Sequelize } from 'sequelize';
import { config } from '../config';
import { DataTypeAbstract, ModelAttributeColumnOptions } from 'sequelize';
import { User } from './User';
import { Address } from './Address';
import { Ship } from './ship';
import { Mission } from './mission';

declare global {
  type SequelizeAttributes<T extends { [key: string]: any }> = {
    [P in keyof T]: string | DataTypeAbstract | ModelAttributeColumnOptions;
  };
}

const sequelize = new Sequelize({
  ...config.mysql,
  dialect: 'mysql',
  define: {
    charset: 'utf8mb4',
  },
  logging: false,
  pool: {
    acquire: 30000,
  },
});

const db = {
  sequelize,
  User: User.initModel(sequelize),
  Address: Address.initModel(sequelize),
  Ship: Ship.initModel(sequelize),
  Mission: Mission.initModel(sequelize),
};

Object.keys(db).map(key => {
  if (db[key].associate) {
    db[key].associate(db);
  }
});

db.Ship.hasMany(db.Mission, { foreignKey: 'shipId', as: 'missions' });

db.Mission.belongsTo(db.Ship, { foreignKey: 'shipId' });

const sync = async () => {
  await sequelize.sync({ force: false });
};

export { sync, db, sequelize };

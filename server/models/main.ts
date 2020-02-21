import { Sequelize } from 'sequelize';
import path from 'path';

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: path.join(__dirname, '..', 'data', 'main.db'),
	//logging: false
});

export default sequelize;

sequelize.validate();
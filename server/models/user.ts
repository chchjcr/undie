import {
	Model,
	DataTypes
} from 'sequelize';

import sequelize from './main';

export default class User extends Model {
	public id!: number; // Note that the `null assertion` `!` is required in strict mode.
	public uniqueID!: string;
	public username!: string;
	public email!: string;
	public password!: string;
	
	// timestamps!
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

}

User.init({
	id: {
	  type: DataTypes.INTEGER, // you can omit the `new` but this is discouraged
	  autoIncrement: true,
	  primaryKey: true,
	},
	uniqueID: {
		type: new DataTypes.STRING(128),
		allowNull: false
	},
	username: {
		type: new DataTypes.STRING(128),
		allowNull: false
	},
	password: {
		type: DataTypes.UUIDV4,
		allowNull: false
	}
}, {
	sequelize,
	modelName: 'user'
});
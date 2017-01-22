/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Drugs', {
		did: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		dname: {
			type: DataTypes.STRING,
			allowNull: false
		},
		generic: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		tableName: 'Drugs',
		timestamps: false
	});
};

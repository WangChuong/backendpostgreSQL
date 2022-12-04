'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Support extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
         static associate(models) {
            // define association here
            Support.belongsTo(models.User, {foreignKey: 'supportId'});
        }
    };
    Support.init({

        supportId: DataTypes.INTEGER,
        count: DataTypes.INTEGER,
        note: DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'Support',
        freezeTableName: true
    });
    return Support;
};
import mysql from 'mysql2/promise'
import { Logger } from 'sass';
import { Sequelize } from 'sequelize';
// create the connection to database
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'testdbNodeJS'
});
const connect_db = new Sequelize('sql12670437', 'sql12670437', 'ce3WgyBkxf', {
    host: 'sql12.freesqldatabase.com',
    dialect: 'mysql',
    logging: false,
});
const check_connect = async (sequelize) => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
export default db
export { connect_db, check_connect }
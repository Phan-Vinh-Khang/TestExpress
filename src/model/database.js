import mysql from 'mysql2/promise'
// create the connection to database
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'testdbNodeJS'
});
export default db
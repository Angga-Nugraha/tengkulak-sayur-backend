import { Sequelize } from "sequelize";


const db = new Sequelize('tengkulak_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});
// process.env.MYSQL_URL, { dialect: 'mysql' }



export default db
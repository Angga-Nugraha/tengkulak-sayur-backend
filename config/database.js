import { Sequelize } from "sequelize";


const db = new Sequelize('tengkulak_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});


export default db
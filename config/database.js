import { Sequelize } from "sequelize";


const db = new Sequelize('tengkulak_db', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
    dialectOptions: {
        socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
    }
});


export default db
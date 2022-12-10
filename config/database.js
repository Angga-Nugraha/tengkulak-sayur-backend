import { Sequelize } from "sequelize";


const db = new Sequelize(process.env.MYSQL_URL, { dialect: 'mysql' });


export default db
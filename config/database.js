import { Sequelize } from "sequelize";


const db = new Sequelize(process.env.MYSQL_URL, { dialect: 'mysql' });

// 'tengkulak_db', 'root', '', {
//     host: '127.0.0.1',
//     dialect: 'mysql',
// }

export default db
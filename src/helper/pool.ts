import mysql from 'mysql2/promise'
import { envs } from './envs';


export const myDb = mysql.createPool({
  host: envs.db_host || "localhost"  ,       // o la IP de tu servidor
  user: envs.db_user || "root",
  password: envs.db_password || "123456789",
  database: envs.db_name || "pos",
  port: envs.db_port || 3306,              // puerto por defecto de MySQL
  waitForConnections: true,
  connectionLimit: 10,     // conexiones simultáneas
  queueLimit: 0
});
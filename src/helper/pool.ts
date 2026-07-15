import mysql from 'mysql2/promise'
import { envs } from './envs';


export const pool = mysql.createPool({
  host: envs.db_host,       // o la IP de tu servidor
  user: envs.db_user,
  password: envs.db_password,
  database: envs.db_name,
  port: 3306,              // puerto por defecto de MySQL
  waitForConnections: true,
  connectionLimit: 10,     // conexiones simultáneas
  queueLimit: 0
});
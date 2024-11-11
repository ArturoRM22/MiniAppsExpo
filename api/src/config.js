import dotenv from 'dotenv'; // Changed from require to import

dotenv.config(); 

/* console.log({
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    HOST: process.env.HOST,
    DATABASE: process.env.DATABASE,
    DB_PORT: process.env.DB_PORT,
}); */

const USER = process.env.USER || 'root';
const PASSWORD = process.env.PASSWORD || '';
const HOST = process.env.HOST || 'localhost';
const DATABASE = process.env.DATABASE || 'todolist';
const DB_PORT = process.env.DB_PORT || '3306';

export default {
    USER,
    PASSWORD,
    HOST,
    DATABASE,
    DB_PORT
}; // Changed from module.exports to export default
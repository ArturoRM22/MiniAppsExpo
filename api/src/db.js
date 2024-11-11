import mysql from 'mysql2/promise'; // Changed from require to import
import config from './config.js'; // Changed from require to import

const pool = mysql.createPool({
    host: config.DB_DOCKER_HOST, // Make sure you put localhost instead of DB_DOCKER_HOST if you are running locally
    user: config.USER,
    password: config.PASSWORD,
    database: config.DATABASE,
    port: config.DB_PORT
});


console.log("kjasldfasd")
/* aslkjdflkasdjf */

export {
    pool
}; // Changed from module.exports to export
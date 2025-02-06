const {Pool} = require('pg')
require("dotenv").config()

const pool = new Pool({
    user: process.env.user,
    host: process.env.DB_HOST,
    database: process.env.database,
    password: process.env.password,
    port: process.env.PORT
});

module.exports = pool
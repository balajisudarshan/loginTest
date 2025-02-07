const express = require('express')

require('dotenv').config()
const client = require('pg')
const app = express()
app.use(express.json())
const authroutes = require('./routes/authroutes')
const cors = require('cors')


app.use(cors())

app.use("/api/auth",authroutes)

const PORT = 5000
app.listen(PORT,()=>console.log("connected"))
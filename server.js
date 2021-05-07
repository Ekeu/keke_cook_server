const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')

const connectDB =  require('./config/db')

dotenv.config();

connectDB()

const app = express()

app.use(express.json())


const PORT = process.env.PORT || 5000;

app.get('/api/v1', (req, res) => {
    res.json({
        data: 'API Setup'
    })
})

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))
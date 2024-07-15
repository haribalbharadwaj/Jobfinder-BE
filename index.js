const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const userRoutes = require('./src/routes/user')
const jobRoutes = require('./src/routes/job')
const errorHandler = require('./src/middleware/errorHandler')

dotenv.config()

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(userRoutes)
app.use(jobRoutes)
app.use(errorHandler);

app.get('/',(req,res)=>{
    res.send({
        status:"Server is up",
        now:new Date().toLocaleDateString()
    })
})

app.listen(PORT,()=>{
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(()=> console.log('Server is running'))
        .catch((error)=> console.log(error))
})
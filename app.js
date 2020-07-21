const express = require('express');
const app = express();


require('dotenv').config()

//import routes
const userRoutes = require('./routes/user')

app.use('/api',userRoutes);

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true})
    .then(() => console.log('DB Connected'))

mongoose.connection.on('error', err => {
    console.log(`DB connection error ${err.message}`)
})

const port = process.env.PORT || 8000;


app.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})



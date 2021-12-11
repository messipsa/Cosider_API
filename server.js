const mongoose = require('mongoose');
const express = require('express');
const projetRoute = require('./routes/projet.routes');
const employeRoute = require('./routes/employe.routes');

require('dotenv').config();

const app = express();

app.use(express.json());

const url = process.env.URI;
const port = process.env.PORT;



app.use('/api/projets' , projetRoute );

app.use('/api/employes' , employeRoute);

app.all('*', function(req, res) {
    throw new Error("Bad request");
  });
  
  app.use(function(e, req, res, next) {
    if (e.message === "Bad request") {
        res.status(400).json({error: {msg: e.message, stack: e.stack}});
    }
  });

  

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
    mongoose.connect(url,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>
    {
        console.log('Connected to the database')
    })
    .catch((err)=>{
        console.log(err);
    })
})
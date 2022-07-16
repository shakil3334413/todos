
const express = require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const todoHandler=require('./routeHandler/todoHandler');
const UserHandler=require('./routeHandler/userHandler');
const port = 3000;
const app = express();
app.use(express.json());
dotenv.config();


//connect with mongoose database
mongoose
    .connect('mongodb+srv://shakil:shakil3334426@cluster0.geb1r6s.mongodb.net/todos')
    .then(()=>console.log("Successfully Connected"))
    .catch((err)=>console.log(err));

//application routes
app.use('/todos',todoHandler);
app.use('/',UserHandler);



//defualt err handling
const errorHandling=(err,req,res,next)=>{
    if(err.headersSent){
        return next(err);
    }else{
        res.status(500).json({error:err});
    }
}

app.use(errorHandling);
//server run
app.listen(port, () => {
  console.log(`Server Running  ${port}`)
})



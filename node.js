const express=require('express')
const app=express();
const db=require('./db');
const MenuItem=require('./models/Menu')
const Person=require('./models/person')
const personRoutes=require('./Routes/PersonRoutes')
const menuRoutes=require('./Routes/MenuRoutes')
require('dotenv').config();

const passport=require('./auth')

const bodyParser=require('body-parser');
app.use(bodyParser.json());



//middleware function\
const logRequest=(req,res,next)=>{
      console.log(`[${new Date().toLocaleString()}] Request to: ${req.originalUrl}`);
      next();
}

app.use(logRequest);

app.use(passport.initialize());

const localAuthMiddleware=passport.authenticate('local',{session:false})

//we can apply authentication in any route

app.get('/',(req,res)=>{
    res.send("server is running on 3000");
})

const PORT=process.env.PORT ||3000;
//import router
app.use('/person',personRoutes);
app.use('/menu',localAuthMiddleware,menuRoutes);

app.listen(PORT,()=>{
   console.log('listening to port 3000')
});
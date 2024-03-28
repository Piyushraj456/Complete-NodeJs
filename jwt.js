const jwt=require('jsonwebtoken');
require('dotenv').config();


const jwtAuthMiddleware=(req,res,next)=>{
 //first check request header has authorization or not
//  const authorization=req.headers.authorization;
//  if(!authorization) 
//  return res.status(401).json({error:'Token NOt found'})

//   //Extract the jwt  token from the request header
// const token=req.headers.authorization.split(' ')[1];
//    if(!token) return res.status(401).json({error:'Unauthorized'});


const authorization=req.headers.authorization;
if(!authorization) 
  return res.status(401).json({error:'Token not found'});

//Extract the jwt token from the request header
const tokenArray = req.headers.authorization.split(' ');
if(tokenArray.length !== 2 || tokenArray[0] !== 'Bearer') 
  return res.status(401).json({error:'Unauthorized'});

const token = tokenArray[1];




  
   try {
        //verify jwt token
        //return payload of jwt token on successful verify
      const decoded=jwt.verify(token,process.env.JWT_SECRET);
      //pass the user info from token to request object for access
      //req.jwtpayload=decoded
      req.user=decoded
       next();

   } catch (error) {
    console.log(error);
    res.status(401).json({error:'Invalid Token'})
   }
}

//function to Generate the JWT Token
//paerameter userdata->payload
const generateToken=(userData)=>{
     return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:30000})
}



module.exports={jwtAuthMiddleware,generateToken}
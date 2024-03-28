const express=require('express');
const router=express.Router();
const Person=require('../models/person');
const {jwtAuthMiddleware,generateToken}=require('../jwt')

router.post('/signup', async (req, res) => {
   try {
       const data = req.body;
       
       // If data is an array, insert each person separately
       if (Array.isArray(data)) {
           const responses = [];
           for (const personData of data) {
            try {
               const newPerson = new Person(personData);
               const response = await newPerson.save();
               const payLoad={
                  id:response.id,
                  username:response.username,
                  email:response.email
               }
               const token = generateToken(payLoad);
               console.log("Token Is :", token);
               console.log('Data saved');
               responses.push({ response, token });
           } catch (error) {
               console.error('Error saving person data:', error);
               // Handle error as needed, e.g., log it or send an error response
               res.status(500).json({ error: 'Error saving person data' });
               return; // Exit loop if an error occurs
           }
           }
           console.log('Data saved');
           res.status(200).json(responses);
       } else {
           // If data is a single object, insert it as a single person
           const newPerson = new Person(data);
           const response = await newPerson.save();
           const payLoad={
            id:response.id,
            username:response.username,
            email:response.email
         }
            const token=generateToken(payLoad);
            console.log(JSON.stringify(payLoad));
            console.log("Token Is :",token)
           console.log('Data saved');
           res.status(200).json({response:response,token:token});
       }
   } catch (error) {
       console.log(error);
       res.status(500).json({ error: 'Internal server error' });
   }
});
router.put('/:id',async(req,res)=>{
   try {
      const personId=req.params.id;
      const updatedPerson=req.body;
      const response=await Person.findByIdAndUpdate(personId,updatedPerson,{
         new:true,
         runValidators:true
      })

      if(!response)
      return res.status(404).json({error:'Person not Found'})

      console.log("Data Updated");
      res.status(200).json(response);

   } catch (error) {
      console.log(error);  
       res.status(500).json({error:'Internal Server Error'})
   }
})

router.delete('/:id',async(req,res)=>{
   try {
      const personId=req.params.id;
      const response=await Person.findByIdAndDelete(personId);
      if(!response)
      return res.status(404).json({error:'Person not Found'})

      console.log("Data Deleted");
      res.status(200).json({message:'Person Deleted Successfully'});

   } catch (error) {
      console.log(error);
      res.status(500).json({error:'Internal Server Error'})
   }
})

/*Login Route*/ 
router.post('/login',async(req,res)=>{
  try {
   //extract username and pass from req.body
    const {username,password}=req.body;
    //find the user by username
    const user=await Person.findOne({username:username});
    //if user dne or pass not match
   if(!user||!(await user.comparePassword(password)))
   {
      return res.status(401).json({error:'Invalid Username or Password'});
   }
   //generate token
   const payLoad={
      id:user.id,
      username:user.username,
      email:user.email
   }
  const token=generateToken(payLoad);
  //return token as response
  res.json({token})


  } catch (error) {
   console.log(error);
       res.status(500).json({error:'Internal server error'})
  }
})
//profile route
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
   try {
      const userData=req.user;
      console.log("user data:",userData);
      const userId=userData.id;
      const user=await Person.findById(userId)
      res.status(200).json({user:user})
   } catch (error) {
      console.log(error);
      res.status(500).json({error:'Internal server error'})
   }
})



   router.get('/',async(req,res)=>{
    try {
       const data= await Person.find();
       console.log('data fetched');
       res.status(200).json(data)
    } catch (error) {
       console.log(error);
       res.status(500).json({error:'Internal server error'})
    }   
   })

   router.get('/:work',async(req,res)=>{
    try {
       const workType=req.params.work;
       if(workType==='chef'||workType==='manager'||workType==='waiter')
       {
          const response=await Person.find({work:workType})
          console.log("response fetched work type",workType);
          res.status(200).json(response)
       }
       else
       {
          res.status(404).json({error:'invalid work type'})
       }
    } catch (error) {
       console.log(error);
     res.status(500).json({error:'Internal server error'})
    }
 })
 
 module.exports=router;
const express=require('express')
const router=express.Router();
const MenuItem=require('../models/Menu')





// router.post('/',async(req,res)=>{
//     try {
//      const data=req.body;
//      const newMenu= new MenuItem(data);
//      const savedMenu= await newMenu.save();
 
//      console.log('data saved')
//      res.status(200).json(savedMenu);
 
 
//     } catch (error) {
//      console.log(error);
//      res.status(500).json({error:'Internal server error'})
//     }
//  })

 router.post('/', async (req, res) => {
    try {
        const data = req.body;
        
        // If data is an array, insert each person separately
        if (Array.isArray(data)) {
            const responses = [];
            for (const personData of data) {
                const newMenuItem = new MenuItem(personData);
                const response = await newMenuItem.save();
                responses.push(response);
            }
            console.log('Data Menu saved');
            res.status(200).json(responses);
        } else {
            // If data is a single object, insert it as a single person
            const newMenu= new MenuItem(data);
            const savedMenu= await newMenu.save();
        
            console.log('data menu saved')
            res.status(200).json(savedMenu);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
 });








 
 router.get('/',async(req,res)=>{
    try {
       const data=await MenuItem.find();
       console.log('menu is fetched');
       res.status(200).json(data);
    } catch (error) {
       console.log(error)
       res.status(500).json({error:'Internal server error'})
    }
 })

router.get('/:taste',async(req,res)=>{
    try {
        const tasteType=req.params.taste;
        if(tasteType=='Sour'||tasteType=='Sweet'||tasteType=='Spicy')
        {
            const response=await MenuItem.find({taste:tasteType})
            console.log("Menu according to taste fetched");
            res.status(200).json(response)
        }
        else
        {
            res.status(404).json({error:'Invalid Menu Type'})
        }



    } catch (error) {
        console.log(error)
        res.status(500).json({error:'internal server error '})
    }
})



 module.exports=router;
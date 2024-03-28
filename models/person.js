const mongoose = require("mongoose");
//define person schema
const bcrypt=require("bcrypt");
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  work: {
    type: String,
    enum: ["chef", "waiter", "manager"],
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required:true,
  },
  salary: {
    type: Number,
    required: true,
  },
  username:{
    type:String,
    required: true,
    unique: true,
  },
  password:{
    type:String,
    required: true,
  },

  
},{
    timestamps: true
});
//pre is middleware of mongodb before saving in database
personSchema.pre('save',async function(next){
  const person=this;

    if(!person.isModified('password')) return next();
    // if password is not modified go to to next work

  try {
    //hash password generation
     const salt=await bcrypt.genSalt(10);
     //hash password
    const hashedPassword=await bcrypt.hash(person.password,salt);
    person.password=hashedPassword;

    next();//next middleware or next function once one middleware is done
  } catch (error) {
         return next(error);

  }
})


personSchema.methods.comparePassword=async function(personPassword)
{
  try {
      //use bcrypt to compare passsword with hash password
   // it conver the login password to hash password and match the already stored hashed password

   const isMatch=await bcrypt.compare(personPassword,this.password);
   return isMatch;
  } catch (error) {
    throw error
  }
}

//create person schema


const Person=mongoose.model('Person',personSchema);

module.exports=Person;
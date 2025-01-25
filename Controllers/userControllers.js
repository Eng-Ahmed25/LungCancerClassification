const userModel = require('../Models/user.schema'); 
const imageModel = require('../Models/images.schema'); 
const bcrypt = require('bcrypt')
const jwtT = require('../middleware/jwt')
const multer = require('multer');
const fs = require('fs');
exports.signup = async (req, res) =>
{
    try
    {
        const {name , email , password}  = req.body; 
        const username = await userModel.findOne({name})
        const newemail = await userModel.findOne({email})

        if(username)
        {
            return res.status(405).json({message:"User is already Been Taken"})
        }
        if(newemail)
        {
            return res.status(422).json({message:"Email is already Been Taken"})
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = new userModel(
        {
            name : name,
            email:email,
            password : hashPassword,
        }
        )
        await newUser.save()
        res.status(201).json({User: newUser, message:"User Added Successfully"})
    }
    catch(err)
    {
    console.log(err)
    res.status(500).json({message: "Internal Server Error"})
    }
}

exports.login = async (req , res) =>
{
    try 
    {
        let user = await userModel.findOne({name : req.body.name}) ; 
        if(!user)
        {
            return  res.status(401).json({message : "Invalid name or Password"})
        }

        let passworCheck =  await user.comparePasswords(req.body.password) 
        if(passworCheck === false)  
        {
            return res.status(403).json({message : "Invalid name or Password"})
            
        }
        const token = await jwtT.generatToken(user)
        console.log(token)
        return res.status(200).json({message:"User Login in " , user: {id : user.id , name:user.name , email: user.email , token : token}})


    } 

    catch(err)  
    {   
        console.log(err)
            console.log(err)
            res.status(400).json({message: err.message})

    }
} 

 
exports.getAllusers = async (req , res) =>

{
        try{
            const user = await userModel.find()
            res.json({message:"OK" , User:user})
        }
        catch(err)
        {
            console.log(err)
            res.json({message:"something went wring" , Error: err})
        }
    
    }
    exports.logout = async (req , res) => 
    {
        try 
        {
            
            await userModel.findByIdAndDelete({_id:req.params.id})
            await imageModel.findOneAndDelete({userId:req.params.userId});

            res.json({message:"User Logout Successfully "})
        }
        catch(err)
        {
    
            console.log(err.message)
            res.status(500).json({message: "Internl server erro"}); 
    
        }
    };
    const storage = multer.memoryStorage(); // Store files in memory
    const upload = multer({ storage });

 
exports.upload = async (req, res) => {
  // The middleware 'upload.single()' must be used separately
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error handling file upload');
    }

    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded');
      }

      const _id = req.userID;

      // Check if an image already exists for the user
      const existingImage = await imageModel.findOne({ _id: _id });

      if (existingImage) {
        // If image exists, update it
        existingImage.name = req.file.originalname;
        existingImage.data = req.file.buffer;
        existingImage.contentType = req.file.mimetype;

        await existingImage.save();
        return res.status(200).send('Image updated successfully');
      } else {
        // If image doesn't exist, create a new one
        const newImage = new imageModel({
          _id: _id,
          name: req.file.originalname,
          data: req.file.buffer,
          contentType: req.file.mimetype,
        });

        await newImage.save();
        return res.status(200).send('Image uploaded and saved to database');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
};
 
    
const userModel = require('../Models/user.schema'); 
const imageModel = require('../Models/images.schema'); 
const ColneimageModel = require('../Models/colneImage.schema'); 
const ctimageModel = require('../Models/ctImage.schema'); 


 const bcrypt = require('bcrypt')
const jwtT = require('../middleware/jwt')
const multer = require('multer');
const fs = require('fs');
const sharp =  require('sharp')
const FormData = require('form-data'); // Import form-data library
const axios = require('axios')
exports.signup = async (req, res) =>
{
    try
    {
        const {name , email , password , role}  = req.body; 
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
            role : role
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
        return res.status(200).json({message:"User Login in " , user: {id : user.id , name:user.name , email: user.email , token : token , role: user.role}})


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
            await ColneimageModel.findOneAndDelete({userId:req.params.userId});
            await ctimageModel.findOneAndDelete({userId:req.params.userId});


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
    
          // Create a FormData object
          const formData = new FormData();
          formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
          });
    
          // Send the image to the FastAPI endpoint for prediction
          const fastApiUrl = 'https://lungcancermodel-production.up.railway.app/predict/';
          const predictionResponse = await axios.post(fastApiUrl, formData, {
            headers: {
              ...formData.getHeaders(),
            },
          });
    
          // Log the entire response for debugging
          console.log('FastAPI Response:', predictionResponse.data);
    
          // Check if the response has the expected structure
      
          // Extract the predicted_class
          const predictedClass = predictionResponse.data.predicted_class;
          console.log('Predicted Class:', predictedClass); // Debugging
    
          // Check if an image already exists for the user
          const existingImage = await imageModel.findOne({ _id: _id });
    
          if (existingImage) {
            // If image exists, update it with the new prediction
            existingImage.name = req.file.originalname;
            existingImage.data = req.file.buffer;
            existingImage.contentType = req.file.mimetype;
            existingImage.prediction = predictedClass; // Save the prediction
    
            await existingImage.save();
          } else {
            // If image doesn't exist, create a new one with the prediction
            const newImage = new imageModel({
              _id: _id,
              name: req.file.originalname,
              data: req.file.buffer,
              contentType: req.file.mimetype,
              prediction: predictedClass, // Save the prediction
            });
    
            await newImage.save();
          }
    
          // Send the prediction back to the client
          res.status(200).json({
            message: 'Image uploaded and prediction received',
            prediction: predictionResponse.data,
          });
        } catch (error) {
          console.error('Error:', error);
          res.status(500).send('Server error');
        }
      });
    };
    
    exports.uploadColne = async (req, res) => {
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
    
          // Create a FormData object
          const formData = new FormData();
          formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
          });
    
          // Send the image to the FastAPI endpoint for prediction
          const fastApiUrl = 'https://ai-colone-production.up.railway.app/predict/';
          const predictionResponse = await axios.post(fastApiUrl, formData, {
            headers: {
              ...formData.getHeaders(),
            },
          });
    
          // Log the entire response for debugging
          console.log('FastAPI Response:', predictionResponse.data);
    
          // Check if the response has the expected structure
      
          // Extract the predicted_class
          const predictedClass = predictionResponse.data.predicted_class;
          console.log('Predicted Class:', predictedClass); // Debugging
    
          // Check if an image already exists for the user
          const existingImage = await ColneimageModel.findOne({ _id: _id });
    
          if (existingImage) {
            // If image exists, update it with the new prediction
            existingImage.name = req.file.originalname;
            existingImage.data = req.file.buffer;
            existingImage.contentType = req.file.mimetype;
            existingImage.prediction = predictedClass; // Save the prediction
    
            await existingImage.save();
          } else {
            // If image doesn't exist, create a new one with the prediction
            const newImage = new ColneimageModel({
              _id: _id,
              name: req.file.originalname,
              data: req.file.buffer,
              contentType: req.file.mimetype,
              prediction: predictedClass, // Save the prediction
            });
    
            await newImage.save();
          }
    
          // Send the prediction back to the client
          res.status(200).json({
            message: 'Image uploaded and prediction received',
            prediction: predictionResponse.data,
          });
        } catch (error) {
          console.error('Error:', error);
          res.status(500).send('Server error');
        }
      });
    };
    


    exports.uploadCt = async (req, res) => {
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
    
          // Create a FormData object
          const formData = new FormData();
          formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
          });
    
          // Send the image to the FastAPI endpoint for prediction
          const fastApiUrl = 'https://ctcancermodel-production.up.railway.app/predict/';
          const predictionResponse = await axios.post(fastApiUrl, formData, {
            headers: {
              ...formData.getHeaders(),
            },
          });
    
          // Log the entire response for debugging
          console.log('FastAPI Response:', predictionResponse.data);
    
          // Check if the response has the expected structure
      
          // Extract the predicted_class
          const predictedClass = predictionResponse.data.predicted_class;
          console.log('Predicted Class:', predictedClass); // Debugging
    
          // Check if an image already exists for the user
          const existingImage = await ctimageModel.findOne({ _id: _id });
    
          if (existingImage) {
            // If image exists, update it with the new prediction
            existingImage.name = req.file.originalname;
            existingImage.data = req.file.buffer;
            existingImage.contentType = req.file.mimetype;
            existingImage.prediction = predictedClass; // Save the prediction
    
            await existingImage.save();
          } else {
            // If image doesn't exist, create a new one with the prediction
            const newImage = new ctimageModel({
              _id: _id,
              name: req.file.originalname,
              data: req.file.buffer,
              contentType: req.file.mimetype,
              prediction: predictedClass, // Save the prediction
            });
    
            await newImage.save();
          }
    
          // Send the prediction back to the client
          res.status(200).json({
            message: 'Image uploaded and prediction received',
            prediction: predictionResponse.data,
          });
        } catch (error) {
          console.error('Error:', error);
          res.status(500).send('Server error');
        }
      });
    };
    


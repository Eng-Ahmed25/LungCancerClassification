const userModel = require('../Models/user.schema'); 
const bcrypt = require('bcrypt')
const jwtT = require('../middleware/jwt')
 
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
        let user = await userModel.findOne({email : req.body.email}) ; 
        if(!user)
        {
            res.status(401).json({message : "Invalid Email or Password"})
        }
        let passworCheck =  await user.comparePasswords(req.body.password) 
        if(passworCheck === false)  
        {
            res.status(403).json({message : "Invalid Email or Password"})
            
        }
        const token = await jwtT.generatToken(user)
        console.log(token)
        res.status(200).json({message:"User Login in " , user: {name:user.name , email: user.email , token : token}})


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
 
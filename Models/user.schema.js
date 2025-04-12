const mongoose = require('mongoose')
const Schema = mongoose.Schema ; 
const bcrypt = require('bcrypt')

const userSchema = new Schema(
    {
    name : {type:String , unique : true}, 
    email : {type:String , unique : true}, 
    password:String,
    role : {type: String , enm : ['Doctor' , 'Patient'] , default: 'Patient'}
    }
    )
    userSchema.methods.comparePasswords = async function (password)
    {
    return await bcrypt.compare(password , this.password)
    }
 
module.exports =  mongoose.model('User' , userSchema)   
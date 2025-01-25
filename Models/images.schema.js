const mongoose = require('mongoose')
const Schema = mongoose.Schema ; 
 

const imageSchema = new Schema(
    {
        name: String,
        data: Buffer,
        contentType: String,
        // prediction: String, 
        _id: { // Optional field to associate with a user
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
    }
)
 
module.exports =  mongoose.model('Image' , imageSchema)
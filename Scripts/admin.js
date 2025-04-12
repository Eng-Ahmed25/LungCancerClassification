 const userModel = require('../Models/user.schema')
const bcrypt = require('bcrypt')

const createaAdmin = async () =>
{
    try
    {
        const findAdmin = await userModel.findOne({email: "Doctor@gmail.com"})
        if(!findAdmin)
        {
            const Admin = new userModel({
                name: "Doctor" , 
                email : "Doctor@gmail.com" , 
                password: await bcrypt.hash("123456789", 10) , 
                role : 'Doctor'
            })  
            await Admin.save()
        }
        else
        {
            console.log("Admin Aleady exisist")
        }

    }

    catch(err)
    {
        console.log(err.message)
    }
}
module.exports = createaAdmin ;
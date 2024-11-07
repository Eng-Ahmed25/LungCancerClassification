 const userModel = require('../Models/user.schema')
const bcrypt = require('bcrypt')

const createaAdmin = async () =>
{
    try
    {
        const findAdmin = await userModel.findOne({email: "AdminBrand55@gmail.com"})
        if(!findAdmin)
        {
            const Admin = new userModel({
                name: "Admin" , 
                email : "AdminBrand55@gmail.com" , 
                password: await bcrypt.hash("123456789", 10) , 
                role : 'admin'
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
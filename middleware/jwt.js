const jwt = require("jsonwebtoken")
 
const generatToken =  async (user) =>
{
    const payLoad = {
        id: user._id , 
        email: user.email, 
        role:user.role
    }
   return  jwt.sign(payLoad , "secret", {expiresIn : '1h'}) ; 

}
module.exports = {
    generatToken
}   
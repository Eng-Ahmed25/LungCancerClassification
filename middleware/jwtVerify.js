const jwt  = require('jsonwebtoken');
module.exports = (req , res , next) =>
{
    try
    {
        const fullToken = req.headers.authorization  ; 
        const token = fullToken?.split(' ')[1]
        if(!token)
        {
            res.status(400).send('Acess Denided')
        }
        const deadToken = jwt.verify(token , 'secret')
        req.user = deadToken 
        req.userID = deadToken.id; // Assuming the user ID is in the token

        next()
    }
catch(err)
{
    console.log(err)
    res.json({message:"Invalid Token"})
}
}
 
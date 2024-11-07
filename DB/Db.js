const mongoose = require('mongoose')
 
exports.ConnectToDB = async ()=>
{
    
    try 
        {
            await mongoose.set('strictQuery', false)
            await mongoose.connect(process.env.uriDB);
            console.log('Connected To DataBase')

        }
        catch(err)
        {
            console.log("Connection Tmdb Erro" , err); 
            process.exit()
        }
   
}
 
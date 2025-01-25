const express = require("express") ;
const router = express.Router()
const userController = require('../Controllers/userControllers')
const authntication = require("../middleware/jwtVerify")


router.post('/api/signup' ,userController.signup)
router.post('/api/login' ,userController.login)
router.post('/api/upload' , authntication ,  userController.upload)
router.get('/api/users', authntication , userController.getAllusers) 
router.delete('/api/logout/:id',   userController.logout)


 // get all users
// router.get('/api/users/:id' , authntication , controllerBooks.getOneBook)
// router.delete('/api/users/delete:id' , authntication , controllerBooks.deleteBook)  
// router.put('/api/users/update:id' , authntication , controllerBooks.updateBook)
// router.post('/api/users' , authntication, controllerBooks.addBook)


module.exports = router
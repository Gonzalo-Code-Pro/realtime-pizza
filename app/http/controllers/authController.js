const bcrypt  =require('bcrypt')
const flash = require('express-flash')
const passport = require('passport')
const User = require('../../models/user')

function authController() {
  return {
    login(req, res) {
      
      res.render('auth/login')
    },

    logout(req,res){
        req.logout()
      return res.redirect('/login')
    }
    ,
    postLogin(req,res,next){
      passport.authenticate('local',(err,user,info)=> {
          if(err){
            req.flash('error',info.message)
            return next(err)
          }
        if(!user){
            req.flash('error',info.message)
            return res.redirect('/login')
         }

        req.logIn(user,(err)=> {
          if(err){
            req.flash('error',info.message)
            return next(err)
          }

          return res.redirect('/')

        })
      }) (req,res,next)
    },




    register(req, res) {
      res.render('auth/register')
    },
     async postRegister(req,res) {
        const {name,email,password} = req.body
        //validadte request
         if(!name || !email  || !password){
             req.flash('error','Complete todos los campos')
             req.flash('name',name)
             req.flash('email',email)
             return res.redirect('/register')
         }
         //verificacion de email
        User.exists({ email:email} ,(err,result)=> {
              if(result){
                req.flash('error','Email ya existe, inicie session')
                req.flash('name',name)
                req.flash('email',email) 
                return res.redirect('/register')
              }
        })

        //hash a password 
        const hashedPassword = await bcrypt.hash(password,10)

       //create a user 
        const user  = new User({
            name:name,
            email:email,
            password : hashedPassword
        })


       user.save().then(() => {//login
            return res.redirect('/')   
       }).catch(err =>{
          req.flash('error','Algo salio mal , vuelva a intentar')
          return ers.redirect('/register')
       })
         console.log(req.body)
     }
  }
}


module.exports = authController

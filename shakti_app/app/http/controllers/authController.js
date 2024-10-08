
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

function authController(){
    return{
        login: function(req,res){
            res.render('auth/login')
        },

        postLogin(req,res,next){
            passport.authenticate('local',(err,user,info)=>{
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error',info.message)
                    return res.redirect('/login')
                }
                req.logIn(user,(err)=>{
                    if(err){
                        req.flash('error',info.message)
                        return next(err)
                    }
                    return res.redirect('/')
                })
            })(req,res,next)
        },

        register(req,res){
            res.render('auth/register')
        },

        async postRegister(req,res){
            const {name, email, password } = req.body;
            
            // Validate request; 
            if(!name || !email || !password ){
                req.flash('error','All fields are required')
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
            }

            // check duplicate user;
            const us = await  User.findOne({ email: email })
            if(us) {
               
                req.flash('error', 'Email already taken')
                req.flash('name', name)
                req.flash('email', email) 
                return res.redirect('/register')
                
            }
            // Hash password
            const hashedPassword = await bcrypt.hash(password,10)

            // Creater a new usser;
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            })

            user.save().then((user)=>{
                // login
                return res.redirect('/')
            }).catch(err =>{
                req.flash('error', 'Something went wrong')
                return res.redirect('/register')
            })
            
        },
        logout(req,res){
            req.logout(()=>{
                return res.redirect('/login')
            })
            
        }
    }
}

module.exports = authController;
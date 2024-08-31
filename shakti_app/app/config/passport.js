const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

function init(passport){

    passport.use(new LocalStrategy({ usernameField: 'email'},async(email,password,done)=>{
        
        // check if email exit; 
        const user = await User.findOne({email: email})
        if(!user){
            return done(null,false, {message: 'No user with this email'})
        }

        bcrypt.compare(password,user.password).then(match =>{
            // check password if matched; 
            if(match){
                return done(null,user, {message: 'Login in successfully'})
            }
            // if password not matched;
            return done(null,false, {message:'Wrong username or password'})

        })

    }))

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })

    passport.deserializeUser(async(id, done)=>{
        const u = await User.findById(id)
        if(u){
            done(null,u)
        }
    })
    
}

module.exports = init
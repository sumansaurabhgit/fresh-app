const express = require("express");
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000 ;
const path = require('path')
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const passport = require('passport')


const url = 'mongodb+srv://gaurav:test123@cluster0.s0vns9c.mongodb.net/shakti';
mongoose.connect(url, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
})

//Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave:false,
    store: MongoDbStore.create({ mongoUrl: 'mongodb+srv://gaurav:test123@cluster0.s0vns9c.mongodb.net/shakti' }),
    saveUnintialized: false,
    cookie: { maxAge: 1000*60*60*24}

}))

//Passport config

const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())



app.use(flash())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//Gobal middleware
app.use((req,res,next)=>{
    res.locals.session = req.session;
    res.locals.user = req.user
    next()
})
app.use(expressLayout)
app.set('views', path.join( __dirname,'/resources/views'))
app.set('view engine', 'ejs')


// Assets 
app.use(express.static('public'));


require('./routes/web')(app)




app.listen(PORT, function(){
    console.log(`Listening on port ${PORT}`)
});

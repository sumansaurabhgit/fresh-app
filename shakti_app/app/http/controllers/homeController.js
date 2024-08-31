const Product = require('../../models/product')
function homeController(){
    return{
        async index(req,res){

            const fresh = await Product.find()
            // console.log(fresh)
            return res.render('home', {fresh:fresh})
        }
    }
}

module.exports = homeController;
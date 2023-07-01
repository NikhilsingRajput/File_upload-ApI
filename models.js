const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');

/*
this model is for storing the user profile details when one tryes to registrer
such as name,password,
*/

const User= new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    profession : String,
    password: String,
    time: String,
    tokens: [
        {
            token: {
                type: String,
                required:true
            }
        }
    ]

})

User.methods.generateAuthToken = async function(){
    try {
        let token = jwt.sign({_id:this._id},'DFLKVNDUFHBDFNMFDKJVHIURDVBNDFMBVFDBB');
        this.tokens = this.tokens.concat({token: token});
       await this.save();
       return token
    } catch (error) {
        console.log(error)
    }
}


module.exports=mongoose.model('User',User);
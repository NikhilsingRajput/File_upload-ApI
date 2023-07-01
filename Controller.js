const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models')
const Register = async (req, res) => {
    // console.log('R')
    const { name, email, phone, profession, password } = req.body
    // Check if email already exists 
    let existinguser;
    try {
        existinguser = await User.findOne({ email: email })
    } catch (error) {
        console.log(error)
    }
    if (existinguser) {
        return res.status(400).json({ Message: 'email already exists' })
    }
    // Hashing
    const hashedpassword = bcrypt.hashSync(password);

    const user = new User({
        name,
        email,
        phone,
        profession,
        password: hashedpassword,
        time: new Date()
    });
    try {
        await user.save();
        return res.status(201).json({ Success: user })

    } catch (error) {
        console.log(error)
    }

}

const Signin = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({ error: "plz Filled the data " })
        }

        const userlogin = await User.findOne({ email: email });

        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Credientials" })
            } else {
                
                const token = await userlogin.generateAuthToken(); // see user.js in model
                // console.log(token)

                res.cookie('jwtoken', token, {
                    // path: '/',
                    // expires: new Date(Date.now() + 10000000), //10 min
                    // httpOnly: true
                    sameSite: 'none',
                    secure: 'true'
                })
                return res.status(200).json({ message: "Sign in Success", user: userlogin, token })
            }
        }
        return res.status(400).json({ error: "Invalid Credientials" })


    } catch (error) {
        console.log(error)
    }
}

const Logout = (req, res) => {
    // console.log("logout")
    res.clearCookie('jwtoken', { path: '/' })
    res.status(200).send("logout success")
}


const Authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        // console.log(token)
        const verifyToken = jwt.verify(token, process.env.Token_Key);
        const rootUser = await User.findOne({ _id: verifyToken._id });
        // console.log(rootUser)
        if (!rootUser) {
            console.log("no user found")
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next();
        // res.send(req.rootUser)

    } catch (error) {
        res.status(401).send('NO Token Provided');
    }
}


module.exports = {
    Logout, Signin, Register, Authenticate
}
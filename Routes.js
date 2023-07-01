const express = require('express');
const { upload, List, deleteImage } = require('./aws_controls/cloud');
const { Signin, Register, Logout } = require('./Controller');
const router = express.Router();

// login route
router.post('/', Signin)

// New User Registeration
router.post('/signup',Register)

// Define a route for uploading an image to aws s3
router.post('/upload', upload.single('image'), (req, res) => {
    res.json({Success: "Image Uploaded to cloud", imageUrl: req.file.location });
});

// get all images
router.get('/list',List);

// Define a DELETE route for deleting a file
router.delete('/delete/:key',deleteImage)

router.get('/logout',Logout);

// Wrong route
router.get("*",(req,res)=>{
    res.send("Invalid Route").status(400)
})



module.exports=router
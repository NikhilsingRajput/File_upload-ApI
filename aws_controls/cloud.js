const { S3Client,ListObjectsV2Command,GetObjectCommand,DeleteObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const { getSignedUrl  } =require("@aws-sdk/s3-request-presigner");
const multerS3 = require('multer-s3');
require('dotenv').config();


// Configure AWS SDK
const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.PASSWORD
    }
  });

  // Configure multer middleware for upload to aws s3
const upload = multer({
    storage: new multerS3({
      s3: s3Client,
      bucket: process.env.BUCKET,
      
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, file.originalname)
      }
    })
  });



  // list/get all images
const List= (req, res) => {
    const params = {
      Bucket: process.env.BUCKET
    };
    s3Client.send(new ListObjectsV2Command(params))
      .then(async(data) => {
        const objects = data.Contents.map(obj => obj.Key);
          const imageKeys = objects
      
          const presignedUrls = await Promise.all(
            imageKeys.map((key) => {
              const command = new GetObjectCommand({ Bucket: params.Bucket, Key: key });
               return getSignedUrl(s3Client, command  // { expiresIn: 900 }
                ); // default to get signed url
    
            })
          );
          res.json({presignedUrls , imageKeys}) ;
        
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving the object list.' });
      });
  };
 

    // Define a DELETE route for deleting a file
const deleteImage = (req, res) => {
    const key  = req.body.id;
    console.log(key)
    const params = {
      Bucket: process.env.BUCKET,
      Key: key
    };
  
    s3Client.send(new DeleteObjectCommand(params))
      .then(() => {
        res.json({ message: 'File deleted successfully.' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting the file.' });
      });
  };

  module.exports = {upload , List , deleteImage}
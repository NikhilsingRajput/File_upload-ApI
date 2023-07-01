const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const routes = require('./Routes');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const url = process.env.MONGOURL;
require('dotenv').config();

mongoose.set('strictQuery',false);
const app = express();

mongoose
    .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
       
    })
    .then(() => {
        console.log("CONNECTED TO MONGODB DATABASE");
    });


app.use(cookieparser())
app.use(cors({credentials:true , origin:'*'}));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use('/',routes);



// Start the server
app.listen(5000, () => {
  console.log('Server started on port 5000');
});

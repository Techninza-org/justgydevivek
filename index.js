const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const auth=require('./router/authrouter');
const vendor=require('./router/vendorrouter');
const user=require('./router/userrouter');
const admin=require('./router/adminrouter');
const path = require('path');
const {middleware}=require('./middleware/middleware');
const { verify } = require('jsonwebtoken');
const fs = require('fs');


//importing express into 'app' for getting '.use()' function
const app = express();

//enabling cors for all requests (globally)
app.use(cors());



const uploadsDir = path.join(__dirname, 'uploads');


// Check if the uploads folder exists, create it if not
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

//MiddleWare
app.use(bodyParser.json());
app.use('/uploads', express.static(uploadsDir));


//parent routers
app.use('/auth',auth);
app.use(middleware);
app.use('/vendor', vendor);
app.use('/user',user);
app.use('/admin',admin);

//mongoDb Connected
const dbURI = 'mongodb+srv://justgyde:7982900770@justgyde.6chveyd.mongodb.net/'; // MongoDB Atlas
// const dbURI = 'mongodb://localhost:27017/local'; // MongoDB Compass
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error.message);
    });



//server start
    const PORT = process.env.PORT || 5000;
    app.listen(5000, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
    });
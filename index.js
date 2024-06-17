const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const auth=require('./router/authrouter');
const vendor=require('./router/vendorrouter');
const user=require('./router/userrouter');
const path = require('path');
const {middleware}=require('./middleware/middleware');
const { verify } = require('jsonwebtoken');


//importing express into 'app' for getting '.use()' function
const app = express();

//MiddleWare
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/services', serviceRouter);


//parent routers
app.use('/auth',auth);
app.use(middleware);
app.use('/vendor', vendor);
app.use('/user',user);

//mongoDb Connected
const dbURI = 'mongodb+srv://justgyde:7982900770@justgyde.6chveyd.mongodb.net/'; // Replace with your MongoDB connection string
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
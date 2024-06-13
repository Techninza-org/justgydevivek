const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const auth=require('./router/authrouter');
const vendor=require('./router/vendorrouter');
const user=require('./router/userrouter');
const {middleware}=require('./middleware/middleware');


//importing express into 'app' for getting '.use()' function
const app = express();

//MiddleWare
app.use(bodyParser.json());


//parent routers
app.use('/auth',auth);
app.use(middleware);
app.use('/vendor',vendor);
app.use('/user',user);

//mongoDb Connected
const dbURI = 'mongodb://localhost:27017/local'; // Replace with your MongoDB connection string
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error.message);
    });



//server start
    const PORT = process.env.PORT || 5000;
    app.listen(5000, () => {
        console.log(`Server is running on port ${PORT}`);
    });
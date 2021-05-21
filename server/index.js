const express = require('express');
const app = express();
const path = require("path");
const cors = require('cors')
const port = process.env.PORT || 2000;

const bodyParser = require('body-parser'); //req.body에 넣을 수 있게 해줌
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, 
    useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/users', require('./routes/users'));
app.use('/api/template', require('./routes/template'));
app.use('/api/comment', require('./routes/comment'));
app.use('/api/tipAndReview', require('./routes/tipAndReview'));
app.use('/api/notice', require('./routes/notice'));

//use this to show the image you have in node js server to client (react js)
app.use('/uploads', express.static('uploads'));


// Serve static assets if in production
if (process.env.NODE_ENV === "production") {

  // Set static folder   
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}


app.listen(port, () => {
  console.log(`Server Listening on http://localhost:${port}`)
})

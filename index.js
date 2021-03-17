const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser'); //req.body에 넣을 수 있게 해줌
const config = require('./config/key');

const { User } = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요!')
})

//회원가입을 위한 라우트
app.post('/register', (req, res) => {
  //회원가입할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다.

  /* req.body에 들어있는 형식
  {
    id: "hello"
    password: "123"
  }
  */
  const user = new User(req.body)

  user.save((err, userInfo) => { //정보들이 user model에 저장
    if(err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })  
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

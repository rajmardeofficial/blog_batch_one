const express = require('express');
const mysql = require('mysql')
const port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'rajmarde',
    password: 'xyz',
    database: 'blog_batch_one'
})

connection.connect((err)=>{
    if(err) throw err;
    console.log('connected');
})

app.listen(port, console.log(`server running on port ${port}`))
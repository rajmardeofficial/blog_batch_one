const express = require('express');
const mysql = require('mysql')
const session = require('express-session')
const port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))

//Create connection to database

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

app.use(
    session({
        secret: 'haslsiidfh',
        resave: false,
        saveUninitialized: false
    })
)

//GET list page

app.get('/', (req, res)=>{



    connection.query(
        'SELECT * FROM articles', 
        (err, results)=>{
            res.render('list', {articles: results})
        }
    )
})

//POST list page from form in admin.ejs

app.post('/', (req, res)=>{
    const heading = req.body.heading
    const summary = req.body.summary
    const content = req.body.content

    //Mysql Query for inserting data into article table

    connection.query(
        'INSERT INTO articles (title, summary, content) VALUES (?, ?, ?)',
        [heading, summary, content],
        (err)=>{
            console.log(err);
            res.redirect('/')
        }
    )

})


//GET article page using req.params

app.get('/article/:id', (req, res)=>{
    
    const id = req.params.id

    connection.query(
        'SELECT * FROM articles WHERE id = ?',
        [id],
        (err, results)=>{
            res.render('article', {article: results[0]})
            console.log(results[0]);
        }
    )
})


//Get login package

app.get('/login', (req, res)=>{
    res.render('login')
})

app.post('/login', (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    connection.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, results)=>{
            if(results.length > 0){
                if(password === results[0].password){

                    req.session.username = results[0].username

                    console.log(req.session);
                    res.render('secretpage')
                } else {
                    res.send('Failed to login')
                }
            } else{
                res.send('Data Not Found')
            }
        }

    )

})

// GET admin.ejs page

app.get('/admin', (req, res)=>{
    res.render('admin')
})


app.listen(port, ()=>console.log(`server running on port ${port}`))
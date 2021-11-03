const express = require('express');
const mysql = require('mysql');
const connection = require('./src/mysqlConnection');
const { urlencoded } = require('body-parser');

const app = express();

// set the view engine to ejs
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(urlencoded({ extended: false }))

// user
let user = null;
const setUser = (username) => {
    user = username;
}
const setUserToData = (data) => {
    data.user = user;
    return data;
}

// Home Page
app.get('/', (req, res) => {
    return res.render('index', {user: user});
});

// LogIn, LogOut and SignUp
app.get('/signup', (req, res) => {
  res.render('signup', setUserToData({}))
})
app.post('/signup', (req, res, next) => {
  try {
    let { username, isAdmin } = req.body;
    if (!isAdmin) {
      isAdmin = 0;
    }
    connection.query(`insert into User(username, isAdmin) values('${username}', ${isAdmin})`, (err, result) => {
      if (err) return next(err);
      setUser(username);
      res.redirect('/');
    })
  } catch (e) {
    return next(e);
  }
});
app.get('/login', (req, res) => {
    res.render('login', {user: user});
});
app.post('/login', (req, res) => {
    const username = req.body.username;
    connection.query(`select username from User where username='${username}'`, (err, result) => {
        if (err) return next(err);
        if (result.length == 1) {
            setUser(result[0].username);
        }
        console.log(username);
        res.redirect('/');
    });
});
app.post('/logout', (req, res) => {
    setUser(null);
    res.redirect('/');
})

// User
app.get('/user', (req, res) => {
    res.render('user', setUserToData({}));
});

// Problem
app.get('/problem', (req, res) => {
    res.render('problem', setUserToData({}));
})

// error handler
const errorHandler = (err, req, res, next) => {
  console.log('error');
  res.status(500);
  res.render('error', setUserToData({ err: err }));
}
app.use(errorHandler);

const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => {
    connection.query('SHOW TABLES', (err, result) => {
        if (err) throw err;
        console.log('tables: ' + JSON.stringify(result));
    });
    console.log(`app is running on port ${PORT}`)
});

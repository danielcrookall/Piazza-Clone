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
let userId = null;
const setUser = (username, userID) => {
    user = username;
    userId = userID;
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
      setUser(username, result[0].userID);
      res.redirect('/');
    })
  } catch (e) {
    return next(e);
  }
});
app.get('/login', (req, res) => {
    res.render('login', {user: user});
});
app.post('/login', (req, res, next) => {
    const username = req.body.username;
    connection.query(`select userID, username from User where username='${username}'`, (err, result) => {
        if (err) return next(err);
        if (result.length == 1) {
          setUser(result[0].username, result[0].userID);
        }
        console.log(user + ' ' + userId);
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
// input: nothing
// query: select all problem with all attribute and return
// output render 'problem' with problems key
app.get('/problem', (req, res) => {
  const context = {}
    connection.query(`select * from Problem`, (err, result) => {
      if (err) return next(err);
      context.problems = result;
      connection.query('select * from Course', (err2, result2) => {
        if (err2) return next(err2);
        context.courses = result2;
        connection.query('select * from Type', (err3, result3) => {
          if (err3) return next(err3);
          context.types = result3;
          res.render('problem', setUserToData(context));
        });
      });
    });
});
// input: all attribute for problem
// query: create a new problem
// output redirect '/problem'
app.post('/problem', (req, res) => {
  console.log(req.body);
  res.redirect('/problem');
});

// Solution
// input: nothing
// query: select all problem with all attribute and return
// output render 'solution'
app.get('/solution', (req, res) => {
  res.render('solution', setUserToData({}));
});
// input: all attributes of solution
// query: create a new solution
// output render 'solution'
app.post('/solution', (req, res) => {
  res.redirect('/solution');
});

// Advice
// input: nothing
// query: select all problem with all attribute and return
// output render 'advice'
app.get('/advice', (req, res) => {
  res.render('advice', setUserToData({}));
});
// input: all attributes of advice
// query: create a new advice
// output render 'advice'
app.post('/advice', (req, res) => {
  res.redirect('/advice');
});


// Advice Request
// input: nothing
// query: select all problem with all attribute and return
// output render 'advice-request'
app.get('/advice-request', (req, res) => {
  res.render('advice-request', setUserToData({}));
});
// input: all attributes of advice-request
// query: create a new advice-request
// output render '/advice-request'
app.post('/advice-request', (req, res) => {
  res.redirect('/advice-request');
});

// Course
app.get('/course', (req, res, next) => {
  const context = {};
  const testData = [
    [304, 'CPSC'],
    [322, 'CPSC'],
    [213, 'CPSC'],
    [200, 'MATH'],
    [221, 'MATH'],
    [112, 'ENGL'],
    [302, 'MATH'],
    [101, 'PHYS']
  ];
  context.courses = testData;
  connection.query(`select * from Register where userID=${userId}`, (err, result) => {
    if (err) return next(err);
    context.registerCourses = result;
    res.render('course', setUserToData(context));
  });
});
app.post('/register', (req, res, next) => {
  const register = req.body.register;
  const department = register.split(' ')[0];
  const courseNum = register.split(' ')[1];
  connection.query(`insert into Register(userID, courseNum, department) values('${userId}', '${courseNum}', '${department}')`, (err, _result) => {
    if (err) return next(err);
    res.redirect('/course');
  });
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

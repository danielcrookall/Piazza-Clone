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
// output render 'problem', keys: problems, courses
app.get('/problem', (req, res, next) => {
  const context = {};
  connection.query('select * from Problem', (err, result) => {
    if (err) next(err);

    context.problems = result;
    connection.query('select * from Course', (err2, result2) => {
      if (err2) next(err2);

      context.courses = result2;
      connection.query('select * from Type', (err3, result3) => {
        if (err3) next(err3);

        context.types = result3;
        res.render('problem', setUserToData(context));
      });
    });
  });
});
// input: all attribute for problem
// query: create a new problem
// output redirect '/problem'
app.post('/problem', (req, res, next) => {
  // console.log(req.body);
  const course = req.body.course.split(' ');
  const department = course[0];
  const courseNum = course[1];
  const queryString = 'insert into Problem(title, body, userID, typeName, courseNum, department, difficulty) ' + 
  `values('${req.body.title}', '${req.body.body}', ${userId}, 
  '${req.body.typeName}', ${courseNum}, '${department}', ${req.body.difficulty});`
  connection.query(queryString, (err, result) => {
    if (err) next(err);
    res.redirect('/problem');
  })
});

// Solution
// input: nothing
// query: select all solution with all attribute and return
// output render 'solution'
app.get('/solution', (req, res, next) => {
  const context = {};
  connection.query('select * from Solution', (err, result) => {
    if (err) next(err);

    context.solutions = result;
    
    connection.query('select * from Problem', (err2, result2) => {
      if (err2) next(err2);

      context.problems = result2;

      res.render('solution', setUserToData(context));
      });
    });
});

// input: all attributes of solution
// query: create a new solution
// output render 'solution'
app.post('/solution', (req, res, next) => {
    // console.log(req.body);
    const queryString = 'insert into Solution(body, userID, problemID, confidence) ' + 
    `values('${req.body.body}', ${userId}, 
    ${req.body.problem}, ${req.body.confidence});`
    connection.query(queryString, (err, result) => {
      if (err) next(err);
      res.redirect('/solution');
    });
});

// Advice
// input: nothing
// query: select all advice with all attribute and return
// output render 'advice'
app.get('/advice', (req, res, next) => {
    const context = {};
    connection.query('select * from Advice', (err,result) => {
        if (err) next(err);

        context.advices = result;
    connection.query('select * from Solution', (err2, result2) =>  {
        if (err2) next(err2);

        context.solutions = result2;

    connection.query('select * from VoteNumPosition', (err3, result3) => {
        if (err3) next(err3);
        context.positions = result3;

        res.render('advice', setUserToData(context));

    });
});
});
});


// input: all attributes of advice
// query: create a new advice
// output render 'advice'
app.post('/advice', (req, res, next) => {
  let randomInt = getRandomInt(0,10000);
  console.log(req.body);
  connection.query(`insert into Advice(solutionID, adviceID, comment, userID, voteNum)
  values('${req.body.solutionID}', '${randomInt}', '${req.body.comment}', '${req.body.user}', '${req.body.voteNum}')`, (err, result) => {
    if (err) next(err);

  res.redirect('/advice');
  });
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


// Advice Request
// input: nothing
// query: select all problem with all attribute and return
// output render 'advice-request'
app.get('/advice-request', (req, res, next) => {
  const context = {};
  connection.query('select * from AdviceRequest', (err, result) => {
    if (err) next(err);

    context.adviceRequests = result;
    connection.query('select * from User', (err2, result2) => {
      if (err2) next(err2);

      context.users = result2;
      res.render('advice-request', setUserToData(context));
    });
  });
});
// input: all attributes of advice-request
// query: create a new advice-request
// output render '/advice-request'
app.post('/advice-request', (req, res, next) => {
  console.log(req.body);
  connection.query(`insert into AdviceRequest(body, requestType, userID) 
  values('${req.body.body}', '${req.body.requestType}', '${req.body.user}')`, (err, result) => {
    if (err) next(err);

    res.redirect('/advice-request');
  });
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

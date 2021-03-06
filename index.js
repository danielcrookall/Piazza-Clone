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
let isAdmin = null;
const setUser = (username, userID, admin) => {
    user = username;
    userId = userID;
    isAdmin = admin;
}
const setUserToData = (data) => {
    data.user = user;
    data.isAdmin = isAdmin;
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
      connection.query(`select userID, username, isAdmin from User where username='${username}'`, (err2, result2) => {
        if (err2) return next(err2);
        setUser(username, result2[0].userID, result2[0].isAdmin);
        res.redirect('/');
      });
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
    connection.query(`select userID, username, isAdmin from User where username='${username}'`, (err, result) => {
        if (err) return next(err);
        if (result.length == 1) {
          setUser(result[0].username, result[0].userID, result[0].isAdmin);
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

const getFields = async (tableName) => {
  return new Promise((resolve, reject) => {
    connection.query(`show columns from ${tableName}`, (err, result) => {
      if (err) return reject(err);

      const fields = [];
      const types = {};
      result.forEach(row => {
        fields.push(row.Field);
        types[`${row.Field}`] = row.Type
      });
      return resolve({ fields, types });
    });
  });
}
// Select
app.get('/select', async (req, res, next) => {
  const context = {
    tableNames: [
      'User', 'Type',
      'DepartmentFaculty', 'Course',
      'Register', 'Problem',
      'Admin', 'Solution',
      'AdviceRequest', 'VoteNumPosition',
      'Advice', 'VoteRecord'
    ],
    table: null,
  };
  for (let i = 0; i < context.tableNames.length; i++) {
    const tableName = context.tableNames[i];
    const result = await getFields(tableName);
    context[`${tableName}Columns`] = result.fields;
    context[`${tableName}Types`] = result.types;
  }
  // console.log(context);
  res.render('select', setUserToData(context));
});
app.post('/select', async (req, res, next) => {
  const context = {
    tableNames: [
      'User', 'Type',
      'DepartmentFaculty', 'Course',
      'Register', 'Problem',
      'Admin', 'Solution',
      'AdviceRequest', 'VoteNumPosition',
      'Advice', 'VoteRecord'
    ],
  };
  for (let i = 0; i < context.tableNames.length; i++) {
    const tableName = context.tableNames[i];
    const result = await getFields(tableName);
    context[`${tableName}Columns`] = result.fields;
    context[`${tableName}Types`] = result.types;
  }

  const tableName = req.body.tableName;
  const fields = context[`${tableName}Columns`];
  const types = context[`${tableName}Types`];

  const projectColumns = [];
  const conditions = [];
  fields.forEach(col => {
    if (req.body[`${col}-column`]) {
      projectColumns.push(col);
    }
    if (req.body[`${col}_opd`] !== '') {
      const type = types[`${col}`];
      const val = (req.body[`${col}_op`] === 'like')? `%${req.body[`${col}_opd`]}%`:req.body[`${col}_opd`];
      if (type.includes('varchar')) {
        conditions.push(`${col} ${req.body[`${col}_op`]} '${val}'`);
      } else {
        conditions.push(`${col} ${req.body[`${col}_op`]} ${val}`);
      }
    }
  });
  let projectString = '';
  if (projectColumns.length === 0) {
    projectString = '*';
  } else {
    projectString = projectColumns.join(', ');
  }

  let conditionString = '';
  if (conditions.length > 0) {
    conditionString = ' where '
    conditionString += conditions.join(' and ');
  }
  // console.log(conditionString);
  connection.query(`select ${projectString} from ${req.body.tableName}${conditionString}`, (err, result) => {
    if (err) return next(err);

    if (result.length <= 0) {
      return res.redirect('/select');
    }

    context.table = {};
    context.table.tableName = req.body.tableName;
    context.table.thead = [];
    Object.keys(result[0]).forEach(key => {
      context.table.thead.push(key);
    })
    context.table.tbody = [];
    for (let i = 0; i < result.length; i++) {
      const row = [];
      Object.keys(result[i]).forEach(key => {
        row.push(result[i][key]);
      });
      context.table.tbody.push(row);
    }
    return res.render('select', setUserToData(context));
  });
});

/**
 * Problem
 */

// input: nothing
// query: select all problem with all attribute and return
// output render 'problem', keys: problems, courses
app.get('/problem', (req, res, next) => {
  const context = {};
  context.averageDiffDept = null;
  connection.query('select * from Problem', (err, result) => {
    if (err) return next(err);

    context.problems = result;
    connection.query('select * from Course', (err2, result2) => {
      if (err2) return next(err2);

      context.courses = result2;
      connection.query('select * from Type', (err3, result3) => {
        if (err3) return next(err3);

        context.types = result3;
        res.render('problem/problem', setUserToData(context));
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
    if (err) return next(err);
    res.redirect('/problem');
  })
});
app.get('/problem/update', (req, res, next) => {
  const context = {};
  connection.query('select * from Problem', (err, result) => {
    if (err) return next(err);

    context.problems = result;
    connection.query('select * from Course', (err2, result2) => {
      if (err2) return next(err2);

      context.courses = result2;
      connection.query('select * from Type', (err3, result3) => {
        if (err3) return next(err3);

        context.types = result3;
        res.render('problem/updateProblem', setUserToData(context));
      });
    });
  });
});
app.post('/problem/update', (req, res, next) => {
  const setColumns = [];
  if (req.body['title-column']) {
    setColumns.push(`title='${req.body.title}'`);
  }
  if (req.body['body-column']) {
    setColumns.push(`body='${req.body.body}'`);
  }
  if (req.body['diff-column']) {
    setColumns.push(`difficulty=${req.body.difficulty}`);
  }
  if (req.body['course-column']) {
    const course = req.body.course.split(' ');
    const department = course[0];
    const courseNum = course[1];
    setColumns.push(`courseNum=${courseNum}`);
    setColumns.push(`department='${department}'`);
  }
  if (req.body['type-column']) {
    setColumns.push(`typeName='${req.body.typeName}'`);
  }
  const setString = setColumns.join(', ');
  const problemID = `problemID${req.body['problemid-op']}${req.body['problemid-opd']}`;
  connection.query(`update Problem set ${setString} where ${problemID};`, (err, result) => {
    if (err) return next(err);

    res.redirect('/problem');
  });
});
app.post('/problem/select', (req, res, next) => {
  const projectColumns = ['problemID', 'userID'];
  if (req.body['title-column']) {
    projectColumns.push('title');
  }
  if (req.body['body-column']) {
    projectColumns.push('body');
  }
  if (req.body['diff-column']) {
    projectColumns.push('difficulty');
  }
  if (req.body['course-column']) {
    projectColumns.push('department');
    projectColumns.push('courseNum');
  }
  if (req.body['type-column']) {
    projectColumns.push('typeName');
  }

  const projectString = projectColumns.join(', ');
  const context = {};
  
  connection.query(`select ${projectString} from Problem`, (err, result) => {
    if (err) return next(err);

    context.problems = result;
    connection.query('select * from Course', (err2, result2) => {
      if (err2) return next(err2);

      context.courses = result2;
      connection.query('select * from Type', (err3, result3) => {
        if (err3) return next(err3);

        context.types = result3;
        res.render('problem/problem', setUserToData(context));
      });
    });
  });
});
app.post('/problem/avgDiffDept', (req, res, next) => {
  const context = {};
  const operator = (req.body.diffOpr === 'more')? '>' : '<';
  const queryString = `
  select department, AVG(difficulty) as avgDiff
  from Problem
  group by department
  having AVG(difficulty) ${operator} ${req.body.diffOpd}
  `;
  connection.query(queryString, (err, result) => {
    if (err) return next(err);

    context.averageDiffDept = result;
    connection.query('select * from Problem', (err1, result1) => {
      if (err1) return next(err1);
  
      context.problems = result1;
      connection.query('select * from Course', (err2, result2) => {
        if (err2) return next(err2);
  
        context.courses = result2;
        connection.query('select * from Type', (err3, result3) => {
          if (err3) return next(err3);
  
          context.types = result3;
          res.render('problem/problem', setUserToData(context));
        });
      });
    });
  });
});

/**
 * Solution
 */

// input: nothing
// query: select all solution with all attribute and return
// output render 'solution'
app.get('/solution', (req, res, next) => {
  const context = {};
  connection.query('select * from Solution', (err, result) => {
    if (err) return next(err);

    context.solutions = result;
    
    
    connection.query('select * from Problem', (err2, result2) => {
      if (err2) return next(err2);

      context.problems = result2;

      res.render('solution/solution', setUserToData(context));
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
      if (err) return next(err);
      res.redirect('/solution');
    });
});
// update solution
app.get('/solution/update', (req, res, next) => {
  const context = {};
  connection.query('select * from Solution', (err, result) => {
    if (err) return next(err);

    context.solutions = result;
    
    connection.query('select * from Problem', (err2, result2) => {
      if (err2) return next(err2);

      context.problems = result2;

      res.render('solution/updateSolution', setUserToData(context));
      });
    });
});

// passed req.body: 
app.post('/solution/update', (req, res, next) => {
  const solutionID = `solutionID${req.body['solutionid-op']}${req.body['solutionid-opd']}`;
  var queryString = `UPDATE Solution SET `
  var prev = false;
  if (JSON.stringify(req.body).includes('body-column')){
    queryString = queryString.concat(`body = '${req.body.body}' `)
    prev = true;
  }
  if (JSON.stringify(req.body).includes('confidence-column')){
    if (prev){
      queryString = queryString.concat(', ')
    }
    queryString = queryString.concat(`confidence = '${req.body.confidence}' `)
    prev = true;
  }
  if (JSON.stringify(req.body).includes('problem-column')){
    if (prev){
      queryString = queryString.concat(', ')
    }
    queryString = queryString.concat(`problemID = '${req.body.problem}' `)
  }
  queryString = queryString.concat(`WHERE ${solutionID}`)
  const newString = queryString;
  connection.query(newString, (err, result) => {
    if (err) return next(err);
    res.redirect('/solution/update');
  });
});


// delete solution
app.get('/solution/delete', (req, res, next) => {
  const context = {};
  connection.query('select * from Solution', (err,result) => {
    if (err) return next(err);

    context.solutions = result;
    res.render('solution/deleteSolution', setUserToData(context));
  }); 
});

// query: delete a solution
app.post('/solution/delete', (req, res, next) => {
  const solutionID = `solutionID${req.body['solutionid-op']}${req.body['solutionid-opd']}`;
  connection.query(`delete from Solution where ${solutionID};`, (err, result) => {
    if (err) return next(err);

    res.redirect('/solution');
  });
});

// See the average confidence rate of all solution for each user (showing with each username)
app.get('/solution/avgConfidence', (req, res, next) => {
  const context = {};
  
  connection.query(`select username, CAST(AVG(confidence) as decimal(10)) as avgConfidence from solution s, user u 
  where s.userID = u.userID group by u.username`, (err,result) => {
    if (err) return next(err);
    context.avgConfidences = result;   
    // console.log(result);   
    
    return res.render('solution/averageConfidence', setUserToData(context));
  });
});


/**
 * Advice
 */

app.get('/advice', (req, res, next) => {
  const context = {};
  connection.query('select * from Advice inner join User on Advice.userID = User.userID', (err,result) => {
    if (err) return next(err);

    context.advices = result;
    connection.query('select * from Solution', (err2, result2) =>  {
    if (err2) return next(err2);

    context.solutions = result2;
    res.render('advice/advice', setUserToData(context));
    });
  });
});
// input: all attributes of advice
// query: create a new advice
// output render 'advice'
app.post('/advice', (req, res, next) => {
  let randomInt = getRandomInt(0,10000);
  connection.query(`insert into Advice(solutionID, adviceID, comment, userID)
  values(${req.body.solution}, ${randomInt}, '${req.body.comment}', ${userId})`, (err, result) => {
    if (err) return next(err);

    connection.query(`insert into VoteRecord(status, solutionID, adviceID, userID)
    values('normal', ${req.body.solution}, ${randomInt}, ${userId})`, (err2, result2) => {
      if (err2) return next(err2);

      res.redirect('/advice');
    });
  });
});

//delete advice
app.get('/advice/delete', (req, res, next) => {
  const context = {};
  connection.query('select * from Advice', (err,result) => {
    if (err) return next(err);

    context.advices = result;
    res.render('advice/deleteAdvice', setUserToData(context));
  });
});
// query: delete advice
app.post('/advice/delete', (req, res, next) => {
  const solutionID = `solutionID${req.body['solutionid-op']}${req.body['solutionid-opd']}`;
  const adviceID = `adviceID${req.body['adviceid-op']}${req.body['adviceid-opd']}`;
  connection.query(`delete from Advice where ${solutionID} and ${adviceID};`, (err, result) => {
    if (err) return next(err);

    res.redirect('/advice');
  });
});
app.post('/advice/select', (req, res, next) => {
  const projectColumns = ['solutionID', 'adviceID'];
  if (req.body['comment-column']) {
    projectColumns.push('comment');
  }
  if (req.body['userid-column']) {
    projectColumns.push('userID');
  }
  if (req.body['votenum-column']) {
    projectColumns.push('voteNum');
  }

  const projectString = projectColumns.join(', ');

  const context = {};
  connection.query(`select ${projectString} from Advice`, (err,result) => {
    if (err) return next(err);

    context.advices = result;
    connection.query('select * from Solution', (err2, result2) =>  {
    if (err2) return next(err2);

    context.solutions = result2;
    res.render('advice/advice', setUserToData(context));
    });
  });
});

// Join the Advice and User table to find all advice from a specific username
app.post('/advice/whose', (req, res, next) => {
  const context = {};
  connection.query(`select * from Advice inner join User on Advice.userID = User.userID
  where User.username ='${req.body.username}'`, (err, result) => {
    if (err) return next(err);
    // console.log(result);
    context.advices = result;

    connection.query('select * from Solution', (err2, result2) =>  {
      if (err2) return next(err2);
      // console.log(result2);
      context.solutions = result2;
    
      return res.render('advice/advice', setUserToData(context));
    });
  });
});

// Find the comment of the advice with maximum voting number for each solutions
app.get('/advice/maxVoteAdvice', async (req, res, next) => {
  const context = {};
  const queryString = `
  select s.solutionID, s.body, a.comment, Temp.maxVoteNum
  from Solution s, Advice a, (
    select solutionID, MAX(voteNum) as maxVoteNum
    from Advice
    group by solutionID) as Temp
  where s.solutionID = a.solutionID and a.solutionID = Temp.solutionID and
        a.voteNum = Temp.maxVoteNum
  `;
  
  try {
    const result = await getMaxVoteAdvice(queryString);
    context.maxVoteAdvice = result;
    return res.render('advice/maxVoteAdvice', setUserToData(context));
  } catch (e) {
    return next(e);
  }
});
const getMaxVoteAdvice = async (queryString) => {
  return new Promise((resolve, reject) => {
    connection.query(queryString, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// Voting
/**
 * Status
 * 'normal'
 * 'up'
 * 'down'
 */
const createVoteRecord = (sid, aid, uid) => {
  const queryString = `
  insert into VoteRecord(status,solutionID,adviceID,userID) values('normal',${sid},${aid},${uid});
  `;
  return new Promise((resolve, reject) => {
    connection.query(queryString, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  })
}
const getOrCreateVR = (sid, aid, uid) => {
  const queryString = `
  select recordID, status from VoteRecord
  where solutionID=${sid} and adviceID=${aid} and userID=${uid}
  `
  return new Promise((resolve, reject) => {
    connection.query(queryString, async (err, result) => {
      if (err) return reject(err);

      if (result.length === 0) {
        try {
          await createVoteRecord(sid, aid, uid);
          connection.query(queryString, (err2, result2) => {
            if (err2) return reject(err2);

            return resolve(result2);
          });
        } catch (err) {
          return reject(err);
        }
      } else {
        return resolve(result);
      }
    });
  })
}

/**
 * up
 * normal
 * down
 */
const updateVoteNum = (voteNum, sid, aid) => {
  return new Promise((resolve, reject) => {
    connection.query(`update Advice set voteNum=${voteNum} where solutionID=${sid} and adviceID=${aid}`, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
}
const updateVoteRecord = (sid, aid, uid, statusStr) => {
  return new Promise((resolve, reject) => {
    connection.query(`update VoteRecord set status='${statusStr}' where solutionID=${sid} and adviceID=${aid} and userID=${uid}`, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  }); 
}
const createVotePos = (voteNum) => {
  const pos = (voteNum > 0)? 'Positive': (voteNum === 0)? 'Neutral': 'Negative';
  return new Promise((resolve, reject) => {
    connection.query(`select * from VoteNumPosition where voteNum=${voteNum}`, (err, result) => {
      if (err) return reject(err);

      if (result.length === 0) {
        connection.query(`insert into VoteNumPosition(voteNum, votePos) values(${voteNum}, '${pos}')`, (err1, result1) => {
          if (err1) return reject(err1);

          return resolve(result1);
        });
      } else {
        return resolve(result);
      }
    });
  });
}
app.post('/advice/upvote/', async (req, res, next) => {
  const context = {};
  // console.log(req.body);
  const sid = req.body.solutionID;
  const aid = req.body.adviceID;

  let voteRecord;
  try {
    voteRecord = await getOrCreateVR(sid, aid, userId);
  } catch (err) {
    return next(err);
  }

  const voteNum = Number(req.body.voteNum);
  // console.log('record: ' + JSON.stringify(voteRecord));
  if (voteRecord.length !== 1) {
    return next(new Error('Invalid vote record'));
  }
  try {
    if (voteRecord[0].status === 'normal') {
      await createVotePos(voteNum + 1);
      await updateVoteNum(voteNum + 1, sid, aid);
      await updateVoteRecord(sid, aid, userId, 'up');
    } else if (voteRecord[0].status === 'down') {
      await createVotePos(voteNum + 1);
      await updateVoteNum(voteNum + 1, sid, aid);
      await updateVoteRecord(sid, aid, userId, 'normal');
    }
  } catch (err) {
    return next(err);
  }

  connection.query('select * from Advice', (err,result) => {
    if (err) return next(err);

    context.advices = result;
    connection.query('select * from Solution', (err2, result2) =>  {
    if (err2) return next(err2);

    context.solutions = result2;
    res.render('advice/advice', setUserToData(context));
    });
  });
});
app.post('/advice/downvote/', async (req, res, next) => {
  const context = {};
  // console.log(req.body);
  const sid = req.body.solutionID;
  const aid = req.body.adviceID;

  let voteRecord;
  try {
    voteRecord = await getOrCreateVR(sid, aid, userId);
  } catch (err) {
    return next(err);
  }

  const voteNum = Number(req.body.voteNum);
  // console.log('record: ' + JSON.stringify(voteRecord));
  if (voteRecord.length !== 1) {
    return next(new Error('Invalid vote record'));
  }
  try {
    if (voteRecord[0].status === 'normal') {
      await createVotePos(voteNum - 1);
      await updateVoteNum(voteNum - 1, sid, aid);
      await updateVoteRecord(sid, aid, userId, 'down');
    } else if (voteRecord[0].status === 'up') {
      await createVotePos(voteNum - 1);
      await updateVoteNum(voteNum - 1, sid, aid);
      await updateVoteRecord(sid, aid, userId, 'normal');
    }
  } catch (err) {
    return next(err);
  }

  connection.query('select * from Advice', (err,result) => {
    if (err) return next(err);

    context.advices = result;
    connection.query('select * from Solution', (err2, result2) =>  {
    if (err2) return next(err2);

    context.solutions = result2;
    res.render('advice/advice', setUserToData(context));
    });
  });
});


// Advice Request
// input: nothing
// query: select all problem with all attribute and return
// output render 'advice-request'
app.get('/advice-request', (req, res, next) => {
  const context = {};
  context.adviceAllUsers = null;
  connection.query('select * from AdviceRequest', (err, result) => {
    if (err) return next(err);

    context.adviceRequests = result;
    connection.query('select * from User', (err2, result2) => {
      if (err2) return next(err2);

      context.users = result2;
      res.render('advice-request', setUserToData(context));
    });
  });
});
// input: all attributes of advice-request
// query: create a new advice-request
// output render '/advice-request'
app.post('/advice-request', (req, res, next) => {
  // console.log(req.body);
  connection.query(`insert into AdviceRequest(body, requestType, userID) 
  values('${req.body.body}', '${req.body.requestType}', '${req.body.user}')`, (err, result) => {
    if (err) return next(err);

    res.redirect('/advice-request');
  });
});
app.post('/advice-request/adviceAllUser', (req, res, next) => {
  const context = {};
  const queryString = `
  select u.userID, u.username
  from User u
  where not exists (
    select solutionID
    from Solution
    where solutionID NOT IN (
      select solutionID
      from Advice a
      where a.userID = u.userID
    )
  )
  `;
  connection.query('select * from AdviceRequest', (err, result) => {
    if (err) return next(err);

    context.adviceRequests = result;
    connection.query('select * from User', (err2, result2) => {
      if (err2) return next(err2);

      context.users = result2;
      
      connection.query(queryString, (err3, result3) => {
        if (err3) return next(err3);

        context.adviceAllUsers = result3;
        res.render('advice-request', setUserToData(context));
      })
    });
  });
});



// Course
app.get('/course', (req, res, next) => {
  const context = {};
  connection.query('select * from Course', (err1, result1) => {
    if (err1) return next(err1);

    context.courses = result1;
    connection.query(`select * from Register where userID=${userId}`, (err, result) => {
      if (err) return next(err);
      context.registerCourses = result;
      res.render('course', setUserToData(context));
    });
  });
});
app.get('/course/create', (req, res, next) => {
  const context = {};
  const queryString = `
  select * from Course c, Departmentfaculty d
  where c.department = d.department
  `;
  connection.query(queryString, (err, result) => {
    if (err) return next(err);

    context.courseFaculties = result;
    res.render('createCourse', setUserToData(context));
  });
});
app.post('/course/create', (req, res, next) => {
  const queryString = `
  select * from Departmentfaculty where department='${req.body.department}'
  `;

  let department = req.body.department;
  let faculty = req.body.faculty;
  connection.query(queryString, (err, result) => {
    if (err) return next(err);

    if (result.length === 0) {
      connection.query(`insert into Departmentfaculty(department,faculty) values('${department}','${faculty}')`, (err1, result1) => {
        if (err1) return next(err1);

        connection.query(`insert into Course(courseNum, department) values(${req.body.courseNum},'${department}')`, (err2, result2) => {
          if (err2) return next(err2);

          return res.redirect('/course/create');
        })
      });
    } else {
      connection.query(`insert into Course(courseNum, department) values(${req.body.courseNum},'${department}')`, (err2, result2) => {
        if (err2) return next(err2);

        return res.redirect('/course/create');
      });
    }
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

CREATE TABLE User (
userID integer AUTO_INCREMENT,
username VARCHAR(32) UNIQUE NOT NULL,
isAdmin boolean,
PRIMARY KEY (userID)
);

CREATE TABLE Type (
typeName VARCHAR(100),
PRIMARY KEY (typeName)
);


CREATE TABLE DepartmentFaculty (
department VARCHAR(10),
faculty VARCHAR(20),

PRIMARY KEY (department) 
);

CREATE TABLE Course (
courseNum integer,
department VARCHAR(10),
PRIMARY KEY (courseNum, department),
FOREIGN KEY (department) REFERENCES DepartmentFaculty (department) ON DELETE CASCADE
);

CREATE TABLE Register (
userID integer,
courseNum integer,
department VARCHAR(10),
PRIMARY KEY (userID, courseNum, department),
FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
FOREIGN KEY (courseNum, department) REFERENCES Course (courseNum, department) ON DELETE CASCADE
);

CREATE TABLE Problem (
problemID integer AUTO_INCREMENT,
title VARCHAR(32),
body VARCHAR(5000),
userID integer NOT NULL,
typeName VARCHAR(100),
courseNum integer,
department VARCHAR(10),
difficulty FLOAT,
PRIMARY KEY (problemID),
FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
FOREIGN KEY (typeName) REFERENCES Type (typeName) ON DELETE SET NULL,
FOREIGN KEY (courseNum, department) REFERENCES Course (courseNum, department) ON DELETE SET NULL
);

CREATE TABLE Admin (
userID integer,
staffNum integer UNIQUE NOT NULL,
PRIMARY KEY (userID),
FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
);


CREATE TABLE Solution (
solutionID integer AUTO_INCREMENT,
body VARCHAR(5000),
userID integer NOT NULL,
problemID integer NOT NULL,
confidence integer,
PRIMARY KEY (solutionID),
FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
FOREIGN KEY (problemID) REFERENCES Problem(problemID) ON DELETE CASCADE
);


CREATE TABLE AdviceRequest (
requestID integer AUTO_INCREMENT,
body VARCHAR(5000),
requestType VARCHAR(32),
userID integer,
PRIMARY KEY (requestID),
FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE SET NULL
);

CREATE TABLE VoteNumPosition(
voteNum integer DEFAULT 0,
votePos char(20),
PRIMARY KEY (voteNum)
);

CREATE TABLE Advice (
solutionID integer,
adviceID integer,
comment VARCHAR(1000),
userID integer NOT NULL,
voteNum integer NOT NULL DEFAULT 0,
PRIMARY KEY (solutionID, adviceID),
FOREIGN KEY (solutionID) REFERENCES Solution(solutionID) ON DELETE CASCADE,
FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
);

CREATE TABLE VoteRecord (
recordID integer AUTO_INCREMENT,
status VARCHAR(32) NOT NULL,
solutionID integer NOT NULL,
adviceID integer NOT NULL,
userID integer NOT NULL,
PRIMARY KEY (recordID),
FOREIGN KEY (solutionID, adviceID) REFERENCES Advice(solutionID,adviceID) ON DELETE CASCADE,
FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
);

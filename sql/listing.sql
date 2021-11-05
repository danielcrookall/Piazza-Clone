-- DepartmentFaculty
--> Listing all departments
SELECT department FROM DepartmentFaculty;
--> Listing all faculties
SELECT DISTINCT faculty FROM DepartmentFaculty;

-- Type
--> Listing all problem types
SELECT * FROM Type;

-- Course
--> All Courses w all details (courseNum and department)
SELECT * FROM Course;
--> Finding courses by department name (search)
SELECT * FROM Course
WHERE department='departmentName';
--> Finding courses by year level
SELECT * FROM Course
WHERE courseNum BETWEEN value1 AND value2;


-- Problem
--> All Problems w all details
SELECT * FROM Problem;
--> All Problem titles
SELECT title FROM Problem;
--> Finding problems by difficulty
SELECT * FROM Problem
WHERE difficulty>=difficultyVal
ORDER BY difficulty DESC;
--> Finding problems by type
SELECT * FROM Problem
WHERE typeName=typeValue;
--> Finding courses by department
SELECT * FROM Problem
WHERE department='departmentName';
--> Finding courses by courseNum
SELECT * FROM Problem
WHERE courseNum=courseNumValue;

-- Solution
--> All Solutions w all details
SELECT * FROM Solution;
--> All Solutions for a particular problem 
SELECT * FROM Solution
WHERE problemID=problemIDVal
ORDER BY confidence DESC;

INSERT INTO User(userID, username, isAdmin)
VALUES
(1,'Robert', 1),
(2, 'Bobby', 0),
(3, 'Ricky', 0),
(4, 'Gom', 0),
(5, 'Rat', 0),
(6, 'Olivia', 0),
(7, 'T-rex', 0),
(8, 'Schmidt', 1);

INSERT INTO Type(typeName)
VALUES
('Writing'),
('Astronomy'),
('Probability'),
('Algorithm Analysis'),
('Cryptography'),
('AI'),
('Machine Learning'),
('Calculus');

INSERT INTO Departmentfaculty(department, faculty)
VALUES
('CPSC', 'Science'),
('MATH', 'Science'),
('ENGL', 'Arts'),
('PHYS', 'Science'),
('COMM', 'Business'); 


INSERT INTO Course(courseNum, department)
VALUES
(304, 'CPSC'),
(322, 'CPSC'),
(213, 'CPSC'),
(200, 'MATH'),
(221, 'MATH'),
(112, 'ENGL'),
(302, 'MATH'),
(101, 'PHYS');

INSERT INTO Register(userID, courseNum, department)
VALUES
(5, 322, 'CPSC'),
(4, 213, 'CPSC'),
(1, 322, 'CPSC'),
(1, 213, 'CPSC'),
(3, 304, 'CPSC'),
(2, 112, 'ENGL'),
(6, 101, 'PHYS'),
(1, 200, 'MATH');

INSERT INTO Problem(problemID, title, body, userID, typeName, courseNum, department, difficulty)
VALUES
(2, 'Quicksort', 'What is the time complexity of quicksort?', 4, 'Algorithm Analysis', 213, 'CPSC', 2.5),
(12, 'LCFS', 'When arc costs are equal, what search algorithm is LCFS equivalent to?', 5, 'AI', 322, 'CPSC', 3),
(10, 'Die Rolling', 'You roll a fair die until the first 1 comes up. What is the probability that the number of tosses is odd?', 3, 'Probability', 302, 'MATH', 3),
(3, 'There vs Their', 'Should I use there or their in the following sentence: "Is ____ going to be a party tomorrow', 2, 'Writing', 112, 'ENGL', 1),
(5, 'Riemann Sum', 'Estimate the area between f(x) = x^3 - 2x^2 + 4 and the x-axis on [1,4] using the right end points of the subintervals for the height of the rectangles.', 1, 'Calculus', 200, 'MATH', 2.3);

INSERT INTO Admin(userID, staffNum)
VALUES
(3,5000),
(5,1203),
(6,32),
(7,20);

INSERT INTO Solution(solutionID, body, userID, problemID, confidence)
VALUES
(1, 'The width of each subinterval is 0.5. So the area is approximately 0.5 * f(1.5) + 0.5*f(2) + 0.5 * f(2.5) + 0.5 *f(3) + 0.5 * f(3.5) + 0.5 * f(4) = 683/16', 2, 5, 80),
(2, 'You should use there. Their is a posessive pronoun. There is an adbverb and means in or at that place.', 4, 3, 40),
(3, 'Add up the probabilities of the die coming up 1 for the first time on toss 1,3,5 ... Rewrite it as a series and solve. The answer is 2/3.', 5, 10, 30),
(4, 'The time complexity of quick sort is O(n!). It is a terrible algorithm and you should never use it', 7, 2, 20),
(5, 'If the arc costs are equal, lowest cost first search is equivalent to BFS. This makes sense, because when performing LCFS you just use a priority queue. If the costs of the arcs are no longer a factor, the priority queue acts just like a regular queue.', 3, 12, 50),
(6, 'I think you should use there for this particular question, but I am not too sure!', 2, 3, 20),
(7, 'I am like a 100% sure quicksort takes O(n log n) time, even a PHD in linguistics on Reddit says so!', 2, 2, 100),
(8, 'I think majority of sorting algorithm take O(n log n) so Im gonna guess that. Theres probably a 50/50 chance Im right', 4, 2, 50),
(9, 'I think it should just be a 1/6 chance no matter what, but I am not too sure', 7, 10, 10),
(10, 'DFS. I mean in that case we would just go to the first arc that is in order. And then from there we repeat the same process', 5, 12, 80);

INSERT INTO AdviceRequest(requestID, body, requestType, userID)
VALUES
(1, 'I do not think this solution is correct. Can someone please verify it', 'help',1),
(2, 'Can you explain how you got x=5?', 'explanation', 2),
(3, 'Still unanswered!', 'help', 3 ),
(4, 'How do you know that BFS is complete?', 'question', 4),
(5, 'What happens if you flip a coin instead of throwing a die?', 'question', 5);

INSERT INTO VoteNumPosition(voteNum, votePos)
VALUES
(1, 'Positive'),
(2, 'Negative'),
(0, 'Neutral'),
(-4, 'Negative'),
(-5, 'Negative');

INSERT INTO Advice(solutionID, adviceID, comment, userID, voteNum)
VALUES
(1,1,'I got the same answer but it would be helpful if you showed a bit more work!', 5, 0),
(2, 3, 'Maybe give some more examples to make it more clear', 4, 0),
(3, 5, 'This is wrong. The probability of rolling a 6 is 1/6', 7, 0),
(4, 2, 'Wrong. Quicksort runs in O(n^2) time in the worst case. On average it actually takes O(nlogn) making it quite an efficient algorithm', 3, 0),
(5, 9, 'I disagree. DFS uses a queue not BFS. So the answer is DFS.', 4, 0);

INSERT INTO VoteRecord(recordID, status, solutionID, adviceID, userID)
VALUES
(1, 'normal', 1, 1 , 5),
(2, 'normal', 2, 3, 4),
(3, 'normal', 3, 5, 7),
(4, 'normal', 4, 2, 3),
(5, 'normal', 5, 9, 4);
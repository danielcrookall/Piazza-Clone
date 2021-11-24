INSERT INTO User(userID, username, isAdmin)
VALUES
(1,'Robert', 1),
(2, 'Bobby', 0),
(3, 'Ricky', 0),
(4, 'Gom', 0),
(5, 'Rat', 0),
(6, 'Olivia', 0),
(7, 'T-rex', 0),
(8, 'Schmidt', 1),
(9, 'Daniel', 1),
(10, 'Jacek', 1),
(11, 'Liam', 1);

INSERT INTO Type(typeName)
VALUES
('Grammar'),
('Astronomy'),
('Probability'),
('Algorithm Analysis'),
('Cryptography'),
('AI'),
('Machine Learning'),
('Computer Systems'),
('Linear Algebra'),
('Calculus');

INSERT INTO Departmentfaculty(department, faculty)
VALUES
('CPSC', 'Science'),
('MATH', 'Science'),
('ENGL', 'Arts'),
('PHYS', 'Science'),
('COMM', 'Business'),
('ASTR', 'Science'); 


INSERT INTO Course(courseNum, department)
VALUES
(304, 'CPSC'),
(322, 'CPSC'),
(213, 'CPSC'),
(221, 'CPSC'),
(200, 'MATH'),
(221, 'MATH'),
(112, 'ENGL'),
(302, 'MATH'),
(333, 'ASTR'),
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
(3, 'There vs Their', 'Should I use there or their in the following sentence: "Is ____ going to be a party tomorrow', 2, 'Grammar', 112, 'ENGL', 1),
(5, 'Riemann Sum', 'Estimate the area between f(x) = x^3 - 2x^2 + 4 and the x-axis on [1,4] using the right end points of the subintervals for the height of the rectangles.', 1, 'Calculus', 200, 'MATH', 2.3),
(1, 'Stack Smash Attacks', "Are stack smash attacks possible on architectures that deploy a stack that grows down instead of up?", 4, 'Computer Systems', 213, 'CPSC', 2.5),
(4, 'Address Alignment', 'Is 0x000073bc aligned to store an 8-byte integer?', 3, 'Computer Systems', 213, 'CPSC', 1.5),
(6, 'Bitwise Operations', 'Assuming that i is an integer variable that stores a non-negative value, how do you compute i % 16 with bitwise operations?', 2, 'Computer Systems', 213, 'CPSC', 2.5),
(7, 'Area Calculation', 'Let S be an ellipse in R2 whose area is 5. Compute the area of T(S), where T(x)=Ax and A is the matrix [2 3;0 -3]', 5, 'Linear Algebra', 221, 'MATH', 2.5),
(8, 'Binary Search Tree', 'Given a binary search tree, which traversal type would print the values in the nodes in sorted order?', 3, 'Algorithm Analysis', 221, 'CPSC', 1),
(9, 'Fusion Reactions', 'Which particle is produced by fusion reactions in the Sun yet travels to Earth and beyond unimpeded?', 5, 'Astronomy', 333, 'ASTR', 2),
(11, 'Discrete Random Variables', 'What does a geometric random variable calculate?', 4, 'Probability', 302, 'MATH', 2.5); 

INSERT INTO Admin(userID, staffNum)
VALUES
(1,5000),
(8,1203),
(9,32),
(10,20),
(11,1);

INSERT INTO Solution(solutionID, body, userID, problemID, confidence)
VALUES
(1, 'The width of each subinterval is 0.5. So the area is approximately 0.5 * f(1.5) + 0.5*f(2) + 0.5 * f(2.5) + 0.5 *f(3) + 0.5 * f(3.5) + 0.5 * f(4) = 683/16', 2, 5,5),
(2, 'You should use there. Their is a posessive pronoun. There is an adbverb and means in or at that place.', 4, 3, 5),
(3, 'Add up the probabilities of the die coming up 1 for the first time on toss 1,3,5 ... Rewrite it as a series and solve. The answer is 2/3.', 5, 10, 3),
(4, 'The time complexity of quick sort is O(n!). It is a terrible algorithm and you should never use it', 7, 2, 2),
(5, 'If the arc costs are equal, lowest cost first search is equivalent to BFS. This makes sense, because when performing LCFS you just use a priority queue. If the costs of the arcs are no longer a factor, the priority queue acts just like a regular queue.', 3, 12, 1),
(6, "Yes, the attack is still possible, but only for code with an array underflow.", 3, 1, 90),
(7, "In order for an address to be aligned by n bytes, it should be completely divisible by n (with no remainder). Since 0x000073bc ends in a 0xc it is not divisible by 8 and therefore not aligned.", 3,4,95),
(8, "Dividing by any power of 2 is the same as right shifting by that many bits. The remainder of these divisions is the bit that gets cut off due to the right shift. So in order to preserve these bits you take i & 15", 3, 6, 99),
(9, 'The area T(S) is the area of the original ellipse S * the absolute value of the determinant of A. Det(A) = 2 * -3 = -6. So the area of T(S) is |-6| * 5 = 30.', 2, 7, 75),
(10, 'An in-order traveral.', 2, 8, 100),
(11, 'Neutrino.', 4, 9, 50),
(12, 'A geometric random variable is the number of trials needed to get the first success in repeated Bernoulli trials. Its mean is 1/p and its variance is (1-p)/p^2. Its PMF is (1-p)^(x-1)*p where x = 1,2,3 ...', 4, 11, 78);


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
(2, 'Positive'),
(0, 'Neutral'),
(-4, 'Negative'),
(50, 'Positive'),
(5, 'Positive'),
(-985, 'Negative'),
(20, 'Positive'),
(-122, 'Negative'),
(-1, 'Negative'),
(3, 'Positive'),
(4, 'Positive'),
(-101, 'Negative'),
(-20, 'Negative'),
(10, 'Positive');


INSERT INTO Advice(solutionID, adviceID, comment, userID, voteNum)
VALUES
(1, 1,'I got the same answer but it would be helpful if you showed a bit more work!', 5, 0),
(4, 2, 'Wrong. Quicksort runs in O(n^2) time in the worst case. On average it actually takes O(nlogn) making it quite an efficient algorithm', 3, 50),
(2, 3, 'Maybe give some more examples to make it more clear', 4, 5),
(11,4, 'What is a neutrino?', 1, 0),
(3, 5, 'This is wrong. The probability of rolling a 6 is 1/6', 7, -985),
(8, 6, 'Do not forget that multiplying by powers of 2 is the equivalent of right shifting. Also remember the difference between signed and unsigned shifts!',2,20),
(6, 7, 'Stack smash attacks are much harder nowadays due to security measures such as nonexecutable stacks, randomization and stack canaries',3,0),
(2, 8, "When do you use they're then?", 4, 0),
(5, 9, 'I disagree. DFS uses a queue not BFS. So the answer is DFS.', 4, -122),
(9, 10, 'How do you calculate the determinant of a matrix?', 8, 0),

(1, 11, 'Please update your solution with the math expressions formatted bettter.', 1, -1),
(2, 12, "Correct. Don't forget the last case they're. This one is easy though, it's just a combination of they + are", 1, 3),
(3, 13, 'Can you show the explicit sum?', 1, 1),
(4, 14, "100% wrong, look in any textbook and you'll see that quicksort has an average time complexity of O(nlogn).", 1, 4),
(5, 15, 'Good explanation, looks correct.', 1, 20),
(6, 16, 'You should include what an array underflow is. An array underflow error is when depending on input you may be able to access elements before the beginning of the array.', 1, 5),
(7, 17, 'Correct! A good trick is that a number that is divisible by 2 ends in 0 in binary, 00 is divisible by 4, 000 is divisible by 8 etc!', 1, 2),
(8, 18, 'Yep, lookup bitwise operations to learn more.', 1, 3),
(9, 19, "Yep, the determinant of a 2x2 matrix is the area of a parallelogram", 1, 4),
(10, 20, "It's important to memorize the different types of traversals for trees. They come up frequently in algorithm studies.", 1, 2),
(11, 21, 'Yep and neutrinos have a mass close to 0.', 1, 1),
(12, 22, 'Remember there are actually 2 definitions for a geometric random variable. The other one is the number X of Bernoulli trials needed to get one success.', 1, 1),

(1, 23, 'I got the same answer. I think this is correct', 6, 5),
(2, 24, "Isn't this taught in elementary school?", 6, -101),
(3, 25, 'How did you compute the sum?', 6, 1),
(4, 26, "Ya this is definitely wrong. Quicksort is often used all the time.", 6, 4),
(5, 27, "What's the difference between DFS and BFS?", 6, -20),
(6, 28, 'Is a stack smash attack the same as a buffer overflow?', 6, 5),
(7, 29, 'Why does address alignment even matter?', 6, 2),
(8, 30, 'This is a form of bitmasking. You can google it for more information.', 6, 10),
(9, 31, "This was covered in Math 200, multivariable calculus.", 6, 50),
(10, 32, "Guaranteed to show up on leetcode.", 6, 2),
(11, 33, 'Just remember a neutrino is a subatomic particle similar to an electron.', 6, 1),
(12, 34, 'I was never good at probability, but this does look correct.', 6, 1);


INSERT INTO VoteRecord(recordID, status, solutionID, adviceID, userID)
VALUES
(1, 'normal', 1, 1 , 5),
(2, 'normal', 2, 3, 4),
(3, 'normal', 3, 5, 7),
(4, 'normal', 4, 2, 3),
(5, 'normal', 5, 9, 4);
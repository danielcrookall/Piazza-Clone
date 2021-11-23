### Before you start
1. 
  - clone this repo
  - move to the repository directory
  - run ```npm install``` 
  
2.
  - create `.env` file
  - write your environment variable
    -  Example on ubc remote server
    ```
    DB_HOST=dbserver.students.cs.ubc.ca
    CWL=<your cwl id>
    DB_PASSWORD=<letter 'a' followed by your student number>
    DB=<your cwl id>
    ```
    - CWL: username of database

### How to start app
- ```npm start```

### The way to connect MySQL manually
  - Log into MySQL by running:
`mysql -h dbserver.students.cs.ubc.ca -u 'your cwl' -p`
  - When prompted for your password, enter the letter a followed by your student number. For example, if your student number was 12345678 then your password would be a12345678. 

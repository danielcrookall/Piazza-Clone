const express = require('express');

const app = express();

app.use(express.Router());

// set the view engine to ejs
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index');
});

const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`app is running on port ${PORT}`)
});
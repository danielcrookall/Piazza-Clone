import * as experss from 'express';

const app = experss();

app.use(experss.Router());

// set the view engine to ejs
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index');
});

const PORT = 8080;
app.listen(PORT);
console.log(`app is running on port ${PORT}`)
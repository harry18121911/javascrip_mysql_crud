const express = require('express');
const morgan = require('morgan'); 
const {engine} = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const { reset } = require('nodemon');
const MySQLStore = require('express-mysql-session');
const {database} = require('./keys');
const passport = require('passport');


//inicializaciones
const app = express(); 
require('./lib/passport');

//setting
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(flash());
app.use(session({
    secret:'valenSession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database),

}));

app.use(passport.initialize());
app.use(passport.session());
//global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    next();
});

//routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));
//public

app.use(express.static(path.join(__dirname, 'public')));

//starting server
app.listen(app.get('port'),() => {
    console.log('Server on port', app.get('port'))});
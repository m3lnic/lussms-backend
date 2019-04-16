const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const db = require('./api/Database/database')
const soc_routes = require('./api/routes/soc_router');

// > Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // > Can swap * to a url to restrict access
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS')
    {
        res.header('Access-Control-Allow-Origin', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    // > Check database connection here

    next();
});

// > Routes to handle requests
app.use('/societies', soc_routes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
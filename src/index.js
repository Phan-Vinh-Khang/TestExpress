import express from 'express'
import { engine } from 'express-handlebars';
import cors from 'cors'
import * as path from 'path';
import ViewEngines from './config/ViewEngines' //EJS
import Reftocontroller from './Reftocontroller'
import Reftocontroller_Api from './reftocontroller/api';
import Reftocontroller_Store from './reftocontroller/apiStore';
import connection from './model/database'
import { connect_db, check_connect } from './model/database'
//env
require('dotenv').config()
//express
const app = express();
const port = parseInt(process.env.PORT);
//cors (đặt trước khi active rounter)
app.use(cors())
//HPPT logger
const morgan = require('morgan');
app.use(morgan('combined'));
//public
app.use(express.static(path.join('C:/Users/Admin/Desktop/TestExpress/public')))
{
    //view engines handlebars
    // app.engine('hbs', engine({ extname: '.hbs' })); //using view engine
    // app.set('view engine', 'handlebars'); //using
    // app.set('views', './src/views'); //file view project
}
//data client to controller
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//view engines EJS
ViewEngines(app)
Reftocontroller(app)
// Reftocontroller_Api(app)
Reftocontroller_Store(app)
app.use((ref, res) => {
    res.send('router not exist')
})

check_connect(connect_db)
app.listen(port);
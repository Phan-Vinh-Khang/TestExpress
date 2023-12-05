import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser, { urlencoded } from 'body-parser'
const compression = require('compression');
import * as path from 'path';
import Reftocontroller_Store from './reftocontroller/apiStore';
import connection from './model/database'
import { connect_db, check_connect } from './model/database'
//env
require('dotenv').config()
//express
const app = express();
app.use(urlencoded({ extended: true }))
app.use(compression());
const port = parseInt(process.env.PORT);
//cors (đặt trước khi active rounter)
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://shopreactjs.vercel.app',
        'https://shopreactjs-khangs-projects-d475e023.vercel.app/',
        'https://shopreactjs-p2ryhd0yo-khangs-projects-d475e023.vercel.app/'
        // your origins here
    ],
    credentials: true,//cho phép nhận cookie từ client
};
app.use(cors(corsOptions))
//cookieParser cookie from client
//sử dụng req.cookies để ref đến obj cookie từ req client (nếu k sử dụng phải req.headers.cookie và phải substr)
app.use(cookieParser())
//HPPT logger
const morgan = require('morgan');
app.use(morgan('combined'));
//public
app.use(express.static(path.join('./public')))
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
// Reftocontroller_Api(app)
Reftocontroller_Store(app)
app.use((ref, res) => {
    res.send('router not exist')
})
check_connect(connect_db)
app.listen(port);
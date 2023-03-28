import express from "express";
import w from '../controller/apiController'

var Router = express.Router();
function Reftocontroller_Api(app) {
    app.get('/api/users', w.JsON_Users)
    app.post('/api/create-user', w.Api_Create_User)
    app.put('/api/update-user', w.Api_Update_User)
    app.get('/api/delete-user/:Id', w.Api_Remove_User)



    //para 1 url,event;
    //para 2 controller
    return app.use('/', Router)
}
export default Reftocontroller_Api
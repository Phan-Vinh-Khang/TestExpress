import Express from 'Express'
import w from '../controller/homeController';
import w2 from '../controller/detailController'
import storeController from '../controller/storeController'
//sử dụng module.export obj khi import sẽ sử dụng var để ref vào obj 
var Rounter = Express.Router()
function Reftocontroller(app) {
    // Rounter.get('/', w.homeController); //ref to controller(controller homeController,func homeController)
    Rounter.get('/detail/:Id', w2.user);
    Rounter.post('/create-user', w.createUser);
    Rounter.get('/remove-user-get/:Id', w.removeUser_Get);
    Rounter.post('/remove-user-post', w.removeUser_Post);
    Rounter.post('/update-user-view-post', w.updateUserView_Post);
    Rounter.post('/update-user-post', w.updateUser_Post);
    Rounter.get('/update-user-view-get/:Id', w.updateUserView_Get);
    //web store
    Rounter.get('/', storeController.home)
    Rounter.post('/createUser-post', storeController.createUser)
    Rounter.get('/detail-user-store/:id', storeController.detailUserStore)
    Rounter.get('/update-view-store-get/:id', storeController.updateViewStoreGet)
    Rounter.post('/update-user-store', storeController.updateUserStore)
    Rounter.post('/update-user-store', storeController.updateUserStore)
    Rounter.post('/remove-user-store', storeController.removeUser)

    //var :Id sẽ ref vào url ung với vị trí dc đặt

    //para 1 url,event;
    //para 2 controller
    return app.use('/', Rounter)
}
export default Reftocontroller
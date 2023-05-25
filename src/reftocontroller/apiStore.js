import Express from 'Express'
import storeController from '../controller/storeController'
//sử dụng module.export obj khi import sẽ sử dụng var để ref vào obj 
var Rounter = Express.Router()
function Reftocontroller_Store(app) {
    Rounter.post('/check-user-login', storeController.checkUserLogin);
    Rounter.post('/create-user', storeController.createUser);
    Rounter.post('/create-product', storeController.createProduct)
    Rounter.put('/update-product/:id', storeController.updateProduct)

    return app.use('/api', Rounter)
}
export default Reftocontroller_Store
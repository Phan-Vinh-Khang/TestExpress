import Express from 'Express'
import storeController from '../controller/storeController'
import checkController from '../service/JwtService'
//sử dụng module.export obj khi import sẽ sử dụng var để ref vào obj 
var Rounter = Express.Router()
function Reftocontroller_Store(app) {
    Rounter.post('/check-user-login', storeController.checkUserLogin);
    Rounter.post('/create-user', storeController.createUser);
    Rounter.post('/create-product', checkController.checkToken, storeController.createProduct)
    Rounter.get('/all-product', storeController.allProduct)
    Rounter.get('/detail-product/:id', storeController.detailProduct)
    Rounter.put('/update-product/:id', storeController.updateProduct)
    Rounter.post('/create-role', storeController.createRole);

    //var id sẽ ref vào đúng thứ tự trên URL

    return app.use('/api', Rounter)
}
export default Reftocontroller_Store
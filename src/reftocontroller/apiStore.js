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
    Rounter.get('/detail-user/:id', storeController.detailUser)
    Rounter.post('/authentication-user', checkController.checkToken, storeController.authenticationUser)
    Rounter.get('/logout-user', storeController.logoutUser)
    Rounter.get('/all-type-product', storeController.allTypeProduct)
    Rounter.get('/all-user', storeController.allUser)
    Rounter.get('/all-role', storeController.allRole)

    Rounter.post('/create-user-admin', checkController.checkToken, storeController.createUserAdmin)

    Rounter.put('/update-product/:id', storeController.updateProduct)
    Rounter.post('/create-role', storeController.createRole);

    Rounter.get('/reFresh-token', storeController.reFreshtoken);

    //var id sẽ ref vào đúng thứ tự trên URL

    return app.use('/api', Rounter)
}
export default Reftocontroller_Store
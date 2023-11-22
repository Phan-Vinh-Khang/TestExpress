import express from 'express'
import storeController from '../controller/storeController'
import checkController from '../service/JwtService'
import multer from 'multer'
import path from 'path'
const storage = multer.diskStorage({
    //sau khi function diskStorage return về các data sẽ call 2 func này và truyen doi so vao
    //func diskStorage sẽ truyen 2 data và 1 datastatic func vào doi so
    destination: (req, file, callback) => { //varfunc callback sẽ ref vào doi so datastatic func và dev sẽ su dung varfunc callback de gọi den func mà funcdisk truyen vao
        callback(null, path.join(__dirname, '../../', 'public/avatar'))
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})
const storageImgProd = multer.diskStorage({
    //sau khi function diskStorage return về các data sẽ call 2 func này và truyen doi so vao
    //func diskStorage sẽ truyen 2 data và 1 datastatic func vào doi so
    destination: (req, file, callback) => { //varfunc callback sẽ ref vào doi so datastatic func và dev sẽ su dung varfunc callback de gọi den func mà funcdisk truyen vao
        callback(null, path.join(__dirname, '../../', 'public/img/products'))
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})
const uploadAvatar = multer({ storage: storage }).single('image') //set noi luu file
const uploadImgProd = multer({ storage: storageImgProd }).single('image') //set noi luu file

//sử dụng module.export obj khi import sẽ sử dụng var để ref vào obj 
var Rounter = express.Router()
function Reftocontroller_Store(app) {
    Rounter.post('/check-user-login', storeController.checkUserLogin);
    Rounter.post('/create-user', storeController.createUser);
    Rounter.post('/create-product', checkController.checkToken, storeController.createProduct)
    Rounter.get('/all-product/', storeController.allProduct)
    Rounter.get('/detail-product/:id', storeController.detailProduct)
    Rounter.get('/detail-user/:id', storeController.detailUser)
    Rounter.get('/authentication-user', checkController.checkToken, storeController.authenticationUser)
    Rounter.get('/logout-user', storeController.logoutUser)
    Rounter.get('/all-type-product', storeController.allTypeProduct)
    Rounter.get('/all-user', storeController.allUser)
    Rounter.get('/all-role', storeController.allRole)
    Rounter.post('/create-user-admin', checkController.checkToken, storeController.createUserAdmin,)
    Rounter.post('/uploadAvatar', async (req, res) => {
        await uploadAvatar(req, res, (e) => {
            if (e) console.log(e)
            res.status(200).json({
                status: 200,
                message: 'uploaded image: ' + req.file.originalname
            })
        });
    })
    Rounter.post('/uploadImgProd', (req, res) => {
        uploadImgProd(req, res, (e) => {
            if (e) console.log(e)
            res.status(200).json({
                status: 200,
                message: 'uploaded image: ' + req.file.originalname
            })
        });
    })
    Rounter.get('/delete-user/:id', checkController.checkToken, storeController.deleteUser)
    Rounter.post('/delete-user-many/', checkController.checkToken, storeController.deleteUserMany)
    Rounter.get('/delete-product/:id', checkController.checkToken, storeController.deleteProduct)
    Rounter.post('/delete-product-many/', checkController.checkToken, storeController.deleteProductMany)
    Rounter.put('/update-user/:id', checkController.checkToken, storeController.updateUser)
    Rounter.put('/update-product/:id', checkController.checkToken, storeController.updateProduct)
    Rounter.post('/create-role', storeController.createRole);
    Rounter.post('/create-user-shop/', checkController.checkToken, storeController.createUserShop);
    Rounter.get('/get-shop-by-product/:id', storeController.getShopByProduct);
    Rounter.get('/get-shop-by-id/:id', storeController.getShopById);
    Rounter.post('/checkout', checkController.checkToken, storeController.checkout);
    // Rounter.post('/checkout-cart', storeController.checkValidCart, storeController.checkout);

    Rounter.post('/addcart', checkController.checkToken, storeController.addcart);

    Rounter.get('/getcart', checkController.checkToken, storeController.getcart);

    Rounter.get('/reFresh-token', storeController.reFreshtoken);

    //var id sẽ ref vào đúng thứ tự trên URL

    return app.use('/api', Rounter)
}
export default Reftocontroller_Store
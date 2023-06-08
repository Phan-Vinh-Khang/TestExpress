import Cryptr from "cryptr";
import bcrypt from 'bcryptjs'
import db from "../models";
import Service from "../service/CRUDService";
import ServiceProd from "../service/CRUDProducts";
import ServiceRoles from "../service/CRUDRoles";
import JwtService from "../service/JwtService"
async function home(ref, res) {
    // var data = await db.Users.findAll();
    const data = await Service.getListUsers();
    res.render('home.ejs', { data: data });
}
async function createUser(ref, res) {
    res.status(200).json(await Service.createUser(ref.body))
}
async function createProduct(ref, res) {
    console.log(ref.cookies)
    res.status(200).json(await ServiceProd.createProduct(ref.body))
}
async function detailProduct(req, res) {
    res.status(200).json(await ServiceProd.detailProduct(req.params.id))
}
async function allProduct(req, res) {
    res.status(200).json(await ServiceProd.allProduct())
}
async function updateProduct(ref, res) {
    try {
        res.status(200).json(await ServiceProd.updateProduct(ref.body, ref.params.id))
    } catch (e) {
        res.status(404).json({ message: e })
    }
}
async function createRole(ref, res) {
    res.status(200).json(await ServiceRoles.createRole(ref.body));
}
async function checkUserLogin(ref, res) {
    const data = ref.body;
    res.status(200).json(await Service.checkUserLogin(data, res))
}
async function detailUser(req, res) {
    console.log('params', req.params)
    try {
        res.status(200).json(await Service.detailUser(req.params.id));
    } catch (e) {
        res.status(200).json({ message: 'ko tim thay id user' })
    }
}
async function reFreshtoken(req, res) {
    console.log('cookies: ', req.cookies, 'headers cookies:', req.headers.cookie)
    console.log(req.body)
    // let tokenCookie = req.headers.tokencookie;
    // let data = await JwtService.reFreshtoken(tokenCookie);//return obj with 2 token
    // // res.cookie(data.reFreshtoken)
    res.status(200).json({ mess: 'a' })
}
//
async function detailUserStore(ref, res) {
    const data = await Service.getUsers(ref.params.id)
    res.render('UserStore', { data: data });
}
async function updateViewStoreGet(ref, res) {
    const data = await Service.getUsers(ref.params.id)
    res.render('storeUpdateUserView', { data: data });

}
async function updateUserStore(ref, res) {
    const data = await Service.getUsers(ref.body.id)
    console.log('test', data)
    await Service.UpdateUser(data[0], ref.body)
    res.redirect('/');
}
async function removeUser(ref, res) {
    await Service.removeUserAction(ref.body.id)
    res.redirect('/');
}
module.exports = {
    home,
    createUser,
    detailUserStore,
    updateViewStoreGet,
    updateUserStore,
    removeUser,
    checkUserLogin,
    createProduct,
    detailProduct,
    allProduct,
    updateProduct,
    createRole,
    reFreshtoken,
    detailUser
}
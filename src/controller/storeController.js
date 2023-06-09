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
    try {
        res.status(200).json(await Service.detailUser(req.params.id));
    } catch (e) {
        res.status(404).json({ message: 'ko tim thay id user' })
    }
}
async function authenticationUser(req, res) {
    try {
        res.status(200).json(await Service.authenticationUser(req.body.id));
    } catch (e) {
        res.status(404).json({ message: 'ko tim thay id user' })
    }
}
async function logoutUser(req, res) {
    res.clearCookie('reAccessToken');
    res.status(200).json({
        status: 200,
        message: 'logout'
    });
}
async function reFreshtoken(req, res) {
    let objCookie = req.cookies;
    let data = await JwtService.reFreshtoken(objCookie.reAccessToken);//return obj with 2 token
    if (data.status == 200) {
        res.cookie("reAccessToken", data.refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        })
        res.status(200).json(data.access_token)
    }
    else res.status(200).json(data)
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
    detailUser,
    authenticationUser,
    logoutUser
}
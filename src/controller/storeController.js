import Cryptr from "cryptr";
import bcrypt from 'bcryptjs'
import db from "../models";
import Service from "../service/CRUDService";
import ServiceProd from "../service/CRUDProducts";
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
async function updateProduct(ref, res) {
    res.status(200).json(await ServiceProd.updateProduct(ref.body, ref.params.id))

}
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
async function checkUserLogin(ref, res) {
    const data = ref.body;
    res.status(200).json(await Service.checkUserLogin(data))
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
    updateProduct
}
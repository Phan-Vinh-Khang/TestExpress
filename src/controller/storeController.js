import Cryptr from "cryptr";
import bcrypt from 'bcryptjs'
import db from "../models";
import Service from "../service/CRUDService";
async function home(ref, res) {
    // var data = await db.Users.findAll();
    const data = await Service.getListUsers();
    res.render('home.ejs', { data: data });
}
async function createUser(ref, res) {
    Service.createUser(ref.body)
    res.redirect('/');

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
    if (data.email == undefined || data.password == undefined) {
        res.status(200).json({
            errCode: 1,
            message: "cần nhập tài khoản hoặc mật khẩu"
        })
    }
    else {
        let ListUsers = await Service.getListUsers()
        const user = await db.Users.findAll({
            where: {
                email: data.email
            }
        })
        if (user[0] != null) {
            let check = bcrypt.compareSync(data.password, user[0].password);
            if (check) {
                res.status(200).json({
                    errCode: 0,
                    user: user
                })
            }
            else {
                res.status(200).json({
                    errCode: 3,
                    message: 'password not correct'
                })
            }
        }
        else {
            res.status(200).json({
                errCode: 2,
                message: "Tên tài khoản không tồn tại"
            })
        }

    }
}
module.exports = {
    home,
    createUser,
    detailUserStore,
    updateViewStoreGet,
    updateUserStore,
    removeUser,
    checkUserLogin
}
import bcrypt from 'bcryptjs';
import fs from "node:fs/promises";
import path from "node:path";
import db from '../models';
const { Op } = require("sequelize");
import { generalAccessToken, generalReAccessToken } from './JwtService'
const salt = bcrypt.genSaltSync(10);
const avatarDirectory = path.join(__dirname, '../../public/avatar/')
async function createUser(objData) {
    return new Promise(async (resolve, reject) => {
        //check user da ton tai trong database
        if (objData.name != '' && objData.email != '' && objData.password != '' && objData.confirmPassword != '') {
            const checkAvailableUser = await db.Users.findAll({
                where: {
                    email: objData.email
                }
            })
            if (checkAvailableUser == '') {
                if (objData.password == objData.confirmPassword) {
                    db.Users.create({
                        name: objData.name,
                        email: objData.email,
                        password: await hashPassword(objData.password),
                        avatar: '',
                        adress: objData.address + ' ' + objData.city,
                        roleid: 3
                    })
                    return resolve({
                        errCode: 0,
                        name: objData.name,
                        email: objData.email,
                        address: objData.address,
                        message: 'User created'
                    })
                }
                else {
                    return reject({
                        errCode: 3,
                        message: 'confirm password not correct'
                    })
                }
            }
            else {
                return reject({
                    errCode: 2,
                    message: 'Email already exist'
                })
            }
        }
        else {
            return reject({
                errCode: 1,
                message: 'Cần fill thông tin'
            })
        }

    })
}
async function hashPassword(password) {
    const hash = await bcrypt.hashSync(password, salt)
    return hash
    // return new Promise(async (resolve, reject) => {
    //     try {
    //         resolve(await bcrypt.hashSync(password, salt))
    //     } catch (error) {
    //         reject(error)
    //     }
    // })
}
async function createUserAdmin(objData, { roleid }) {
    return new Promise(async (resolve, reject) => {
        //check user da ton tai trong database
        if (objData.name != '' && objData.email != '' && objData.password != '' && objData.confirmPassword != '') {
            const checkAvailableUser = await db.Users.findAll({
                where: {
                    email: objData.email
                }
            })
            if (checkAvailableUser == '') {
                if (objData.password == objData.confirmPassword) {
                    if (roleid <= objData.roleid) {
                        let user = await db.Users.create({
                            name: objData.name,
                            email: objData.email,
                            password: await hashPassword(objData.password),
                            avatar: objData.imgName,
                            adress: objData.address + ' ' + objData.city,
                            roleid: objData.roleid
                        })
                        return resolve({
                            status: 200,
                            name: objData.name,
                            email: objData.email,
                            address: objData.address,
                            avatar: objData.imgName,
                            message: 'User created'
                        })
                    }
                    else if (objData.roleid == -1 || objData.roleid == '') {
                        return reject({
                            staus: 404,
                            message: 'invalid role'
                        })
                    }
                    else {
                        return reject({
                            staus: 403,
                            message: 'unthorization,chỉ có thể đăng ký tài khoản với quyền thấp hơn tài khoản hiện tại'
                        })
                    }
                }
                else {
                    return reject({
                        staus: 404,
                        message: 'confirm password not correct'
                    })
                }
            }
            else {
                return reject({
                    staus: 404,
                    message: 'Email already exist'
                })
            }
        }
        else {
            return reject({
                staus: 404,
                message: 'Cần fill thông tin'
            })
        }
    })
}
async function getUsers(idUser) {
    return await db.Users.findAll({
        where: {
            id: idUser
        }
    });
    //return arr và arr[0] sẽ là obj table với các properties và func của obj table đó
    //nếu có raw sẽ chỉ return về data obj table, sẽ ko có các func của table trong obj đó nên sẽ ko sủ dụng func save() và các func khác dc
}
function preHandleUpdateData(data) {
    if (data.iscollab.toLowerCase() == 'có')
        data.iscollab = 1
    else if (data.iscollab.toLowerCase() == 'không')
        data.iscollab = 0
}
async function updateUser(id, data) {
    const listRole = await db.Roles.findAll();
    let role = listRole.find((item) => {
        return item.name == data.roleid
    })
    if (!role) {
        role = {}
        role.id = -1;
    }
    data.roleid = role.id;
    preHandleUpdateData(data)
    return new Promise(async (resolve, reject) => {
        let user = await db.Users.findOne({
            where: {
                id: id
            }
        })
        let checkDataEmailExist = await db.Users.findOne({
            where: {
                email: data.email,
                id: {
                    [Op.ne]: id
                }
            }
        })
        if (!user) { //neu vao dc day la admin,gan nhu se k can check user tru khi admin ko dung req o web client
            return reject({
                status: 422,
                message: 'khong tim thay user'

            })
        }
        let checkroleid = await db.Roles.findOne({
            where: {
                id: data.roleid
            }
        })
        if (!checkroleid) { //neu vao dc day la admin,gan nhu se k can check user tru khi admin ko dung req o web client
            return reject({//su dung return neu ko van se tiep tuc chay
                status: 422,
                message: 'khong tim thay roleid'

            })
        }
        if (data.iscollab != 0 && data.iscollab != 1) {
            return reject({
                status: 422,
                message: 'iscollab khong hop le'

            })
        }
        if (!checkDataEmailExist) {
            user.name = data.name
            if (data.imgName) {
                if (user.avatar) {
                    fs.unlink(path.join(avatarDirectory, user.avatar));
                }
                user.avatar = data.imgName
            }
            user.adress = data.adress
            user.roleid = data.roleid
            user.iscollab = data.iscollab
            await user.save();
            resolve({
                status: 200,
                message: 'update ok'
            })
        }
        else {
            reject({
                status: 409,
                message: 'email đã tồn tại'
            })
        }
    })
}
async function deleteUser(id) {
    return new Promise(async (resolve, reject) => {
        const user = await db.Users.findOne({
            where: {
                id: id
            }
        })
        const isDeleted = await db.Users.destroy({
            where: {
                id: id
            }
        })
        if (isDeleted) {
            if (user.avatar != '') {
                fs.unlink(path.join(avatarDirectory, user.avatar));
            }
            resolve({
                status: 200,
                message: 'delete successfully'
            })
        }
        else {
            reject({
                status: '',
                message: 'khong tim thay iduser'
            })
        }
    })
}
async function deleteUserMany(listId) {
    return new Promise(async (resolve, reject) => {
        const data = await db.Users.findAll({
            where: {
                id: listId //ref vào dc arr,ko can su dung map()
            },
            attributes: ['avatar']
        })
        if (data.length != listId.length) {
            return reject({
                status: '',
                message: 'id user dc chon khong ton tai'
            })
        }
        await db.Users.destroy({
            where: {
                id: listId //ref vào dc arr,ko can su dung map()
            }
        })
        data.map(({ avatar }) => {
            if (avatar)
                fs.unlink(path.join(avatarDirectory, avatar));
        })
        resolve({
            status: 200,
            message: 'delete successfully ' + listId.length + ' users'
        })

    })
}
async function removeUserAction(data) {
    await db.Users.destroy({
        where: {
            id: data
        },
        force: true
    })
}
async function checkUserLogin(data, res) {
    return new Promise(async (resolve, reject) => {
        if (!data.email || !data.password) {
            return reject({
                status: 409,
                message: "Cần nhập tài khoản hoặc mật khẩu"
            })
        }
        else {
            const user = await db.Users.findAll({
                where: {
                    email: data.email
                }
            })
            if (user[0]) {
                let check = bcrypt.compareSync(data.password, user[0].password);
                if (check) {
                    const { id, password, roleid, createdAt, updatedAt, ...user2 } = user[0].dataValues
                    const refresh_token = await generalReAccessToken({ id, roleid })
                    const date = new Date();
                    date.setFullYear(new Date().getFullYear() + 1)
                    res.cookie("reAccessToken", refresh_token, {
                        httpOnly: true,
                        secure: false,
                        path: '/',
                        sameSite: "strict",
                        expires: date,
                    })
                    return resolve({
                        status: 200,
                        access_token: await generalAccessToken({ id, roleid }),
                    })
                }
                else {
                    return reject({
                        status: 409,
                        message: 'Password not correct'
                    })
                }
            }
            else {
                return reject({
                    status: 409,
                    message: "Tên tài khoản không tồn tại"
                })
            }
        }
    })
}
async function detailUser(userId) {
    return new Promise(async (resolve, reject) => {
        const user = await db.Users.findOne({
            where: {
                id: userId
            }
        })
        if (user) {
            const { id, password, roleid, createdAt, updatedAt, ...user2 } = user.dataValues;
            resolve(user2)
        }
        else reject()
    })
}
async function allUser() {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.Users.findAll({
                attributes: { exclude: ['password',] },
                include: {
                    model: db.Roles,
                    as: 'role'
                }
            })
            user.map((item) => {
                item.iscollab == true ? item.iscollab = 'Có' : item.iscollab = 'Không'
                item.roleid = item.role.name;
                delete item.dataValues.role;//delete propertie role truoc khi response ve client
            })
            resolve({
                status: 200,
                listUser: user
            })
        }
        catch (e) {
            reject({
                status: 500,
                message: 'Internal Server Error'
            })
        }
    });
}
async function allRole() {
    return new Promise(async (resolve, reject) => {
        try {
            const role = await db.Roles.findAll()
            resolve({
                status: 200,
                listRole: role
            })
        } catch (e) {
            reject({
                status: 500,
                message: 'Internal Server Error'
            })
        }
    });
}
async function authenticationUser(userId) {
    return new Promise(async (resolve, reject) => {
        const user = await db.Users.findOne({
            where: {
                id: userId
            }
        })
        if (user) {
            const { id, password, roleid, createdAt, updatedAt, ...user2 } = user.dataValues;
            resolve({
                status: 200,
                user: user2
            })
        }
        else reject({
            status: '409',
            message: 'khong tim thay user'
        })
    })
}
module.exports = {
    createUser,
    getUsers,
    removeUserAction,
    checkUserLogin,
    detailUser,
    authenticationUser,
    allUser,
    createUserAdmin,
    allRole,
    updateUser,
    deleteUser,
    deleteUserMany
}
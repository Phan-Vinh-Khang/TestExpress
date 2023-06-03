import bcrypt from 'bcryptjs'
import db from '../models';
import { generalAccessToken, generalReAccessToken } from './JwtService'
const salt = bcrypt.genSaltSync(10);
async function createUser(objData) {
    return new Promise(async (aaa, reject) => {
        try {
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
                            roleid: 1
                        })
                        aaa({
                            errCode: 0,
                            name: objData.name,
                            email: objData.email,
                            address: objData.address,
                            message: 'User created'
                        })
                    }
                    else {
                        aaa({
                            errCode: 3,
                            message: 'confirm password not correct'
                        })
                    }
                }
                else {
                    aaa({
                        errCode: 2,
                        message: 'Email already exist'
                    })
                }
            }
            else {
                aaa({
                    errCode: 1,
                    message: 'Cần fill thông tin'
                })
            }
        }
        catch (e) {
            reject(e)
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
async function getListUsers() {
    return await db.Users.findAll();
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
async function UpdateUser(user, data) {
    console.log(user)
    user.name = data.name
    user.email = data.email
    user.adress = data.address
    await user.save();
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
    if (data.email == '' || !data.password) {
        return {
            errCode: 1,
            message: "Cần nhập tài khoản hoặc mật khẩu"
        }
    }
    else {
        const user = await db.Users.findAll({
            where: {
                email: data.email
            }
        })
        if (user[0] != null) {
            let check = bcrypt.compareSync(data.password, user[0].password);
            if (check) {
                const token = await generalReAccessToken(user)
                res.cookie("reAccessToken", token, {
                    httpOnly: true,
                    path: '/',
                    sameSite: 'strict'
                })
                return {
                    errCode: 0,
                    user: user,
                    access_token: await generalAccessToken(user),
                }
            }
            else {
                return {
                    errCode: 3,
                    message: 'Password not correct'
                }
            }
        }
        else {
            return {
                errCode: 2,
                message: "Tên tài khoản không tồn tại"
            }
        }
    }
}
module.exports = {
    createUser,
    getListUsers,
    getUsers,
    UpdateUser,
    removeUserAction,
    checkUserLogin
}
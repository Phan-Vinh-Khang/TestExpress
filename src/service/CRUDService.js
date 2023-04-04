import bcrypt from 'bcryptjs'
import db from '../models';
const salt = bcrypt.genSaltSync(10);
async function createUser(objData) {
    // console.log(await hashPassword(objData.password))
    db.Users.create({
        name: objData.name,
        email: objData.email,
        password: await hashPassword(objData.password),
        avatar: '',
        adress: objData.address + ' ' + objData.city
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
module.exports = {
    createUser,
    getListUsers,
    getUsers,
    UpdateUser,
    removeUserAction
}
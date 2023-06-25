import db from '../models';
async function createRole(data) {
    return new Promise(async (resolve, reject) => {
        let check = await db.Roles.findOne({
            where: {
                name: data.name
            }
        })
        if (check) {
            return reject({
                status: '',
                message: 'roleid da ton tai'
            })
        }
        let role = await db.Roles.create({
            name: data.name
        })
        resolve({
            errCode: 0,
            message: 'ok',
            role
        })
    })
}
module.exports = {
    createRole,
}
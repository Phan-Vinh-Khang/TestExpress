import db from '../models';
async function createRole(data) {
    console.log(data)
    return new Promise(async (resolve, reject) => {
        try {
            let role = await db.Roles.create({
                name: data.name
            })
            resolve({
                errCode: 0,
                message: 'ok',
                role
            })
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createRole,
}
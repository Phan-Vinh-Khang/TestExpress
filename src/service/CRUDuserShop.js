import db from '../models';
import { name_regexVI } from '../utilities/regex'
async function createUserShop(data, access_token) {
    const dotCount = (data.name.match(/\./g) || []).length;
    if (!name_regexVI(data.name) || dotCount > 3) {
        throw {
            sttus: 422,
            messsage: 'ten shop khong hop le'
        }
    }
    await db.userShops.create({
        name: data.name,
        deliveryaddress: data.deliveryAddress,
        createdbyuserid: access_token.id
    })
    let user = await db.Users.findByPk(access_token.id);
    user.iscollab = 1;
    user.save();
    return {
        status: 200,
        messsage: 'created usershop'
    }
}
async function getShopByProduct(id) {
    try {
        let { detailShop } = await db.Products.findByPk(id, {
            include: {
                model: db.userShops,
                as: 'detailShop'
            }
        })
        return {
            status: 200,
            message: '',
            userShop: detailShop
        }
    } catch (e) {
        throw {
            status: 422,
            message: ''
        }
    }

}
async function getShopById() {

}
module.exports = {
    createUserShop,
    getShopByProduct,
    getShopById
}
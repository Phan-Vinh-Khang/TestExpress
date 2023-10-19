import { access } from 'fs';
import db from '../models';
async function checkout(data, access_token) {
    const order = await db.Orders.create({
        orderByUserId: access_token.id,
        deliveryDate: data.deliveryDate,
        message: data.message,
        status: false,
    })
    data.listproduct.map(async (item) => {
        const product = await db.Products.findByPk(item.idProduct);
        await db.detailOrders.create({
            idOrder: order.id,
            idProduct: item.idProduct,
            quantity: item.quantity,
            price: product.price,
            discount: product.discount
        })
    })
    await db.Carts.destroy({
        where: {
            id: access_token.id,
            idProduct: data.listproduct
        }
    })
    return {
        status: 200,
        message: 'order'
    }
}
async function checkValidCart(listproduct, access_token) {
    const isValid = await db.Carts.findAll({
        where: {
            id: access_token.id,
            idProduct: listproduct
        }
    })
    if (isValid.length != listproduct.length)
        throw {
            status: 422,
            message: 'id products ko ton tai trong gio hang'
        }
}
module.exports = {
    checkout,
    checkValidCart
}
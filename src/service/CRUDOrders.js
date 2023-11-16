import { access } from 'fs';
import db from '../models';
async function checkout(data, access_token) {
    // console.log(data[0].listproduct)
    const order = await db.Orders.create({
        orderByUserId: access_token.id,
        deliveryDate: '',
        message: '',
        status: false,
    })
    for (let i = 0; i < data.length; i++) {
        data[i].listproduct.map(async (item) => {
            const product = await db.Products.findByPk(item.id);
            if (!product) {
                throw {
                    status: 422,
                    message: `1 vai sản phẩm ko co san`
                }
            }
            else if (product.quantity != 0) {
                if (product.quantity < item.selectQuantity)
                    throw {
                        status: 422,
                        message: 'co 1 vài sản pham ko du so luong'
                    }
                if (item.selectQuantity == 0) {
                    throw {
                        status: 422,
                        message: 'so luong dat mua phai lon hon 0'
                    }
                }
            }
            else {
                throw {
                    status: 422,
                    message: 'san pham da het hang'
                }
            }
        })
    }
    for (let i = 0; i < data.length; i++) {
        data[i].listproduct.map(async (item) => {
            const product = await db.Products.findByPk(item.id);
            product.quantity -= item.selectQuantity
            product.save();
            await db.detailOrders.create({
                idOrder: order.id,
                idProduct: product.id,
                quantity: item.selectQuantity,
                price: product.price,
                discount: product.discount
                //su dung data o table product,neu su dung data dc gui den data co the bi thay doi
            })
        })
    }
    data.map(async (item) => {
        item.listproduct.map(async (item2) => {
            await db.Carts.destroy({
                where: {
                    id: access_token.id,
                    idProduct: item2.id
                }
            })
        })
    })
    return {
        status: 200,
        message: 'order'
    }
}
async function addcart(data, id) {
    let productIsExist = await db.Products.findByPk(data.id)
    if (!productIsExist) {
        throw {
            status: 422,
            message: 'san pham ko ton tai'
        }
    }
    if (productIsExist.quantity != 0) {
        if (productIsExist.quantity < data.selectQuantity) {
            throw {
                status: 422,
                message: 'so luong dat hang lon hon so luong san pham hien tai'
            }
        }
        if (data.selectQuantity < 1) {
            throw {
                status: 422,
                message: 'so luong phai lon hon 0'
            }
        }
    }
    else {
        throw {
            status: 422,
            message: 'san pham da het hang'
        }
    }
    let dataIsExist = await db.Carts.findOne({
        where: {
            idUser: id,
            idProduct: data.id
        }
    })
    if (!dataIsExist) {
        await db.Carts.create({
            idUser: id,
            idProduct: data.id,
            quantity: data.selectQuantity
        })
    }
    else {
        dataIsExist.quantity += data.selectQuantity
        if (dataIsExist.quantity > productIsExist.quantity) {
            dataIsExist.quantity = productIsExist.quantity
            throw {
                status: 422,
                message: 'số lượng sản phẩm đã đặt hàng đã hiện tại đã vượt quá số lượng hàng hiện có,sang giỏ hàng để xem chi tiet'
            }
        }

        dataIsExist.save();
        return {
            status: 200,
            message: 'update cart'
        }
    }
    return {
        status: 200,
        message: 'addcart'
    }
}
async function checkAvailable(productdb, productOrder) {

}
async function getcart(id) {
    let listCart = await db.Carts.findAll({
        where: {
            idUser: id
        },
        attributes: ['id', 'quantity'],
        include: [{
            model: db.Products,
            require: false,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: {
                model: db.userShops,
                as: 'detailShop',
                attributes: ['id', 'name']
            }
        }]
    });
    let message = ''
    console.log(listCart.length)
    // const validCartItems = listCart.filter(cartItem => cartItem.Product !== null);
    // if (listCart.length != validCartItems.length)
    // message += 'co 1 vai san pham ko con ton tai '
    // validCartItems.forEach((item, i) => {
    //     if (item.Product.quantity == 0) {
    //         item.Product.dataValues.available = false;
    //         item.Product.dataValues.cartQuantity = 0;
    //     }
    //     else if (item.Product.quantity < item.quantity) {
    //         item.Product.dataValues.cartQuantity = item.Product.quantity
    //         item.Product.dataValues.available = true;
    //         message = 'so luong 1 vai san pham ko du'
    //     }
    //     else {
    //         // console.log(item.Product)
    //         item.Product.dataValues.cartQuantity = item.quantity
    //         item.Product.dataValues.available = true;
    //     }
    // })
    listCart = listCart.filter((item, i) => {
        if (item.Product == null) {
            return false;
        } else {
            if (item.Product.quantity == 0) {
                item.Product.dataValues.available = false;
                item.Product.dataValues.cartQuantity = 0;
            }
            else if (item.Product.quantity < item.quantity) {
                item.Product.dataValues.cartQuantity = item.Product.quantity
                item.Product.dataValues.available = true;
                message = 'so luong 1 vai san pham ko du'
            }
            else {
                item.Product.dataValues.cartQuantity = item.quantity
                item.Product.dataValues.available = true;
            }
            return true;
        }
    });
    console.log(listCart.length)

    let result = listCart.reduce((acc, curr) => {
        // curr.Product.cartQuantity = curr.quantity
        let shopIndex = acc.findIndex(item => item.shop.id === curr.Product.usershopid);
        // console.log(curr.quantity)
        if (shopIndex !== -1) {
            acc[shopIndex].listproduct.push(curr.Product);
        } else {
            acc.push({
                listproduct: [curr.Product],
                shop: curr.Product.detailShop
            });
        }
        return acc;
    }, []);
    return {
        status: 200,
        listCart: result,
        message: message
    }
}
// async function checkValidCart(listproduct, access_token) {
//     const isValid = await db.Carts.findAll({
//         where: {
//             id: access_token.id,
//             idProduct: listproduct
//         }
//     })
//     if (isValid.length != listproduct.length)
//         throw {
//             status: 422,
//             message: 'id products ko ton tai trong gio hang'
//         }
// }
module.exports = {
    checkout,
    addcart,
    getcart
    // checkValidCart,
}
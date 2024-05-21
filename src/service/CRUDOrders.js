import db from '../models';
async function checkout(data, access_token) {
    console.log(data[0].listproduct)
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < data.length; i++) {
            data[i].listproduct.map(async (item) => {
                const product = await db.Products.findByPk(item.id);
                if (!product) {
                    return reject({
                        status: 422,
                        message: `sản phẩm ko tồn tại`
                        //tranh truong hop xoa san pham vai s truoc khi user mua
                        //hoặc su dung client tự gửi data với 1 sản phẩm ko tồn tại
                        //có thể su dung isDetele để xem id là 1 sản phẩm ko tồn tại hay dc người bán xóa
                    })
                }
                if (product.isdelete) {
                    return reject({
                        status: 422,
                        message: 'người bán đã xóa sản phẩm'
                    })
                }
                if (product.price != item.price) {
                    return reject({
                        status: 422,
                        message: 'giá sản phẩm ko đúng hoặc đã dc thay đổi'
                        //tranh truong hop xoa san pham vai s truoc khi user mua
                        //hoặc client từ điền thong tin từ các app req API(postman) và thay đổi 1 vài data và gửi(thay đổi price thành 1)
                    })
                }
                if (product.discount != item.discount) {
                    return reject({
                        status: 422,
                        message: 'giảm giá sản phẩm ko đúng hoặc đã dc thay đổi'
                    })
                }

                if (product.quantity != 0) {
                    if (product.quantity < item.selectQuantity)
                        return reject({
                            status: 422,
                            message: 'vượt số lượng hiện có của sản phẩm'
                        })
                    if (item.selectQuantity <= 0) {
                        return reject({
                            status: 422,
                            message: 'số lượng phải lớn hơn 0'
                        })
                    }
                }
                if (product.quantity == 0) {
                    return reject({
                        status: 422,
                        message: 'sản phẩm tạm thời hết hàng'
                    })
                }
            })
        }
        const order = await db.Orders.create({
            orderByUserId: access_token.id,
            deliveryDate: '',
            message: '',
            status: false,
        })
        for (let i = 0; i < data.length; i++) {
            data[i].listproduct.map(async (item) => {
                const product = await db.Products.findByPk(item.id);
                await db.detailOrders.create({
                    idOrder: order.id,
                    idProduct: product.id,
                    quantity: item.selectQuantity,
                    price: product.price,
                    discount: product.discount
                    //den dc đoạn này đã bảo đảm dữ liệu dc gửi từ client là đúng
                })
                await db.Carts.destroy({
                    where: {
                        idUser: access_token.id,
                        idProduct: product.id
                    }
                })
                product.quantity -= item.selectQuantity
                product.sold += item.selectQuantity
                product.save();
            })
        }
        resolve({
            status: 200,
            message: 'đặt hàng thành công'
        })
    })
    // for (let i = 0; i < data.length; i++) {
    //     for (let z = 0; z < data[i].length; z++) {
    //         console.log('product1', data[i].listproduct[z].selectQuantity)
    //         const product = await db.Products.findByPk(data[i].listproduct[z].id);
    //         if (!product) {
    //             throw {
    //                 status: 422,
    //                 message: `1 vai sản phẩm ko co san`
    //             }
    //         }
    //         if (product) {
    //             if (product.price != data[i].listproduct[z].price) {
    //                 throw {
    //                     status: 422,
    //                     message: 'gia san pham da thay doi'
    //                 }
    //             }
    //             else if (product.discount != data[i].listproduct[z].discount) {
    //                 throw {
    //                     status: 422,
    //                     message: 'giam gia san pham da thay doi'
    //                 }
    //             }
    //         }
    //         if (product.quantity != 0) {
    //             if (product.quantity < data[i].listproduct[z].selectQuantity)
    //                 throw {
    //                     status: 422,
    //                     message: 'co 1 vài sản pham ko du so luong'
    //                 }
    //             if (data[i].listproduct[z].selectQuantity <= 0) {
    //                 throw {
    //                     status: 422,
    //                     message: 'so luong dat mua phai lon hon 0'
    //                 }
    //             }
    //         }
    //         if (product.quantity == 0) {
    //             console.log('product2', data[i].listproduct[z].selectQuantity)
    //             throw {
    //                 status: 422,
    //                 message: 'san pham da het hang'
    //             }
    //         }
    //     }
    // }
    // const order = await db.Orders.create({
    //     orderByUserId: access_token.id,
    //     deliveryDate: '',
    //     message: '',
    //     status: false,
    // })
    // for (let i = 0; i < data.length; i++) {
    //     data[i].listproduct.map(async (item) => {
    //         const product = await db.Products.findByPk(item.id);
    //         await db.detailOrders.create({
    //             idOrder: order.id,
    //             idProduct: product.id,
    //             quantity: item.selectQuantity,
    //             price: product.price,
    //             discount: product.discount
    //             //su dung data o table product,neu su dung data dc gui den data co the bi thay doi
    //         })
    //         await db.Carts.destroy({
    //             where: {
    //                 idUser: access_token.id,
    //                 idProduct: product.id
    //             }
    //         })
    //         product.quantity -= item.selectQuantity
    //         product.save();
    //     })
    // }
    // return {
    //     status: 200,
    //     message: 'order'
    // }
}
async function addcart(data, id) {
    let productIsExist = await db.Products.findByPk(data.id)
    if (!productIsExist) {
        throw {
            status: 422,
            message: 'sản phẩm ko tồn tại'
        }
    }
    if (productIsExist.quantity != 0) {
        if (productIsExist.quantity < data.selectQuantity) {
            throw {
                status: 422,
                message: 'vượt số lượng hiện có của sản phẩm'
            }
        }
        if (data.selectQuantity < 1) {
            throw {
                status: 422,
                message: 'số lượng phải lớn hơn 0'
            }
        }
    }
    else {
        throw {
            status: 422,
            message: 'sản phẩm tạm thời hết hàng'
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
        dataIsExist.save();
        return {
            status: 200,
            message: 'đã cập nhật số lượng trong giỏ'
        }
    }
    return {
        status: 200,
        message: 'đã thêm sản phẩm vào giỏ'
    }
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
    listCart = listCart.filter((item) => {
        if (item.Product == null) {
            message += 'co 1 vai san pham ko ton tai'
            db.Carts.destroy({
                where: {
                    id: item.id
                }
            })
            return false;
        } else {
            if (item.Product.quantity == 0) {
                item.Product.dataValues.available = false;
                item.Product.dataValues.cartQuantity = 0;
            }
            else if (item.Product.quantity < item.quantity) {
                item.Product.dataValues.cartQuantity = item.Product.quantity
                item.Product.dataValues.available = true;
                message += 'so luong 1 vai san pham ko du'
            }
            else {
                item.Product.dataValues.cartQuantity = item.quantity
                item.Product.dataValues.available = true;
            }
            return true;
        }
    });
    let result = listCart.reduce((acc, curr) => {
        let shopIndex = acc.findIndex(item => item.shop.id === curr.Product.usershopid);
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
    message += 'get products in cart'
    return {
        status: 200,
        listCart: result,
        message: message
    }
}
async function getorder(id) {
    return new Promise(async (resolve, reject) => {
        const listorder = await db.Orders.findAll({
            where: {
                orderByUserId: id
            },
            order: [['id', 'ASC']]
        })
        const arrlistorder = listorder.map((item) => { return item.id })
        let detailOrder = await db.detailOrders.findAll({
            where: {
                idOrder: arrlistorder
            },
            include: {
                model: db.Products,
                include: {
                    model: db.userShops,
                    as: 'detailShop'
                }
            }
        })
        let result = detailOrder.reduce((acc, cur) => {
            let order = acc.find((o) => o.idOrder === cur.dataValues.idOrder);
            if (!order) {
                order = { idOrder: cur.dataValues.idOrder, totalPrice: 0, listDetailOrder: [] };
                acc.push(order);
            }

            let shop = order.listDetailOrder.find(
                (s) => s.shopName.name === cur.dataValues.Product.dataValues.detailShop.dataValues.name
            );
            if (!shop) {
                shop = {
                    shopName: cur.dataValues.Product.dataValues.detailShop.dataValues,
                    listProduct: [],
                    totalPriceShop: 0,
                };
                order.listDetailOrder.push(shop);
            }

            shop.listProduct.push(cur.dataValues);
            let productTotalPrice = cur.dataValues.price * cur.dataValues.quantity;
            shop.totalPriceShop += productTotalPrice;
            order.totalPrice += productTotalPrice;

            return acc;
        }, []);
        resolve({
            status: 200,
            message: 'order',
            data: result
        })
    })
}
async function deleteCart(listId, userId) {
    return new Promise(async (resolve, reject) => {
        let isDelete = await db.Carts.destroy({
            where: {
                idProduct: listId,
                idUser: userId
            }
        })
        if (isDelete == 0)
            return reject({ status: 422, message: 'không tìm thấy id' })
        resolve({
            status: 200,
            message: 'xóa sản phẩm trong giỏ hàng thành công'
        })
    })
}
module.exports = {
    checkout,
    addcart,
    getcart,
    getorder,
    deleteCart
}
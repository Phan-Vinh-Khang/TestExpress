import db from '../models';
async function createProduct(data) {
    let product = await db.Products.create({
        name: data.name,
        price: data.price,
        des: data.des,
        image: data.image,
        quantity: data.quantity,
        typeprodid: data.typeprodid
    })
    return {
        errCode: 0,
        product,
        message: 'ok'
    }
}
async function updateProduct(data, id) {
    // product.name = data.name;
    // product.price = data.price;
    // product.discount = data.discount
    // product.img = data.img;
    // product.des = data.des;
    // product.quantity = data.quantity
    // product.typeprodid = data.typeprodid;
    // await product.save();
    const w = await db.Products.findAll();
    return {
        errCode: 0,
        w,
        message: 'ok'
    }
}
async function getProduct(id) { //var id product
    return await db.Products.findAll({
        where: {
            id: id
        }
    })
}
module.exports = {
    createProduct,
    updateProduct,
    getProduct,
}
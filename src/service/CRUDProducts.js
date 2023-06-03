import db from '../models';
async function createProduct(data) {
    console.log('data prod: ', data)
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
    return new Promise(async (resolve, reject) => {
        try {
            let product = await db.Products.findOne({
                where: {
                    id: id
                }
            })
            product.name = data.name
            product.price = data.price
            product.discount = data.discount
            product.des = data.des
            product.image = data.image
            product.quantity = data.quantity
            product.typeprodid = data.typeprodid
            product.save();
            resolve( //tuong tu return (co the su dung nhieu lan nhu return)
                {
                    errCode: '0',
                    message: 'product updated',
                    product
                }
            )
        } catch (e) {
            reject(e) //neu try bi lỗi có đâu đó sẽ chạy ở đây
        }
    });
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
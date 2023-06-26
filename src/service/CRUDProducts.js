import db from '../models';
async function createProduct(data) {
    let product = await db.Products.create({
        name: data.name,
        price: data.price,
        discount: data.discount,
        des: data.des,
        image: data.image,
        quantity: data.quantity,
        typeprodid: data.typeprodid
    })
    return {
        status: 200,
        product,
        message: 'ok'
    }
}
async function detailProduct(idProd) {
    const prod = await db.Products.findOne({
        where: {
            id: idProd
        }
    })
    console.log(prod.dataValues)
    return prod;
}
async function allProduct() {
    return new Promise(async (resolve, reject) => {
        let listProduct = await db.Products.findAll();
        resolve(listProduct)
    })
}
async function updateProduct(data, id) {
    return new Promise(async (resolve, reject) => {
        let product = await db.Products.findOne({
            where: {
                id: id
            }
        })
        if (!product) {
            return reject({
                status: '',
                message: 'khong tim thay san pham'
            })
        }
        product.name = data.name
        product.price = data.price
        product.discount = data.discount
        product.des = data.des
        product.image = data.image
        product.quantity = data.quantity
        product.typeprodid = data.typeprodid
        product.save();
        resolve(
            {
                status: 200,
                message: 'product updated',
                product
            }
        )

    });
}
async function allTypeProduct() {
    return new Promise(async (resolve, reject) => {
        const dataTypeProd = db.TypeProducts.findAll()
        if (dataTypeProd)
            resolve({
                status: 200,
                dataTypeProd
            })
        else reject({
            status: '',
            message: 'khong tim thay dataType'
        })
    });
}
module.exports = {
    createProduct,
    updateProduct,
    detailProduct,
    allProduct,
    allTypeProduct

}
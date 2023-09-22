import db from '../models';
import fs from "node:fs/promises";
import path from "node:path";
const imageProdDirectory = path.join(__dirname, '../../public/img/products')
async function createProduct(data) {
    return new Promise(async (resolve, reject) => {
        if (!data.name || !data.price || !data.quantity) {
            return reject({
                status: '',
                message: 'phai dien thong tin san pham'
            })
        }
        let checkTypeExist = await db.TypeProducts.findOne({
            where: {
                id: data.typeprodid
            }
        })
        if (checkTypeExist) {
            let product = await db.Products.create({
                name: data.name,
                price: data.price,
                discount: data.discount,
                des: data.des,
                image: data.imgName,
                quantity: data.quantity,
                typeprodid: data.typeprodid
            })
            return resolve({
                status: 200,
                product,
                message: 'ok'
            })
        }
        else {
            reject({
                status: '',
                message: 'typeid khong ton tai'
            })
        }

    })
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
        resolve({
            status: 200,
            listProduct
        })
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
        const listTypeProd = await db.TypeProducts.findAll();
        if (listTypeProd)
            resolve({
                status: 200,
                listTypeProd
            })
        else reject({
            status: '',
            message: 'khong tim thay du lieu'
        })
    });
}
async function deleteProduct(id) {
    return new Promise(async (resolve, reject) => {
        let isDeleted = await db.Products.destroy({
            where: {
                id: id
            }
        })
        if (isDeleted) {
            const product = await db.Products.findOne({
                where: {
                    id: id
                }
            })
            if (product.image != '') {
                fs.unlink(path.join(imageProdDirectory, product.image));
            }
            return resolve({
                status: 200,
                message: 'ok'
            })
        }
        reject({
            status: '',
            message: 'khong tim thay id'
        })
    })
}
async function deleteProductMany(listId) {
    return new Promise(async (resolve, reject) => {
        const products = await db.Products.findAll({
            where: {
                id: listId //ref vào dc arr,ko can su dung map()
            },
            attributes: ['image']
        })
        if (data.length != listId.length) {
            return reject({
                status: '',
                message: 'các id product dc chon khong ton tai'
            })
        }
        await db.Products.destroy({
            where: {
                id: listId //ref vào dc arr,ko can su dung map()
            }
        })
        products.map((item) => {
            if (item.image)
                fs.unlink(path.join(imageProdDirectory, item.image));
        })
        resolve({
            status: 200,
            message: 'delete successfully ' + listId.length + ' products'
        })

    })
}
module.exports = {
    createProduct,
    updateProduct,
    detailProduct,
    allProduct,
    allTypeProduct,
    deleteProduct,
    deleteProductMany
}
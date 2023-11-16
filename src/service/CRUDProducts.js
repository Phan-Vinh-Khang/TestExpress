import db from '../models';
import fs from "fs";
import path from "path";
import Fuse from 'fuse.js'
import { Op } from 'sequelize';
const imageProductDirectory = path.join(__dirname, '../../public/img/products/')
async function createProduct(data, iduser) {
    if (!data.name || !data.price || !data.quantity) {
        throw {
            status: '',
            message: 'phai dien thong tin san pham'
        }
    }
    let checkTypeExist = await db.TypeProducts.findOne({
        where: {
            id: data.typeprodid
        }
    })
    if (checkTypeExist) {
        await db.Products.create({
            name: data.name,
            price: data.price,
            discount: data.discount,
            des: data.des,
            image: data.fileNameUid,
            quantity: data.quantity,
            typeprodid: data.typeprodid,
            star: 0,
            sold: 0,
            usercreatedid: iduser,
            usershopid: 2
            //kiem tra user request có bao nhieu shop và shop gui den server co phai là 1 trong các shop của user đó hay ko
        })
        return {
            status: 200,
            message: 'created'
        }
    }
    throw ({
        status: '',
        message: 'typeid khong ton tai',
    })
}
async function detailProduct(id) {
    const prod = await db.Products.findByPk(id)
    const shop = await prod.getDetailShop();
    if (prod) {
        return {
            stauts: 200,
            product: prod,
            shop: shop
        }
    } else {
        throw {
            status: 422,
            message: 'id product khong ton tai'
        }
    }
}
async function allProduct(search, page) {
    let listProduct = await db.Products.findAll({
        include: {
            model: db.TypeProducts,
            as: 'detailTypeProd'
        },
        // where: {
        //     name: {
        //         [Op.like]: '%' + search + '%'
        //     }
        // }
    });
    if (search) {
        const options = {
            keys: ['name'],
            includeScore: true,
            isCaseSensitive: true,
            shouldSort: true,
        }
        let fuse = new Fuse(listProduct, options);
        listProduct = []
        let fuseData = fuse.search(search);
        fuseData.map((item) => {
            listProduct.push(item.item)
        })
    }
    let productCount = listProduct.length;
    listProduct = listProduct.slice(30 * (page - 1), 30 * (page))
    console.log(listProduct.length)

    listProduct.map((item) => {
        item.typeprodid = item.detailTypeProd.typeprodname
        delete item.dataValues.detailTypeProd
        let createdAt = new Date(item.createdAt);
        let localCreateAt = new Date(createdAt.getTime() + createdAt.getTimezoneOffset() * 60 * 1000 + 7 * 60 * 60 * 1000);
        let formattedCreateAt = localCreateAt.toLocaleString('en-US', { month: 'numeric', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        let updatedAt = new Date(item.updatedAt);
        let localUpdateAt = new Date(updatedAt.getTime() + updatedAt.getTimezoneOffset() * 60 * 1000 + 7 * 60 * 60 * 1000);
        let formattedUpdateAt = localUpdateAt.toLocaleString('en-US', { month: 'numeric', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        item.dataValues.createdAt = formattedCreateAt
        item.dataValues.updatedAt = formattedUpdateAt

    })
    return {
        status: 200,
        listProduct,
        productCount
    }
}
async function updateProduct(data, id) {
    const listTypeProduct = await db.TypeProducts.findAll()
    let typeproduct = listTypeProduct.find((item) => {
        return item.typeprodname == data.typeprodid
    })
    if (!typeproduct) {
        throw {
            status: '422',
            message: 'type product không hợp lệ'
        }
    }
    data.typeprodid = typeproduct.id
    let product = await db.Products.findByPk(id)
    if (!product) {
        throw {
            status: '',
            message: 'không tìm thấy sản phẩm'
        }
    }
    if (data.fileNameUid) {
        if (product.image) {
            const filePath = path.join(imageProductDirectory, product.image);
            fs.unlinkSync(filePath);
        }
        product.image = data.fileNameUid
    }
    product.name = data.name
    product.price = data.price
    product.discount = data.discount
    product.des = data.des
    product.quantity = data.quantity
    product.typeprodid = data.typeprodid
    product.save();
    return {
        status: 200,
        message: 'product updated'
    }

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
    const product = await db.Products.findByPk(id)
    let isDeleted = await db.Products.destroy({
        where: {
            id: id
        }
    })
    if (isDeleted) {
        if (product.image) {
            const filePath = path.join(imageProductDirectory, product.image);
            fs.unlinkSync(filePath);
        }
        return {
            status: 200,
            message: 'ok'
        }
    }
    throw {
        status: '',
        message: 'khong tim thay id'
    }
}
async function deleteProductMany(listId) {
    const productsImage = await db.Products.findAll({
        where: {
            id: listId //ref vào dc arr,ko can su dung map()
        },
        attributes: ['image']
    })
    if (productsImage.length != listId.length) {
        throw {
            status: '',
            message: 'các id product dc chon khong ton tai'
        }
    }
    await db.Products.destroy({
        where: {
            id: listId //ref vào dc arr,ko can su dung map()
        }
    })
    productsImage.map((item) => {
        if (item.image) {
            const filePath = path.join(imageProductDirectory, item.image);
            fs.unlinkSync(filePath);
        }
    })
    return {
        status: 200,
        message: 'delete successfully ' + listId.length + ' products'
    }

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
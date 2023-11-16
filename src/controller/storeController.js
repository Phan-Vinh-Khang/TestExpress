import Service from "../service/CRUDService";
import ServiceProd from "../service/CRUDProducts";
import ServiceRoles from "../service/CRUDRoles";
import ServiceUserShop from '../service/CRUDuserShop';
import ServiceOrders from '../service/CRUDOrders';
import JwtService from "../service/JwtService";
import db from '../models';
async function home(ref, res) {
    // var data = await db.Users.findAll();
    // const data = await Service.getListUsers();
    // res.render('home.ejs', { data: data });
}
async function createUser(req, res) {
    try {
        res.status(200).json(await Service.createUser(req.body))
    }
    catch (e) {
        res.status(409).json(e)
    }
}
async function createProduct(req, res) {
    try {
        res.status(200).json(await ServiceProd.createProduct(req.body.data, req.body.access_token.id));
    }
    catch (e) {
        res.status(409).json(e);
    }
}
async function detailProduct(req, res) {
    try {
        res.status(200).json(await ServiceProd.detailProduct(req.params.id))
    } catch (e) {
        res.status(422).json(e)
    }
}
async function allProduct(req, res) {
    console.log(req.query.search)
    res.status(200).json(await ServiceProd.allProduct(req.query.search, req.query.page))
}
async function updateProduct(req, res) {
    const authorization = await db.Products.findOne({
        where: {
            userCreatedId: req.body.access_token.id
        }
    })
    try {
        if (req.body.access_token.roleid > 2 && authorization == null) {
            throw {
                status: 409,
                message: 'khong the update san pham cua user khac, ban khong phai admin'
            }
        }
        res.status(200).json(await ServiceProd.updateProduct(req.body, req.params.id))
    } catch (e) {
        res.status(409).json(e)
    }
}
async function allTypeProduct(req, res) {
    try {
        res.status(200).json(await ServiceProd.allTypeProduct())
    } catch (e) {
        res.status(404).json(e)
    }
}
async function createRole(req, res) {
    try {
        res.status(200).json(await ServiceRoles.createRole(req.body));

    } catch (e) {
        res.status(409).json(e);
    }
}
async function checkUserLogin(req, res) {
    try {
        const data = req.body;
        res.status(200).json(await Service.checkUserLogin(data, res))
    } catch (e) {
        res.status(409).json(e)
    }
}
async function detailUser(req, res) {
    try {
        res.status(200).json(await Service.detailUser(req.params.id));
    } catch (e) {
        res.status(404).json({ message: 'ko tim thay id user' })
    }
}
async function allUser(req, res) {
    try {
        res.status(200).json(await Service.allUser());
    } catch (e) {
        res.status(500).json(e)
    }
}
async function allRole(req, res) {
    try {
        res.status(200).json(await Service.allRole());
    } catch (e) {
        res.status(500).json(e)
    }
}
async function updateUser(req, res) {
    if (req.body.access_token.id == req.params.id || req.body.access_token.roleid < 3) {
        try {
            console.log(req.body)
            res.status(200).json(await Service.updateUser(req.params.id, req.body.data));
            //neu Promise() return ve err se vao catch var e sẽ ref vao data err vua return
        } catch (e) {
            res.status(422).json(e);
        }
    }
    else res.status(404).json({ message: 'khong phai admin hoac ban dang sua thong tin cua nguoi khac' })
}
async function createUserAdmin(req, res) {
    try {
        res.status(200).json(await Service.createUserAdmin(req.body.data, req.body.access_token));
    } catch (e) {
        res.status(409).json(e);
    }
}
async function deleteUser(req, res) {
    try {
        if (req.body.access_token.id != req.params.id && req.body.roleid > 2) {
            throw {
                statis: '409',
                message: 'khong phai admin,ban khong the xoa tai khoan cua user khac'
            }
        }
        res.status(200).json(await Service.deleteUser(req.params.id));
    } catch (e) {
        res.status(404).json(e)
    }
}
async function deleteUserMany(req, res) {
    try {
        if (req.body.access_token.roleid > 2) {
            throw {
                message: 'khong phai admin'
            }
        }
        res.status(200).json(await Service.deleteUserMany(req.body.listId));
    } catch (e) {
        res.status(404).json(e)
    }
}
async function deleteProduct(req, res) {
    const authorization = await db.Products.findOne({
        where: {
            id: req.params.id,
            userCreatedId: req.body.access_token.id
        },
    })
    try {
        if (req.body.access_token.roleid > 2 && authorization == null) {
            throw {
                status: '409',
                message: 'khong the xoa san pham cua nguoi khac hoac ban khong phai admin'
            }
        }
        res.status(200).json(await ServiceProd.deleteProduct(req.params.id));
    } catch (e) {
        res.status(409).json(e);
    }
}
async function deleteProductMany(req, res) {
    const authorization = await db.Products.findAll({
        where: {
            id: req.body.listId,
            userCreatedId: req.body.access_token.id
        },
    })
    try {
        if (req.body.access_token.roleid > 2 && authorization.length != req.body.listId.length) {
            throw {
                status: '409',
                message: 'khong the xoa san pham cua nguoi khac hoac ban khong phai admin'
            }
        }
        res.status(200).json(await ServiceProd.deleteProductMany(req.body.listId));
    } catch (e) {
        res.status(409).json(e)
    }
}
async function createUserShop(req, res) {
    try {
        res.status(200).json(await ServiceUserShop.createUserShop(req.body.data, req.body.access_token))
    } catch (e) {
        res.status(422).json(e)
    }
}
async function getShopByProduct(req, res) {
    try {
        res.status(200).json(await ServiceUserShop.getShopByProduct(req.params.id))
    } catch (e) {
        res.status(422).json(e)
    }
}
async function getShopById(req, res) {
    try {
        res.status(200).json(await ServiceUserShop.getShopById(req.params.id))
    } catch (e) {
        res.status(422).json(e)
    }
}
async function checkout(req, res) {
    try {
        res.status(200).json(await ServiceOrders.checkout(req.body.data, req.body.access_token))
    } catch (e) {
        res.status(422).json(e)
    }
}
async function addcart(req, res) {
    try {
        res.status(200).json(await ServiceOrders.addcart(req.body.data, req.body.access_token.id))
    } catch (e) {
        res.status(422).json(e)
    }
}
async function getcart(req, res) {
    try {
        res.status(200).json(await ServiceOrders.getcart(req.body.access_token.id))
    } catch (e) {
        res.status(422).json(e)
    }
}
// async function checkValidCart(req, res, next) {
//     try {
//         await ServiceOrders.checkValidCart(req.body.data.listproduct)
//         //data tuong tu nhu checkout 
//         next();
//     } catch (e) {
//         res.status(422).json(e)
//     }
// }
async function authenticationUser(req, res) {
    try {
        res.status(200).json(await Service.authenticationUser(req.body.access_token.id));
    } catch (e) {
        res.status(404).json(e)
    }
}
async function logoutUser(req, res) {
    res.clearCookie('reAccessToken');
    res.status(200).json({
        status: 200,
        message: 'logout'
    });
}
async function reFreshtoken(req, res) {
    let objCookie = req.cookies;
    let data = await JwtService.reFreshtoken(objCookie.reAccessToken);//return obj with 2 token
    if (data.status == 200) {
        const date = new Date();
        date.setFullYear(new Date().getFullYear() + 1)
        res.cookie("reAccessToken", data.refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            expires: date,
        })
        res.status(200).json(data.access_token)
    }
    else res.status(401).json(data)
}
//
async function detailUserStore(ref, res) {
    const data = await Service.getUsers(ref.params.id)
    res.render('UserStore', { data: data });
}
async function updateViewStoreGet(ref, res) {
    const data = await Service.getUsers(ref.params.id)
    res.render('storeUpdateUserView', { data: data });

}
async function updateUserStore(ref, res) {
    const data = await Service.getUsers(ref.body.id)
    console.log('test', data)
    await Service.UpdateUser(data[0], ref.body)
    res.redirect('/');
}
async function removeUser(ref, res) {
    await Service.removeUserAction(ref.body.id)
    res.redirect('/');
}
module.exports = {
    home,
    createUser,
    detailUserStore,
    updateViewStoreGet,
    updateUserStore,
    removeUser,
    checkUserLogin,
    createProduct,
    detailProduct,
    allProduct,
    updateProduct,
    createRole,
    reFreshtoken,
    detailUser,
    authenticationUser,
    logoutUser,
    allTypeProduct,
    allUser,
    createUserAdmin,
    allRole,
    updateUser,
    deleteUser,
    deleteUserMany,
    deleteProduct,
    deleteProductMany,
    createUserShop,
    getShopByProduct,
    getShopById,
    checkout,
    addcart,
    getcart
    // checkValidCart
}
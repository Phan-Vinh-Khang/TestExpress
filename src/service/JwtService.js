import jwt from 'jsonwebtoken'
import 'dotenv'
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'ACCESS_TOKEN';
const REFRESH_TOKEN = process.env.REFRESH_TOKEN || 'REFRESH_TOKEN';
const generalAccessToken = async (data) => { //return về 1 chuỗi mã hóa của data
    //Short term token
    return jwt.sign(data, ACCESS_TOKEN, { expiresIn: '5h' })
}
//các para lần lượt: data(data này sẽ dc mã hóa khi gửi về client),secretkey,thời gian hết hạn
const generalReAccessToken = async (data) => {
    //Long term token
    return jwt.sign(data, REFRESH_TOKEN, { expiresIn: '999d' })
}
const checkToken = (req, res, next) => {//check access token
    jwt.verify(req.body.access_token, ACCESS_TOKEN, (err, data) => {
        if (!err) {
            req.body.access_token = data;//them 1 var properties access_token vao obj body
            next()
        }
        else {
            res.status(401).json({
                status: 401,
                message: 'access token expired or not correct '
            })
        }
    })
}
const checkToken2 = (req, res, next) => {
    jwt.verify(req.body.access_token, ACCESS_TOKEN, (err, data) => {
        if (err) {
            res.status(498).json({
                status: 498,
                message: 'access token expired or not correct '
            })
        }
        else {
            res.status(200).json({
                status: 200,
                message: 'ok'
            })
        }
    })

}
async function reFreshtoken(tokenCookie) {
    return jwt.verify(tokenCookie, REFRESH_TOKEN, async (err, data) => {
        if (!err) {
            const { id, roleid } = data;
            let access_token = await generalAccessToken({ id, roleid });
            let refresh_token = await generalReAccessToken({ id, roleid });
            return {
                status: 200,
                access_token: access_token,
                refresh_token: refresh_token
            };
        } else return {
            status: 401,
            message: 'refresh token expired or not correct '
        }

    })
}
async function AuthUser(req, res, next) { //check xem user cần sửa data có phải la user đang đăng nhập ko
    jwt.verify(req.body.JWTToken, ACCESS_TOKEN, (err, data) => {
        if (!err) {
            //check data.role==1||data.id==req.params.id?
            /*
             nếu k check data.id==req.pafams.id, nếu user1 biết route sua,thay đổi thong tin và iduser của user2 khác user1 chỉ cần
             dùng các phần mềm để gửi route(postman,extension....) và điền iduser của user2 và gửi req
             khi check token sẽ decode dc nhưng đó là token của user1 sau khi decode func sẽ next()
             và thay đổi thông tin user2 (user1 có thể thay đổi user2)
             */
            next();
        }
        else {
            res.status(200).json({
                message: 'invalid access token'
            })
        }
    })
}
module.exports = {
    generalAccessToken,
    generalReAccessToken,
    checkToken,
    reFreshtoken,
    AuthUser,
    checkToken2
}
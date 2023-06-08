import jwt, { verify } from 'jsonwebtoken'
const generalAccessToken = async (data) => { //return về 1 chuỗi mã hóa của data
    //Short term token
    return jwt.sign({ data }, 'access_token', { expiresIn: '1h' })
}
//các para lần lượt: data(data này sẽ dc mã hóa khi gửi về client),secretkey,thời gian hết hạn
const generalReAccessToken = async (data) => {
    //Long term token
    return jwt.sign({ data }, 'reAccess_token', { expiresIn: '999d' })
}
const checkToken = (req, res, next) => {//check access token
    jwt.verify(req.body.JWTToken, 'access_token', (err, data) => {
        if (!err) {
            next()
        }
        else {
            res.status(200).json('err token')
        }
    })
}
async function reFreshtoken(tokenCookie) {
    return jwt.verify(tokenCookie, 'reAccess_token', async (err, data) => {
        if (!err) {
            let token = await generalAccessToken(data);
            let reFreshToken = await generalReAccessToken(data);
            return {
                token: token,
                reFreshToken: reFreshToken
            };
        } else {
            return {
                message: 'invalid tokenCookie'
            }
        }
    })
}
async function AuthUser(req, res, next) { //check xem user cần sửa data có phải la user đang đăng nhập ko
    jwt.verify(req.body.JWTToken, 'access_token', (err, data) => {
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
    AuthUser
}
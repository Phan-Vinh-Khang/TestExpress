import jwt from 'jsonwebtoken'
import 'dotenv'
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'ACCESS_TOKEN';
const REFRESH_TOKEN = process.env.REFRESH_TOKEN || 'REFRESH_TOKEN';
const generalAccessToken = async (data) => { //return về 1 chuỗi mã hóa của data
    //Short term token
    return jwt.sign(data, ACCESS_TOKEN, { expiresIn: '30s' })
}
//các para lần lượt: data(data này sẽ dc mã hóa khi gửi về client),secretkey,thời gian hết hạn
const generalReAccessToken = async (data) => {
    //Long term token
    return jwt.sign(data, REFRESH_TOKEN, { expiresIn: '999d' })
}
const checkToken = (req, res, next) => {//check access token
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, ACCESS_TOKEN, (err, data) => {
        if (!err) {
            req.body.access_token = data;//them 1 var properties access_token vao obj body
            next();//có thể route thẳng đến func này(ko can func checktoken2) check token,nếu có req.data(req.data!=undefine) thì neu token correct thì next
            //nếu k có req.data thì return về client du correct token hay ko,sau đó nếu dung token thì client req,con k thi refresh token sau do req
        }
        else {
            res.status(401).json({
                status: 401,
                message: 'access token expired or not correct '
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
module.exports = {
    generalAccessToken,
    generalReAccessToken,
    checkToken,
    reFreshtoken
}
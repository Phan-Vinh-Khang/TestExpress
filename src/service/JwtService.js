import jwt from 'jsonwebtoken'
const generalAccessToken = async (data) => { //return về 1 chuỗi mã hóa của data
    //Short term token
    return jwt.sign({ data }, 'access_token', { expiresIn: '1h' })
}
//các para lần lượt: data(data này sẽ dc mã hóa khi gửi về client),secretkey,thời gian hết hạn
const generalReAccessToken = async (data) => {
    //Long term token
    return jwt.sign({ data }, 'reAccess_token', { expiresIn: '999d' })
}
const checkToken = (req, res, next) => {
    jwt.verify(req.body.JWTToken, 'access_token', (err, data) => {
        if (!err) {
            next()
        }
        else {
            res.status(200).json('err token')
        }
    })
}
module.exports = {
    generalAccessToken,
    generalReAccessToken,
    checkToken
}
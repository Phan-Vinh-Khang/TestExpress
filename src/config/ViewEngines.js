import express from 'express'
function ViewEngines(app) {
    app.set('view engine', 'ejs') //chọn view engnies sử dụng, các file với .ejs sẽ dc sử dụng
    app.set('views', './src/views')//chọn thư mục để tìm file .ejs,các file .ejs sẽ dc tìm trong thư mục này
}
export default ViewEngines
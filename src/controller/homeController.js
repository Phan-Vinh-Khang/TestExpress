import db from "../model/database";
async function homeController(ref, res) {
    const [dataUsers, fields] = await db.execute('SELECT * FROM users');
    // return arr[{},{}]
    {/*
        [
      {
        Id: 1,
        Name: 'Name1',
        Old: 22,
        PhoneNumber: 123456,
        Adress: 'TP.HCM'
      },
      {
        Id: 2,
        Name: 'Name2',
        Old: 23,
        PhoneNumber: 123789,
        Adress: 'Ha Noi'
      }
    ]
    */
    }
    // var [rows, fields] sẽ ref vào arr[0] và arr[2]
    res.render('test', { data: dataUsers }) //return data to view
    // view sử dụng properties trong obj,ko cần 1 var ref vào obj
    // res.render('test'); //return html
}
async function createUser(ref, res) {
    let objForm = ref.body
    console.log(ref.body)
    await db.execute('INSERT INTO users (name, phonenumber,adress) VALUES (?,?,?)', [objForm.Name, Number(objForm.PhoneNumber), objForm.Adress]);
    // await db.execute('INSERT INTO users (Name, PhoneNumber,Adress) VALUES (' + objForm.Name + ',' + objForm.PhoneNumber + ',' + objForm.Adress + ')');
    res.redirect('/') // sau khi xử lí func trong controller này xong sẽ ref đến func controller '/'
}
async function removeUser_Get(ref, res) {
    console.log(ref.params.Id)
    await db.execute('DELETE FROM users WHERE id=?', [ref.params.Id])
    res.redirect('/')
}
async function removeUser_Post(ref, res) {
    console.log(ref.body.id)
    await db.execute('DELETE FROM users WHERE id=?', [ref.body.id])
    res.redirect('/')
}
async function updateUserView_Post(ref, res) {
    console.log(ref.body.id)
    const [data, fiels] = await db.execute('SELECT * FROM users WHERE id=?', [ref.body.id])
    res.render('updateUser', { dataUser: data[0] })
}
async function updateUserView_Get(ref, res) {
    console.log(ref.params.Id)
    const [data, fiels] = await db.execute('SELECT * FROM users WHERE id=?', [ref.params.Id])
    res.render('updateUser', { dataUser: data[0] })
}
async function updateUser_Post(ref, res) {
    const { Id, Name, PhoneNumber, Adress } = ref.body;
    //varname phai chinh xac cac properties trong obj,ko can theo thu tu properties trong obj
    await db.execute('UPDATE users SET Name=?, PhoneNumber=? , Adress=? WHERE Id=?;', [Name, PhoneNumber, Adress, Id])
    res.redirect('/');
}
// export default homeController
module.exports = { //khi import homeController sẽ là properties trong obj
    homeController,
    createUser,
    removeUser_Get,
    removeUser_Post,
    updateUserView_Post,
    updateUserView_Get,
    updateUser_Post
}
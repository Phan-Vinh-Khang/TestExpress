import db from '../model/database'
async function JsON_Users(ref, res) {
    // res.send('Khong tim thay user');
    const [data, fiels] = await db.execute("SELECT * FROM users")
    var obj = [];
    for (let i = 0; i < data.length; i++) {
        obj.push({
            name: data[i].Name,
            adress: data[i].Adress,
            PhoneNumber: data[i].PhoneNumber

        })
    }
    console.log(obj);
    return res.status(200).json(obj) //return file json ve view
}
async function Api_Create_User(ref, res) {
    // res.send('Khong tim thay user');
    var { PhoneNumber, Adress, Name } = ref.body;
    console.log(ref.body)
    if (Name && PhoneNumber && Adress) {
        await db.execute('INSERT INTO users (name, phonenumber,adress) VALUES (?,?,?)', [Name, PhoneNumber, Adress]);
        return res.status(200).json({
            message: 'da them thong tin'
        })
    }
    else
        return res.status(200).json({
            message: 'can dien them thong tin'
        }) //return file json ve view
}
async function Api_Update_User(ref, res) {
    const { Id, Name, PhoneNumber, Adress } = ref.body;
    const [data] = await db.execute('SELECT * FROM users WHERE Id=?', [Id])
    if (data.length > 0 && Name && PhoneNumber && Adress) {
        await db.execute('UPDATE users SET Name=?, PhoneNumber=? , Adress=? WHERE Id=?;', [Name, PhoneNumber, Adress, Id])
        return res.status(200).json({
            message: 'da update thong tin'
        })
    }
    else
        return res.status(200).json({
            message: 'khong tim thay id hoac can dien them thong tin'
        })
}
async function Api_Remove_User(ref, res) {
    const [data] = await db.execute('SELECT * FROM users WHERE Id=?', [ref.params.Id])
    if (data.length > 0) {
        await db.execute('DELETE FROM users WHERE id=?', [ref.params.Id])
        res.status(200).json({
            message: 'da remove user'
        })
    }
    else {
        return res.status(200).json({
            message: 'khong tim thay user'
        })
    }
}
module.exports = {
    JsON_Users,
    Api_Create_User,
    Api_Update_User,
    Api_Remove_User
}
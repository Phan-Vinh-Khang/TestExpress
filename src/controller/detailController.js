import db from "../model/database";
async function user(ref, res) {
    let id = ref.params.Id; //ref.params return obj
    const [data, fiels] = await db.execute('select * from users where id=?', [id])
    //    const [data, fiels] = await db.execute('select * from users where id='+id)
    // execute return ve arr obj( arr[{},{}] )
    console.log(data)
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
    */}
    if (data.length > 0)
        res.render('user', { dataUser: data[0] }); //return html
    else res.send('Khong tim thay user');
    //nếu properties của obj ref vào 1 obj,view sử dụng sẽ phải ref đến properties của obj đó
    //view sử dụng properties trong obj,ko cần 1 var ref vào obj
}
module.exports = {
    user
}
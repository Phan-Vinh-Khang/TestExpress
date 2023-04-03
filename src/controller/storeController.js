import db from "../models";
async function test(ref, res) {
    var data = await db.Users.findAll();
    res.send(JSON.stringify(data));
    // res.render('test.ejs', { data: data });
}
module.exports = {
    test
}
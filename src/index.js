const express = require('express'); //lenh import của js cu
require('dotenv').config()
const app = express();
const port = parseInt(process.env.PORT);
const morgan = require('morgan');
app.use(morgan('combined'));

// app.engine('handlebars', engine());
// app.set('view engine', 'handlebars');
// app.set('views', './views');

app.get('/', (req, res) => {
    res.send('test');
});
app.get('/test2', (req, res) => {
    res.send('test2');
});
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

const Fuse = require('fuse.js');

// Danh sách sản phẩm
const products = [
    { 'name': 'Product1' },
    { 'name': 'Product2' },
    //...
];

// Tùy chọn cho Fuse
const options = {
    keys: ['name'],
    includeScore: true
};

// Tạo đối tượng Fuse
const fuse = new Fuse(products, options);

// Tìm kiếm sản phẩm
const result = fuse.search('your_product_name');

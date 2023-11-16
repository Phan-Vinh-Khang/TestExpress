const FuzzySearch = require('fuzzy-search');
const levenshtein = require('js-levenshtein');

let products = [
    { name: 'Product 1' },
    { name: 'Product 2' },
    { name: 'Product 3' },
    // thêm các sản phẩm khác vào đây
];

let searcher = new FuzzySearch(products, ['name'], {
    caseSensitive: false,
});

let search = (query) => {
    let results = searcher.search(query);
    results.sort((a, b) => levenshtein(a.name, query) - levenshtein(b.name, query));
    return results;
};

console.log(search('Product 1')); // thay 'Product 1' bằng tên sản phẩm bạn muốn tìm kiếm

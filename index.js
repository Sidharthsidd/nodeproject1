const fs = require('fs');     
const http = require('http');
const url = require('url');
const replaceTemplate=require('./modules//replaceTemplate')
const slugify=require('slugify')



//////////////////////////////////
// File reading example (async)
fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
    if (err) return console.error(err);
    console.log(data);
});
console.log("will read file");

// Template Replacement Function
/*const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%productName%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%price%}/g, product.price);
    output = output.replace(/{%From%}/g, product.from);
    output = output.replace(/{%description%}/g, product.description);
    output = output.replace(/{%nutrients%}/g, product.nutrients);
    output = output.replace(/{%quantity%}/g, product.quantity);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
};*/

// Loading templates and data
const tempproduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const tempcard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempoverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataobj = JSON.parse(data);

//lecture to how slug works 

/*const slugs =dataobj.map(el=>slugify(el.productName,{lower:true}))
console.log(slugs)
*/

// Create server
const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    // Overview page
    if (pathname === '/overview' || pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const cardsHtml = dataobj.map(el => replaceTemplate(tempcard, el)).join('');
        const output = tempoverview.replace('{%products_cards%}', cardsHtml);
        res.end(output);
    }
    // Product page
    else if (pathname === '/product') {
        const product = dataobj[query.id];
        const output = replaceTemplate(tempproduct, product);
        res.end(output);
    }
    // API page
    else if (pathname === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
    }
    // Not found
    else {
        res.writeHead(404, {
            'Content-Type': 'text/plain',
            'my-own-header': 'hello world',
        });
        res.end('404 not found');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log("server is running on port 8000");
});

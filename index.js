const fs=require('fs');     
const http =require('http');
const url =require('url');
// const replaceTemplate = require('./modules/replaceTemplate');
//////////////////////////////////
///Files
//synchronous way to read and file 
/*
const text =fs.readFileSync('./txt/input.txt','utf-8')
console.log(text)

const textOut=` tis is what we know about avacoda :${text}.\n Created on ${Date.now()}`
fs.writeFileSync('./txt/output.txt',textOut)
console.log('file written')
*/

fs.readFile('./txt/start.txt','utf-8',(err,data)=>{
    console.log(data)
})
console.log("will read file  ")


fs.readFile('./txt/start.txt','utf-8',(err,data)=>{
    console.log(data)
    console.log(data)
})



//////////////////////
//  server 
 const replaceTemplate=(temp,product)=>{
    let output = temp.replace(/{%productName%}/g,product.productName);
     output = temp.replace(/{%IMAGE%}/g,product.image);
  output = temp.replace(/{%price%}/g,product.price);
  output = temp.replace(/{%From%}/g,product.from);
  output = temp.replace(/{%description%}/g,product.description);
  output = temp.replace(/{%nutrients%}/g,product.nutrients);
  output = temp.replace(/{%quantity%}/g,product.quantity); 
output = temp.replace(/{%ID%}/g,product.id);

if(!product.organic) output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic')
  return output;
 }

 const tempproduct=fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8' );
 const tempcard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
 const tempoverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');

 const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8' );
 const dataobj=JSON.parse(data);



//creates a server through http 
const server =http.createServer((req,res)=>{
    
    const pathname =req.url;
    //overview page 
    if (pathname==='/overview' || pathname==='/'){
        res.writeHead(200,{'Content-Type':'text/html'});
        const cardsHtml=dataobj.map(el=>replaceTemplate(tempcard,el))
        const ouput =tempoverview.replace('{%products_cards%}',cardsHtml);
        res.end(ouput);


        res.end(tempoverview)
    }
    //product page 
    else if(pathname ==='/product'){
        res.end("this is the product")
    }

    //api
    else if (pathname==='/api'){
         fs.readFile(`${__dirname}/dev-data/data.json`,'utf-8',(err,data)=>{
        const productdata=JSON.parse(data);
        res.end(data);
        res.writeHead(200,{'Content-Type':'application/json',
        })
    })

}
    else{
        res.writeHead(404,{'Content-Type':'text/plain',
            'my-own-header':'hello world',
        })
        res.end('404 not found')
    }
});


server.listen(8000,'127.0.0.1',()=>{
    console.log("server is running on port 8000")
});


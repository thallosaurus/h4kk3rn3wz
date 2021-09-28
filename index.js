const https = require('https');
const http = require("http");
const cheerio = require("cheerio");
const fs = require("fs");

function makeRequest(req) {
    return new Promise((resolve, reject) => {
        let r = https.request({
            hostname: 'news.ycombinator.com',
            port: 443,
            path: req.url,
            headers: process.env.NODE_ENV == "production" ? req.headers : {},
            method: 'GET'
        }, res => {

            let data = "";

            res.on('data', d => {
                // console.log(d);
                data += d;
            });

            res.on('end', () => {
                resolve(data.toString());
            });
        });
        r.end();
    });
}

function appendScript(html) {
    // return new Promise((res, rej) => {
        let $ = cheerio.load(html);

        const clientScript = fs.readFileSync(__dirname + "/client/l33tsp34k.js", 'utf-8');

        $("head").append("<meta charset='UTF-8'>");
        // $('head').append(`<script>${clientScript}</script>`);
        return $.html();
    // });
}

/* http.createServer((req, res) => {
    makeRequest(req)
    // .then(appendScript)
    .then((body) => {

        if (req.url.includes("gif")) {
            res.setHeader("Content-Type", "image/gif");
        } else {
            res.setHeader("Content-Type", "text/html;charset=UTF-8");
        }
        res.write(body, 'utf-8');
        res.end();
    });
}).listen(3000); */

http.createServer((req, res_) => {
    let r = https.request({
        hostname: 'news.ycombinator.com',
        port: 443,
        path: req.url,
        headers: process.env.NODE_ENV == "production" ? req.headers : {},
        method: 'GET'
    }, hnRes => {

        // let data = new String();

        // if () res_.setHeader("")

        let data = [];

        hnRes.on('data', chunk => {
            // data.push(chunk);
            if (!req.url.includes(".")) {
                // console.log("\n\n" + chunk.toString());
                data.push(chunk.toString());

                // res_.write(chunk);
                // console.log(req.url);
            } else {
                //binary file, DO NOT CHANGE!
                res_.write(chunk);
            }
                
        });
        
        hnRes.on('end', () => {
            // var buf = Buffer.concat(data);
            if (!req.url.includes(".")) {
                //modify
                res_.write(appendScript(data.join()));
            }

            res_.end();
        });
    });
    r.end();
}).listen(3000);
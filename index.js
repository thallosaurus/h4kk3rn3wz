const https = require('https');
const http = require("http");
const { parse } = require("node-html-parser");
const leet = require("./l33t.js");
const fs = require('fs');

function modify(html) {
    // let $ = cheerio.load(html);

    // const clientScript = fs.readFileSync(__dirname + "/client/l33tsp34k.js", 'utf-8');

    const document = parse(html);
    
    //first, we remove the login option - we dont want to capture sessions or anything, so we dont come off as sus
    for (let s of document.querySelectorAll("a[href*='login?goto=']")) {
        s.parentNode.removeChild(s);
    }

    //remove submit, so you can't login
    for (let sub of document.querySelectorAll("a[href='submit']")) {
        sub.parentNode.removeChild(sub);
    }

    for (let s of document.querySelectorAll("a[href*='item']")) {
        s.textContent = leet(s.textContent);
    }

    for (let u of document.querySelectorAll(".sitestr")) {
        u.textContent = leet(u.textContent);
    }

    let title = document.querySelector("title");
    title.textContent = leet(title.textContent);

    let pageTitle = document.querySelector(".hnname a");
    pageTitle.textContent = leet(pageTitle.textContent);

    let headerLinks = document.querySelectorAll(".pagetop a:not(b.hnname)");
    for (const l of headerLinks) {
        l.textContent = leet(l.textContent);
    }

    let head = document.querySelector("head");
    head.insertAdjacentHTML("beforeend", "<meta charset='UTF-8'>");
    head.insertAdjacentHTML("beforeend", "<script>"+fs.readFileSync("clientHelp.js")+"</script>")

    let storylinks = document.querySelectorAll(".storylink");
    let scores = document.querySelectorAll(".score");

    for (const s of storylinks.concat(scores)) {
        s.textContent = leet(s.textContent);
    }

    let yclinks = document.querySelector(".yclinks");
    yclinks.insertAdjacentHTML("beforeend", "<a href='#' onclick='javascript:showHelp()'> | Help</a>");
    yclinks.insertAdjacentHTML("beforeend", "<a href='https://github.com/thallosaurus/h4kk3rn3wz'> | Source</a>");

    return document.toString();
    // return html;
}

// function 

http.createServer((req, res_) => {
    let r = https.request({
        hostname: 'news.ycombinator.com',
        port: 443,
        path: req.url,
        headers: process.env.NODE_ENV == "production" ? req.headers : {},
        method: 'GET'
    }, hnRes => {

        // console.log(req.query);

        let data = "";

        hnRes.on('data', chunk => {
            if (isModifiableTargetUrl(req.url)) {
                data += chunk;
            } else {
                //binary file, DO NOT CHANGE!
                res_.write(chunk);
            }

        });

        hnRes.on('end', () => {
            if (isModifiableTargetUrl(req.url)) {
                //modify
                res_.write(modify(data));
            }

            res_.end();
        });
    });
    r.end();
}).listen(3000);

function isModifiableTargetUrl(url) {
    const hits = ["/", "/news", "/newest", "/front", "/newcomments"]
    return !url.includes(".") && hits.includes(url);
}
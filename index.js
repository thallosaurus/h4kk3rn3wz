const https = require('https');
const http = require("http");
const { parse } = require("node-html-parser");
const leet = require("./l33t.js");
const fs = require('fs');

const url = require("url");

function modify(html, req) {
    const document = parse(html);
    
    //first, we remove the login option - we dont want to capture sessions or anything, so we dont come off as sus
    for (let s of document.querySelectorAll("a[href*='login?goto=']")) {
        s.parentNode.removeChild(s);
    }

    //remove submit, so you can't login
    for (let sub of document.querySelectorAll("a[href='submit']")) {
        sub.parentNode.removeChild(sub);
    }

    //leetify comment count
    for (let s of document.querySelectorAll("a[href*='item']")) {
        s.textContent = leet(s.textContent, req);
    }

    //leetify right url string
    for (let u of document.querySelectorAll(".sitestr")) {
        u.textContent = leet(u.textContent, req);
    }

    //leetify tab name
    let title = document.querySelector("title");
    title.textContent = leet(title.textContent, req);

    //leetify hacker news name on site
    let pageTitle = document.querySelector(".hnname a");
    pageTitle.textContent = leet(pageTitle.textContent, req);

    //leetify header tabs
    let headerLinks = document.querySelectorAll(".pagetop a:not(b.hnname)");
    for (const l of headerLinks) {
        l.textContent = leet(l.textContent, req);
    }

    //fix charset and add client script
    let head = document.querySelector("head");
    head.insertAdjacentHTML("beforeend", "<meta charset='UTF-8'>");
    head.insertAdjacentHTML("beforeend", "<script>"+fs.readFileSync("clientHelp.js")+"</script>")

    //leetify storylinks and points
    let storylinks = document.querySelectorAll(".storylink");
    let scores = document.querySelectorAll(".score");

    for (const s of storylinks.concat(scores)) {
        s.textContent = leet(s.textContent, req);
    }

    //append help link and link to github to footer
    let yclinks = document.querySelector(".yclinks");
    yclinks.insertAdjacentHTML("beforeend", "<a href='#' onclick='javascript:showHelp()'> | Help</a>");
    yclinks.insertAdjacentHTML("beforeend", "<a href='https://github.com/thallosaurus/h4kk3rn3wz'> | Source</a>");

    return document.toString();
    // return html;
}

http.createServer((req, res_) => {
    let r = https.request({
        hostname: 'news.ycombinator.com',
        port: 443,
        path: req.url,
        // headers: process.env.NODE_ENV == "production" ? req.headers : {},
        method: 'GET'
    }, hnRes => {
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
                res_.write(modify(data, req));
            }

            res_.end();
        });
    });
    r.end();
}).listen(process.env.PORT || 3000);

function isModifiableTargetUrl(u) {

    let s = url.parse(u, true);

    const hits = ["/", "/news", "/newest", "/front"]
    return !s.pathname.includes(".") && hits.includes(s.pathname);
}
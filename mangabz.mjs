#!/usr/bin/env zx

/**
 * fetch https://www.mangabz.com/1bz/
 */

const domain = "https://www.mangabz.com";
const args = argv;

async function curlSummary(url) {
    const response = await fetch(url);
    return response.text();
}

function azChapters(html) {
    const list = [];
    html.replace(/<a href=\"\/m\d+\/\" class=\"detail-list-form-item.*?<\/a>/g, (m) => list.push(m));
    return list.map((e) => {
        let href = "";
        let size = 0;
        let title = "";
        e.replace(/href=\"(\/.+\/)\"/, (m, m1) => (href = m1));
        e.replace(/<span>（(\d+)P）<\/span>/, (m, m1) => (size = +m1));
        e.replace(/<a .*?>(.*?)<span>/, (m, m1) => (title = m1.trim()));
        return { href, size, title };
    });
}

async function curlSign(url) {
    const response = await fetch(url);
    const html = await response.text();
    const list = [];
    html.replace(/var ([A-Z_]+?)\S?=(.+?);/g, (m, m1, m2) => {
        if (+m2 > -1) {
            // number
            m2 = +m2;
        } else {
            // string
            m2 = m2.slice(1, -1);
        }
        list.push([m1, m2]);
    });
    console.log(list);
    return Object.fromEntries(list);
}

async function curlImageInfo(vars) {
    let qs = `?cid=${vars.MANGABZ_CI}&page=1&key=&_cid=${vars.MANGABZ_CI}&_mid=${vars.MANGABZ_MI}`;
    qs += `&_dt=${encodeURIComponent(vars.MANGABZ_VIEWSIGN_D.replace(" ", "+"))}&_sign=${vars.MANGABZ_VIEWSIG}`;
    const resp = await fetch(`https://www.mangabz.com/m${vars.MANGABZ_CI}/chapterimage.ashx` + qs);
    const js = await resp.text();
    const code = eval("(" + js.slice(4) + ")").replace("d=dm5imagefun()", "qs=dm5imagefun()");
    eval(code);
    return qs; // string[]
}

async function main() {
    if (args.i) {
        const html = await curlSummary(args.i);
        const chapters = azChapters(html);
        console.log(chapters);
    } else if (args.d) {
        const vars = await curlSign(args.d);
        const js = await curlImageInfo(vars);
        console.log(js);
    } else {
        console.log(args);
    }
}

process.nextTick(main);

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

async function main() {
    const html = await curlSummary(args.i);
    const chapters = azChapters(html);
    console.log(chapters);
}

process.nextTick(main);

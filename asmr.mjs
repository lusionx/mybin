#!/usr/bin/env zx

let { data: { files } } = require("./data.json")
// eg. https://www.asmrgay.com/asmr/%E4%B8%AD%E6%96%87%E9%9F%B3%E5%A3%B0/jok

for(const ff of files) {
    if(!ff.url) continue
    const name = ff.name.replace(/\s+/g, '_')
    await $`curl -o ${name} ${ff.url}`
}


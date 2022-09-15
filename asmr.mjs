#!/usr/bin/env zx

let { data: { files } } = require("./data.json")


for(const ff of files) {
    if(!ff.url) continue
    const name = ff.name.replace(/\s+/g, '_')
    await $`curl -o ${name} ${ff.url}`
}


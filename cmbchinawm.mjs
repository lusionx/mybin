#!/usr/bin/env zx
/**
 * page https://cmbchinawm.com/publicOffering?finType=P
 * fetch https://www.cmbchinawm.com/prod-api/web/api/product/getProductList
 */

import { sm2 } from "sm-crypto"
import axios from 'axios';

function doEncrypt(t) {
    let e = JSON.stringify(t)
    return "04" + sm2.doEncrypt(e, "04abeaf37bbae5029a693b6e6dea956ee70860bcdc3da44258bf7cdbedc5dd07a65d2dcdbd5c788c2c79b58f6950e87b7c36d8a893c581400bf9d8a3b359280529", 1)
}

const apiProductList = 'https://www.cmbchinawm.com/prod-api/web/api/product/getProductList'

async function getPage(i = 1) {
    let opt = {
        order: "desc",
        currCode: "", current: i,
        finType: "P", keyWord: "",
        orderBy: "ipoBgnDt desc",
        pageSize: 5, prodClcMode: "01",
        prodLimit: [], saCode: "",
        saleState: "", userId: 0
    };
    const res = await axios.post(apiProductList, doEncrypt(opt), {headers: {'content-type': 'application/json'}})
    console.log(res.data)
}

getPage()
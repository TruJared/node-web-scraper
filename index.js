const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');

const url = 'http://localhost:5500/sampleData.html';


rp(url)
    .then(function (html) {
        const allThatData = [];
        const numBids = [];
        const finalPrice = [];
        const minBid = [];
        const estimate = [];
        const link = $('.imageDiv > a', html);
        const lotNumbers = $('#LotNumber', html);
        const productNames = $('.lotImage', html);
        const lotData = $('.lotData', html);


        // loop through lot data to create 4 new arrays of data
        // todo filter out info before `: `
        lotData.each((i, e) => {
            numBids.push(lotData[i].children[1].children[0].children[0].data);
            minBid.push(lotData[i].children[3].children[0].children[0].data);
            finalPrice.push(lotData[i].children[5].children[0].children[0].data);
            estimate.push(lotData[i].children[7].children[0].children[0].data);
        })

        // create array of arrays [numBids, finalPrice, minBid, estimate ]
        const dataArray = [numBids, finalPrice, minBid, estimate];

        // create array of objects assigning various data as needed
        lotNumbers.each((i, e) => {
            const dataObj = {
                'Lot_Number': e.children[0].data,
                'Item_name': productNames[i].attribs.alt,
                'URL': link[i].attribs.href,
                'Number_Of_Bids': dataArray[0][i],
                'Final_Price': dataArray[1][i],
                'Min_Bid': dataArray[2][i],
                'Estimate': dataArray[3][i],
            }
            allThatData.push(dataObj);
        })

        fs.appendFile('data.json', JSON.stringify(allThatData), (err) => {
            if (err) throw err;
            console.log('done')

        })


    })
    .catch(function (err) {
        console.log('bummer!')
    })

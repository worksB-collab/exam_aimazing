class Receipt{
    constructor(shopName, shopTel, shopGstReg, receiptDate, receiptTime, receiptId, receiptItems, receiptTotal, receiptInclusive, receiptGst){
        this.shopName = shopName
        this.shopTel = shopTel
        this.shopGstReg = shopGstReg
        this.receiptDate = receiptDate
        this.receiptTime = receiptTime
        this.receiptId = receiptId 
        this.receiptItems = receiptItems
        this.receiptTotal = receiptTotal
        this.receiptInclusive = receiptInclusive
        this.receiptGst = receiptGst
    }
    constructor(){}
}

class Item{
    constructor(itemId, itemName, itemQty, itemPrice){
        this.itemId = itemId
        this.itemName = itemName
        this.itemQty = itemQty
        this.itemPrice = itemPrice 
    }
}
export {Receipt, Item};

module.exports = {
    decodeReceipt: function(receipt){
        let splitStr = receipt.split("\n")
        let shopName = removeNextLine(splitStr[0])
        let shopTel = removeNextLine(splitStr[1].split(":")[1])
        let shopGstReg = removeNextLine(splitStr[2].split(":")[1])
        let receiptDate = removeNextLine(splitStr[4].split(":")[1].split(" ")[0])
        let receiptTime = removeNextLine(splitStr[4].split(":")[2])
        let receiptId = removeNextLine(splitStr[5].split(":")[1])
        let lineCount = 7
        let receiptItems = []
        while (splitStr[lineCount] != "\r"){
            let itemId = removeNextLine(splitStr[lineCount].split(" ")[0])
            let itemName = removeNextLine(splitStr[lineCount].split(" ")[1])
            lineCount += 1
            let itemQty = removeNextLine(splitStr[lineCount].split(" x ")[0])
            let itemPrice = removeNextLine(splitStr[lineCount].split(" x ")[1].split(" ")[0])
            lineCount += 1
            receiptItems.push(new Item(itemId, itemName, itemQty, itemPrice))
        }
        while(splitStr[lineCount].split(" :")[0] != "Total"){
            lineCount += 1
        }
        let totalArr = removeNextLine(splitStr[lineCount].split(" "))
        let receiptTotal = removeNextLine(totalArr[totalArr.length-1])
        let receiptInclusive = removeNextLine(splitStr[lineCount+2].split(" ")[1].split("%")[0])
        let receiptGst = removeNextLine(splitStr[lineCount+2].split(" ")[3])
        return new Receipt(shopName, shopTel, shopGstReg, receiptDate, receiptTime, receiptId, receiptItems, receiptTotal, receiptInclusive, receiptGst)
    },
    readReceipt: function (){
        let fs = require('fs');
        let filePath = 'quiz_sample_receipts/sample_receipt_2.txt'
        try {  
            var data = fs.readFileSync(filePath, 'utf8');
            // console.log(data);    
            return data
        } catch(e) {
            console.log('Error:', e.stack);
        }
    },
    
    removeNextLine: function (input){
        if (input.includes("\r")){
            input = input.replace("\r","");
        }
        return input
    },
    
    testLogic: function (){
        console.log(decodeReceipt(readReceipt()))
    
    }
  };

function decodeReceipt(receipt){
    let splitStr = receipt.split("\n")
    let shopName = removeNextLine(splitStr[0])
    let shopTel = removeNextLine(splitStr[1].split(":")[1])
    let shopGstReg = removeNextLine(splitStr[2].split(":")[1])
    let receiptData = removeNextLine(splitStr[4].split(":")[1].split(" ")[0])
    let receiptTime = removeNextLine(splitStr[4].split(":")[2])
    let receiptId = removeNextLine(splitStr[5].split(":")[1])
    let lineCount = 7
    let receiptItems = []
    while (splitStr[lineCount] != "\r"){
        let itemId = removeNextLine(splitStr[lineCount].split(" ")[0])
        let itemName = removeNextLine(splitStr[lineCount].split(" ")[1])
        lineCount += 1
        let itemQty = removeNextLine(splitStr[lineCount].split(" x ")[0])
        let itemPrice = removeNextLine(splitStr[lineCount].split(" x ")[1].split(" ")[0])
        lineCount += 1
        receiptItems.push(new Item(itemId, itemName, itemQty, itemPrice))
    }
    while(splitStr[lineCount].split(" :")[0] != "Total"){
        lineCount += 1
    }
    let totalArr = removeNextLine(splitStr[lineCount].split(" "))
    let receiptTotal = removeNextLine(totalArr[totalArr.length-1])
    let receiptInclusive = removeNextLine(splitStr[lineCount+2].split(" ")[1].split("%")[0])
    let receiptGst = removeNextLine(splitStr[lineCount+2].split(" ")[3])
    return new Receipt(shopName, shopTel, shopGstReg, receiptData, receiptTime, receiptId, receiptItems, receiptTotal, receiptInclusive, receiptGst)
}

function readReceipt(){
    let fs = require('fs');
    let filePath = 'quiz_sample_receipts/sample_receipt_2.txt'
    try {  
        var data = fs.readFileSync(filePath, 'utf8');
        // console.log(data);    
        return data
    } catch(e) {
        console.log('Error:', e.stack);
    }
}

function removeNextLine(input){
    if (input.includes("\r")){
        input = input.replace("\r","");
    }
    return input
}

function testLogic(){
    console.log(decodeReceipt(readReceipt()))

}


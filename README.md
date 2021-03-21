# exam_aimazing
![](https://github.com/worksB-collab/exam_aimazing/blob/master/er.jpg)
### 用戶登入
`POST` `http://34.80.168.87:3000/login`

* Body傳入參數：
```
{
	"username":"admin",    
	"password":"1234"  
}
```
* 結果：
```
{
    "result":0,
    "msg":{},
    "data":{
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjAzMjg0NjYwLCJleHAiOjE2MDMyODQ2OTB9.A1KZvbbMKxYX-fulXhRRgozwGsuJgLKe_S93hClhvA8"
            }
}
```
### 用戶登出
`POST` `http://34.80.168.87:3000/logout`

* Body傳入參數：
```
{
	"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjAzMjg0NjYwLCJleHAiOjE2MDMyODQ2OTB9.A1KZvbbMKxYX-fulXhRRgozwGsuJgLKe_S93hClhvA8"
}
```
* 結果：
```
{
    "result":0,
    "msg":{},
    "data":{}
}
```


### 讀取所有標籤
`GET` `http://34.80.168.87:3000/getAllTags`

* 結果：
```
{
    "result":0,
    "msg":{},
    "data":{
              [
                {
                  "tag_id" : 1,
                  "receipt_id" : 123456
                  "tag_name" : "new tag"
                },

                {
                  "tag_id" : 2,
                  "receipt_id" : 654213
                  "tag_name" : "receipts i created"
                }
              ]
           }
}
```

### 標籤新增
`POST` `http://34.80.168.87:3000/addTag`

* Body傳入參數：
```
{
  "receiptId : "1023456",
  "tag_name": "my first receipt"
}
```
* 結果：
```
{
    "result":0,
    "msg":{},
    "data":{}
}
```

### 標籤更新
`POST` `http://34.80.168.87:3000/updateTag`

* Body傳入參數：
```
{
	"receiptId : "1023456",
  "tag_name": "new tag"
}
```
* 結果：
```
{
    "result":0,
    "msg":{},
    "data":{}
}
```

### 由ID搜尋標籤
`POST` `http://34.80.168.87:3000/getTagById`

* Body傳入參數：
```
{
	"receiptId : "1023456",
}
```
* 結果：
```
{
    "result":0,
    "msg":{},
    "data":{
        "tag_name": "new tag"
           }
}
```

### 刪除標籤
`POST` `http://34.80.168.87:3000/deleteTag`

* Body傳入參數：
```
{
	"receiptId : "1023456",
}
```
* 結果：
```
{
    "result":0,
    "msg":{},
    "data":{}
}
```

### 上傳發票
`POST` `http://34.80.168.87:3000/uploadReceipt`

* Body傳入參數：
```
{
	"rescipt_content : "Bob's Store
                      Tel :0123456789
                      GST Reg.:0123456789

                      Date:13.06.2020  Time:20:11:09
                      Receipt ID:122769   
                      +----------------------------------------------+
                      8888196173423 Pokka Green Tea Jasmine 1.5L
                      1 x 2.20                                    2.20
                      9556404001156 Pepsi 1.5L
                      1 x 2.20                                    2.20
                      5000277001156 Dewars White Label 750ml
                      1 x 49.00                                  49.00

                      VISA          SubTotal:                    53.40
                      ITEMS(3)  QTY(3)
                      ------------------------
                      Total :            53.40
                      ------------------------
                      INCLUSIVE 7% GST 3.49
                      --- Thank You & Have A Nice Day ---",
  "rescipt_tag" : "uploaded receipt"
}
```
* 結果：
```
{
    "result":0,
    "msg":{},
    "data":{}
}
```

### 獲取所有發票資訊
`GET` `http://34.80.168.87:3000/getAllReceiptInfo`
* 結果：
```
{
    "result":0,
    "msg":{},
    "data":{
              "receipts" :
                          [{
                            "shopName" : "Bob's Store",
                            "shopTel" : "0123456789",
                            "shopGstReg" : "0123456789",
                            "receiptDate" : "13.06.2020",
                            "receiptTime" : "20:11:09",
                            "receiptId " : "122769",
                            "receiptTotal" : 53.40,
                            "receiptInclusive" : 7,
                            "receiptGst" : 3.49,
                            "receiptItems" : [
                                                {
                                                    "itemId" : 8888196173423,
                                                    "itemName" : Pokka Green Tea Jasmine 1.5L,
                                                    "itemQty" : 1,
                                                    "itemPrice" : 2.20
                                                },
                                                {
                                                    "itemId" : 9556404001156,
                                                    "itemName" : "Pepsi 1.5L",
                                                    "itemQty" : 1,
                                                    "itemPrice" : 2.20
                                                },
                                                {
                                                    "itemId" : 5000277001156,
                                                    "itemName" : "Dewars White Label 750ml",
                                                    "itemQty" : 1,
                                                    "itemPrice" : 49.00
                                                }
                                              ]

                            },
                            {
                            ...
                            }
            
            }
}
```

### 透過標籤獲取單筆發票資訊
`POST` `http://34.80.168.87:3000/getReceiptByTag`
* Body傳入參數：
```
{
	"tag_id : "1023456",
}
```
```
* 結果：
```
{
    "result":0,
    "msg":{},
    "data":{
              
              "shopName" : "Bob's Store",
              "shopTel" : "0123456789",
              "shopGstReg" : "0123456789",
              "receiptDate" : "13.06.2020",
              "receiptTime" : "20:11:09",
              "receiptId " : "122769",
              "receiptTotal" : 53.40,
              "receiptInclusive" : 7,
              "receiptGst" : 3.49,
              "receiptItems" : [
                                  {
                                      "itemId" : 8888196173423,
                                      "itemName" : Pokka Green Tea Jasmine 1.5L,
                                      "itemQty" : 1,
                                      "itemPrice" : 2.20
                                  },
                                  {
                                      "itemId" : 9556404001156,
                                      "itemName" : "Pepsi 1.5L",
                                      "itemQty" : 1,
                                      "itemPrice" : 2.20
                                  },
                                  {
                                      "itemId" : 5000277001156,
                                      "itemName" : "Dewars White Label 750ml",
                                      "itemQty" : 1,
                                      "itemPrice" : 49.00
                                  }
                                ]

            }
}
```

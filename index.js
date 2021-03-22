const decode = require("./decode.js");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const mysql = require("mysql");
const { json } = require("body-parser");
const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log("Listening on port"); 
});

var conn = mysql.createConnection({
  host: "34.80.168.87",
  user: "billy",
  password: "billy",
  database: "aimazing",
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("connect success!");
});

app.use(cors());
var jsonParser = bodyParser.json(); 

userSchema.pre('save', async function (next) {
  // this 指向目前正被儲存的使用者 document
  const user = this

  // 確認使用者的 password 欄位是有被變更：初次建立＆修改密碼都算
  if (user.isModified('password')) {
    // 透過 bcrypt 處理密碼，獲得 hashed password
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

userSchema.methods.generateAuthToken = async function () {
  // this 指向當前的使用者實例
  const user = this
  // 產生一組 JWT
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewproject')
  // 將該 token 存入資料庫中：讓使用者能跨裝置登入及登出
  user.tokens = user.tokens.concat({ token })
  await user.save()
  // 回傳 JWT
  return token
}

// User schema
const userSchema = new Schema({
  username:{
    type: String
  },
  password:{
    type: String
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
})

//登入
app.post("/login", (req, res) => {
    let user = req.body.username;
    let password = req.body.password;
    try {
      // 從 req.body 獲取驗證資訊，並在資料庫存與該用戶
      const user = await User.create(req.body)
      // 為該成功註冊之用戶產生 JWT
      const token = await user.generateAuthToken()
      // 回傳該用戶資訊及 JWT
      res.status(201).send({ user, token })
    } catch (err) {
      res.status(400).send(err)
    }
    conn.query(
      `SELECT* FROM Users WHERE user_username = "${user}"LIMIT 1;`,
      function (err, result, fields) {
        if (err) throw err;
        if (result.user_password == password) {
          console.log(result);
          res.json(result);
        }
        res.json("wrong username or password");
      }
    );
  });

  //登出
  app.post("/logout", (req, res) => {
    let user = req.body.token;
    const token = req.header('Authorization').replace('Bearer ', '')
  });

//get所有標籤
app.get("/getAllTags", (req, res) => {
  conn.query(`SELECT * FROM Tags;`, function (err, result, fields) {
    if (err) throw err;
    if (result.isEmpty()) {
      res.json("there is no such recipt");
    } else {
      res.json(result);
    }
  });
});

//用reciept id找標籤
app.post("/getTagById", (req, res) => {
  let rescipt_id = req.body.rescipt_id;
  conn.query(
    `SELECT * FROM Tags WHERE receipt_id = "${rescipt_id}"LIMIT 1;`,
    function (err, result, fields) {
      if (err) throw err;
      if (result.isEmpty()) {
        res.json("there is no such recipt");
      } else {
        res.json(result.tag_id);
      }
    }
  );
});

//新增標籤
app.post("/addTag", (req, res) => {
  let rescipt_id = req.body.rescipt_id;
  let tag_name = req.body.tag_name;
  conn.query(
    `SELECT * FROM Tags WHERE receipt_id = "${rescipt_id}"LIMIT 1;`,
    function (err, result, fields) {
      if (err) throw err;
        if (result.tag_name == ""){
            conn.query(
                `INSERT INTO Tags (receipt_id, tag_name) VALUES ( "${rescipt_id}", "${tag_name}" )LIMIT 1;`,
                function (err, result, fields) {
                  if (err) throw err;
                  res.json(result);
                }
              );
        }else{
            res.json("tag already existed");
        }
            
        }
  );
});

//更新標籤
app.patch("/updateTag", (req, res) => {
  let receipt_id = req.body.rescipt_id;
  let tag_name = req.body.tag_name;
        conn.query(
          `UPDATE Tags SET settag_name = "${tag_name}" WHERE receipt_id = "${receipt_id}" LIMIT 1;`,
          function (err, result, fields) {
            if (err) throw err;
            res.json(result);
          }
        );
});

//刪除標籤
app.delete("/deleteTag", (req, res) => {
  let receipt_id = req.body.rescipt_id;
  conn.query(
    `UPDATE Tags SET tag_name = "" WHERE receipt_id = "${receipt_id}";`,
    function (err, result, fields) {
      if (err) throw err;
      res.json(result);
    }
  );
});

//上傳發票
app.post("/uploadReceipt", (req, res) => {
    let rescipt_content = req.body.rescipt_content;
    let rescipt_tag = req.body.rescipt_tag;
  let decodedContent = decode.decodeReceipt(rescipt_content);
  let shop_id = ""
  conn.query(
    `SELECT shop_id FROM Shops WHERE shop_name = "${rescipt_content.shopName}"LIMIT 1;`,
    function (err, result, fields) {
      if (err) throw err;
      if (result.isEmpty()) {
        conn.query(
            `INSERT INTO Shops (shope_name, shop_tel , shop_GST_Reg) VALUES ( "${decodedContent.shopName}", "${decodedContent.shopTel}", "${decodedContent.shopGstReg}" )LIMIT 1;`,
            function (err, result, fields) {
              if (err) throw err;
              conn.query(
                `SELECT shop_id FROM Shops WHERE shop_name = "${rescipt_content.shopName}"LIMIT 1;`,function (err, result, fields) {
                    shop_id = result.shop_id
                });
            }
          );
      } else {
        shop_id = result.shop_id
      }
      conn.query(
        `INSERT INTO Receipts (receipt_id, receipt_date, receipt_time, receipt_inclusive, receipt_gst, receipt_total) VALUES ( "${decodedContent.receiptId}","${decodedContent.receiptDate}", "${decodedContent.receiptTime}", "${decodedContent.receiptInclusive}", "${decodedContent.receiptGst}", "${decodedContent.receiptTotal}" )LIMIT 1;`,
        function (err, result, fields) {
          if (err) throw err;
          res.json(result);
        }
      );
      for(let i = 0 ; i< decodedContent.receiptItems.length ; i ++){
          let item = decodedContent.receiptItems[i]
        conn.query(
            `INSERT INTO Items (item_id, receipt_id, item_name, item_price, item_quantity) VALUES ( "${item.item_id}","${item.itemName}", "${item.itemQty}", "${item.itemPrice}" )LIMIT 1;`,
            function (err, result, fields) {
              if (err) throw err;
              res.json(result);
            }
          );
      }
      conn.query(
        `INSERT INTO Tags (receipt_id, tag_name) VALUES ( "${decodedContent.receiptId}","${rescipt_tag}")LIMIT 1;`,
        function (err, result, fields) {
          if (err) throw err;
          res.json(result);
        }
      );
      
    })
});

//get 所有發票資訊
app.get("/getAllReceiptInfo", (req, res) => {
    conn.query(`SELECT * FROM Receipts;`, function (err, result, fields) {
      if (err) throw err;
      if (result.isEmpty()) {
        res.json("there is no recipt");
      } else {
          let receipts = []
        for (let i = 0 ; i < result.length ; i ++){
            let shopId = result.shop_id
            let receiptId = result.receipt_id
            let receiptDate = result.receipt_date
            let receiptTime = result.receipt_time
            let receiptTotal = result.receipt_total
            let receiptInclusive = result.receipt_inclusive
            let receiptGst = result.receipt_gst
            let shopName = ""
            let shopTel = ""
            let shopGst = ""
            let items = []
            conn.query(`SELECT * FROM Shops WHERE shop_id = "${shopId}";`, function (err, result, fields) {
                if (err) throw err;
                shopName = result.shop_name
                shopTel = result.shop_tel
                shopGst = result.shop_GST_Reg
            })
            conn.query(`SELECT * FROM Items WHERE receipt_id = "${receipt_id}";`, function (err, result, fields) {
                if (err) throw err;
                for(let j = 0 ; j < result.length ; j ++){
                    let itemId = result[i].itemId
                    let itemName = result[i].itemName
                    let itemQty = result[i].itemQty
                    let itemPrice = result[i].itemPrice
                    items.push(new decode.Item(itemId, itemName, itemQty, itemPrice))
                }
            })
            let receipt = new decode.Receipt(shopName, shopTel, shopGstReg, receiptDate, receiptTime, receiptId, receiptItems, receiptTotal, receiptInclusive, receiptGst)
            receipts.push(receipt)
        }
        res.json(receipts);
      }
    });
  });

//find receipt by tag
app.post("/getReceiptByTag", (req, res) => {
    
    let tag_name = req.body.tag_name;
    conn.query(
      `SELECT * FROM Tags WHERE tag_name = "${tag_name}"LIMIT 1;`,
      function (err, result, fields) {
        if (err) throw err;
        if (result.isEmpty()) {
          res.json("there is no such recipt");
        } else {
            let rescipt_id = result.rescipt_id;
            conn.query(`SELECT * FROM Receipts WHERE rescipt_id = "${rescipt_id}";`, function (err, result, fields) {
                if (err) throw err;
                let shopId = result.shop_id
                let receiptId = result.receipt_id
                let receiptDate = result.receipt_date
                let receiptTime = result.receipt_time
                let receiptTotal = result.receipt_total
                let receiptInclusive = result.receipt_inclusive
                let receiptGst = result.receipt_gst
                let shopName = ""
                let shopTel = ""
                let shopGst = ""
                let items = []
                conn.query(`SELECT * FROM Shops WHERE shop_id = "${shopId}";`, function (err, result, fields) {
                    if (err) throw err;
                    shopName = result.shop_name
                    shopTel = result.shop_tel
                    shopGst = result.shop_GST_Reg
                })
                conn.query(`SELECT * FROM Items WHERE receipt_id = "${receipt_id}";`, function (err, result, fields) {
                    if (err) throw err;
                    for(let j = 0 ; j < result.length ; j ++){
                        let itemId = result[i].itemId
                        let itemName = result[i].itemName
                        let itemQty = result[i].itemQty
                        let itemPrice = result[i].itemPrice
                        items.push(new decode.Item(itemId, itemName, itemQty, itemPrice))
                    }
                })
                let receipt = new decode.Receipt(shopName, shopTel, shopGstReg, receiptDate, receiptTime, receiptId, receiptItems, receiptTotal, receiptInclusive, receiptGst)
                res.json(receipt)
            })
        }
      }
    );
  });
  
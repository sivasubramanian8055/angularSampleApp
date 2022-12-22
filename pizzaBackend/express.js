var express = require('express');
var cors = require('cors')
var mongodb = require('mongodb');
var bodyParser = require('body-parser');

var server = express();
var url = "mongodb://localhost:27017/";

var dbname = "pizzaComp";

var expressAsClient = mongodb.MongoClient;
server.use(bodyParser.urlencoded({
    extended: true
}))
server.use(bodyParser.json());
server.use(cors())

server.get("/getMenu", (request, response) => {
    expressAsClient.connect(url, (error, status) => {
        var db = status.db(dbname);
        var menuInfo;
        db.collection("menu").find({}).toArray((error, data) => {
            menuInfo = data;
            response.send(menuInfo);
        })
    })
})

server.get("/getIngridents", (request, response) => {
    expressAsClient.connect(url, (error, status) => {
        var db = status.db(dbname);
        var addOns;
        db.collection("ingridents").find({}).toArray((error, data) => {
            addOns = data;
            response.send(addOns);
        })
    })
})

server.post("/addUser", (request, response) => {
    var body = request.body;
    expressAsClient.connect(url, (error, status) => {
        var db = status.db(dbname);
        db.collection("user").insertOne(body, (err, data) => {
            if (err) {
                response.send("Problem in creating user");
            } else {
                db.collection('user').createIndex({userName: 1}, {unique: 1})
                var newShoppingCart = {
                    userName: body.userName,
                    items: []
                }
                db.collection("userCartDetails").insertOne(newShoppingCart, (err, data) => {
                    if (err) {
                        response.send("Problem in creating user");
                    } else {
                        db.collection('userCartDetails').createIndex({userName: 1}, {unique: 1})
                        response.send("user created successfully");
                    }
                })
            }
        })
    })
})

server.post("/validateUser", (request, response) => {
    var body = request.body;
    expressAsClient.connect(url, (error, status) => {
        var db = status.db(dbname);
        db.collection("user").findOne({
            'userName': body.userName
        }, function (err, doc) {
            userDetail = doc;
            if (!doc) {
                response.send("Incorrect user name");
            } else {
                if (userDetail.password === body.password) {
                    response.send("validation sucessfull");
                } else {
                    response.send("Incorrect password");
                }
            }
        });
    })
})

server.post("/findShopingCart", (request, response) => {
    var body = request.body;
    expressAsClient.connect(url, (error, status) => {
        var db = status.db(dbname);
        db.collection("userCartDetails").findOne({
            'userName': body.userName
        }, function (err, doc) {
            response.send(doc);
        });
    })
})

server.post("/addItemInShopingCart", (request, response) => {
    var body = request.body;
    expressAsClient.connect(url, (error, status) => {
        var db = status.db(dbname);
        db.collection("userCartDetails").findOne({
            'userName': body.userName
        }, function (err, doc) {
            if (!doc) {
                response.send("cart not found")
            } else {
                db.collection("userCartDetails").updateOne({
                        'userName': body.userName
                    }, {
                        $set: {
                            items: [...doc.items, ...body.pizzas],
                        }
                    },
                    function (err, res) {
                        if (err) throw err;
                        response.send("1 document updated");
                    }
                );
            }
        });
    })
})

server.post("/modifyItemsCount", (request, response) => {
    var body = request.body;
    expressAsClient.connect(url, (error, status) => {
        var db = status.db(dbname);
        db.collection("userCartDetails").updateOne({
                'userName': body.userName,
                "items.id": body.pizzaId
            }, {
                $set: {
                    "items.$.quantity": body.quantity
                }
            },
            function (err, res) {
                if (err) throw err;
                response.send("1 document updated");
            }
        )
    })
})

server.post("/deleteItemsFromCart", (request, response) => {
    var body = request.body;
    expressAsClient.connect(url, (error, status) => {
        var db = status.db(dbname);
        db.collection("userCartDetails").updateMany(
            {'userName': body.userName},
            {"$pull":{"items":{"id":{$in:body.pizzaIds}}}},
            function(err, res) {
                if (err) throw err;
                response.send("1 document updated");
              }
          )
    })
})

server.listen(3200, () => {
    console.log("express server to listen at port 3200 ")
});
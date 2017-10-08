import Swagger from 'swagger-client';
import config from '../../config/config.json';
import fs from 'fs';
import spec from '../../static/sg/sync-gateway-public-1-4_public.json';
import {v4} from 'uuid';

spec.host = config.couchbase.sync_server;
let client;
new Swagger({
    spec: spec,
    usePromise: true
}).then(function (res) {
    client = res;
    // Start getting changes at seq: 0
   /* getChanges(0);

    function getChanges(seq) {
        // Use the Swagger client to connect to the changes feed
        //filter: 'sync_gateway/bychannel',
        //channels: 'notification',
        client.apis.database.get__db___changes({
            db: 'risto',
            include_docs: true,
            active_only: true,
            since: seq,
            feed: 'longpoll',
            timeout: 0
        })
            .then(function (val) {
                const results = val.obj.results;
                console.log(results.length + ' change(s) received');
                processChanges(results);
                getChanges(val.obj.last_seq);
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    function processChanges(results) {
        let doc;
        for (let i = 0; i < results.length; i++) {
            doc = results[i].doc;
            console.log(doc);
        }
        return doc;
    }*/
});

const appRouter = function (app) {

    app.get('/api/sync/change', function (req, res) {
        //res.end('ciao');
       /* getChanges(0);

        function getChanges(seq) {
            // Use the Swagger client to connect to the changes feed
            //filter: 'sync_gateway/bychannel',
            //channels: 'notification',
            client.apis.database.get__db___changes({
                db: 'risto',
                include_docs: true,
                active_only: true,
                since: seq,
                feed: 'longpoll',
                timeout: 0
            })
                .then(function (val) {
                    const results = val.obj.results;
                    console.log(results.length + ' change(s) received');
                    res.json(processChanges(results));
                    getChanges(val.obj.last_seq);
                })
                .catch(function (err) {
                    console.log(err);
                });
        }

        function processChanges(results) {
            let doc;
            for (let i = 0; i < results.length; i++) {
                doc = results[i].doc;
                //console.log(doc);
            }
            return doc;
        }*/
    });
    app.get('/api/sync/room/create', function (req, res) {
        let body = {
            "_id": "Room::" + v4(),
            "type": "Room",
            "name": "Room 1",
            "display": "Attico",
            "rgb": [0, 0, 0],
            "image": "",
            "tables": ["Table::" + v4(), "Table::" + v4()]
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });
    app.get('/api/sync/macro/create', function (req, res) {
        let type = 'Macro';
        let body = {
            "_id": type + "::" + v4(),
            "type": type,
            "name": "cibo",
            "display": "Mangiare",
            "rgb": [0, 0, 0],
            "image": "",
            "categories": []
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });

    app.get('/api/sync/category/create', function (req, res) {
        let type = 'Category';
        let body = {
            "_id": type + "::" + v4(),
            "type": type,
            "name": "primi",
            "display": "Primi Piatti",
            "rgb": [0, 0, 0],
            "image": "",
            "macrocategory": "",
            "products": [],
            "variants": []
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });

    app.get('/api/sync/get/tables', function (req, res) {
        client.apis.query.get__db___design__ddoc___view__view_({
            db: config.couchbase.sync_db,
            ddoc: "tables",
            view: "all",
            stale: "false"
        }).then(function (userRes) {
            console.log(userRes)
            res.send(userRes);
        }).catch(function (err) {
            console.log(err);
        });
        //res.end()
    });

    app.get('/api/sync/product/create', function (req, res) {
        let type = 'Product';
        let body = {
            "_id": type + "::" + v4(),
            "type": type,
            "name": "spag-scoglio",
            "display": "Spaghetti allo Scoglio",
            "rgb": [0, 0, 0],
            "image": "",
            "category": "Category::80e7f07c-beaa-42aa-98ca-5ed4d701da09",
            "variants": [],
            "vat_department_id": "VAT::3b4e95f1-31de-426e-947c-22ff08151828",
            "price": ["Catalog::" + v4(), 4000]
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });

    app.get('/api/sync/variant/create', function (req, res) {
        let type = 'Variant';
        let body = {
            "_id": type + "::" + v4(),
            "type": type,
            "name": "salpicc",
            "display": "Salamino Piccante",
            "rgb": [0, 0, 0],
            "image": "",
            "category": "",
            "price": ["Catalog::9bf9feb7-13c8-426d-a7f9-b0fa2cc5f8d1", 2000]
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });

    app.get("/api/sync/table/create", function (req, res) {
        let body = {
            "_id": "Table::" + v4(),
            "type": "Table",
            "name": "Table 4",
            "display": "Tavolo Interno",
            "rgb": [0, 0, 0],
            "image": "",
            "Room": "Room::143be1d0-5bf4-4b53-9836-5abe377a99dc"
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });

    app.get("/api/sync/table/bulk_create", function (req, res) {
        let img = fs.readFileSync('./static/imgs/tavolo.png');
        let tavolo = img.toString('base64');
        let img2 = fs.readFileSync('./static/imgs/tavolo2.png');
        let tavolo2 = img2.toString('base64');
        let body = {
            "docs": [
                {
                    "_id": "Table::76e6e4ea-7d00-4999-a75d-aeb46ffe5702",
                    "type": "Table",
                    "name": "Table 1",
                    "display": "Tavolo Grande",
                    "rgb": [0, 0, 0],
                    "image": "",
                    "Room": "Room::1d633c4c-5a24-4632-add8-eddb94ecc434",
                    "_attachments" : {
                        "tavolo_vuoto": {
                            "content_type": 'image\/png',
                            "data": tavolo
                        },
                        "tavolo_pieno": {
                            "content_type": 'image\/png',
                            "data": tavolo2
                        }
                    }
                }, {
                    "_id": "Table::6f5e484d-8e4f-41e6-9c68-40fc728e4eb0",
                    "type": "Table",
                    "name": "Table 2",
                    "display": "Tavolo Esterno",
                    "rgb": [0, 0, 0],
                    "image": "",
                    "Room": "Room::1d633c4c-5a24-4632-add8-eddb94ecc434",
                    "_attachments" : {
                        "tavolo_vuoto": {
                            "content_type": 'image\/png',
                            "data": tavolo
                        },
                        "tavolo_pieno": {
                            "content_type": 'image\/png',
                            "data": tavolo2
                        }
                    }
                },
                {
                    "_id": "Room::1983e957-11aa-4250-89c6-cfa2e0bb7aa2",
                    "type": "Room",
                    "name": "Room 1",
                    "display": "Attico",
                    "rgb": [0, 0, 0],
                    "image": "",
                    "tables": ["Table::76e6e4ea-7d00-4999-a75d-aeb46ffe5702", "Table::6f5e484d-8e4f-41e6-9c68-40fc728e4eb0"]
                }
            ]
        };
        client.apis.database.post__db___bulk_docs({
            db: config.couchbase.sync_db,
            BulkDocsBody: body
        }).then(function (userRes) {
            res.json(userRes);
        }).catch(function (err) {
            console.log(err);
            res.send("error");
        });
    });

    app.get("/api/sync/table/bulk_get", function (req, res) {
        let body = {
            "docs": [
                {
                    "id": "User::dalborgo2"
                }
            ]
        };
        client.apis.database.post__db___bulk_get({
            db: config.couchbase.sync_db,
            BulkGetBody: body,
            attachments: false
        }).then(function (userRes) {
            //res.set('Content-Type', 'application/json');
            res.send(new Buffer(userRes.text).toString());
        }).catch(function (err) {
            console.log(err);
            res.send("error");
        });
    });


    app.get("/api/sync/table/image", function (req, res) {
        client.apis.attachment.get__db___doc___attachment_({
            db: config.couchbase.sync_db,
            doc: "User::dalborgo2",
            attachment: "image"
        }).then(function (userRes) {
            res.end(userRes.data);
        }).catch(function (err) {
            console.log(err);
            res.send("error");
        });
    });

    app.get("/api/sync/user/create", function (req, res) {
        let type = "User";
        let body = {
            "_id": type + "::dalborgo",
            "type": type,
            "name": "Marco",
            "surname": "Dal Borgo",
            "user": "dalborgo",
            "password": "12345",
            "big_image": "",
            "small_image": "",
            "role": "administrator"
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes);
        }).catch(function (err) {
            console.log(err);
        });
        res.send(body)
    });
    app.post("/api/sync/user/create", function (req, res) {
        let post = req.body;
        let type = "User";
        let body = {
            "_id": type + "::" + post.user,
            "type": type,
            "name": "Marco",
            "surname": "Dal Borgo",
            "user": post.user,
            "password": post.password,
            "big_image": "",
            "small_image": "",
            "role": "administrator"
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            res.json(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        //res.send(body)
    });
};
module.exports = appRouter;
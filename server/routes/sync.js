import Swagger from 'swagger-client';
import config from '../../config/config.json';
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
        client.apis.database.get__db___changes({db: 'risto', include_docs: true, active_only:true, since: seq, feed: 'longpoll', timeout: 0})
            .then(function (res) {
                const results = res.obj.results;
                console.log(results.length + ' change(s) received');
                processChanges(results);
                getChanges(res.obj.last_seq);
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    function processChanges(results) {
        for (let i = 0; i < results.length; i++) {
            const doc = results[i].doc;
            console.log(doc);
        }
    }*/
});

const appRouter = function (app) {

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

    app.get("/api/sync/table/create", function (req, res) {
        let body = {
            "_id": "Table::"+v4(),
            "type": "Table",
            "name": "Table 3",
            "display": "Tavolo Esterno 2",
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
        let body = {
            "docs": [
                {
                    "_id": "Table::76e6e4ea-7d00-4999-a75d-aeb46ffe5702",
                    "type": "Table",
                    "name": "Table 1",
                    "display": "Tavolo Grande",
                    "rgb": [0, 0, 0],
                    "image": "",
                    "Room": "Room::1d633c4c-5a24-4632-add8-eddb94ecc434"
                }, {
                    "_id": "Table::6f5e484d-8e4f-41e6-9c68-40fc728e4eb0",
                    "type": "Table",
                    "name": "Table 2",
                    "display": "Tavolo Esterno",
                    "rgb": [0, 0, 0],
                    "image": "",
                    "Room": "Room::1d633c4c-5a24-4632-add8-eddb94ecc434"
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
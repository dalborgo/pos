import Swagger from 'swagger-client';
import config from '../../config/config.json';
import {v4} from 'uuid';

let client = new Swagger({
    url: config.spec,
    usePromise: true
}).then(function (res) {
    client = res;
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
        client.apis.document.post({db: "risto", body: body}).then(function (userRes) {
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
            "name": "Table 1",
            "display": "Tavolo Grande",
            "rgb": [0, 0, 0],
            "image": "",
            "Room": "Room::1e338d37-e405-4007-be8b-9dadcf767411"
        };
        client.apis.document.post({db: "risto", body: body,channels:"prova"}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });

};
module.exports = appRouter;
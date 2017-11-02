/*var bcrypt = require("bcryptjs");
var UserModel = require("../models/user");*/
import {bucket} from "../server";

const appRouter = function (app) {
    app.get("/api/sync/table/multi", function (req, res) {
        bucket.getMulti(['Table::0dbae660-79cb-4a58-bf09-e4d751cc4536', 'Table::6f5e484d-8e4f-41e6-9c68-40fc728e4eb0'], function (errors, results) {
            if (errors > 0) {
                res.writeHead(500);
                res.end();
            } else {
                const rants = [];
                for (let i in results) {
                    const result = results[i];
                    if (result.value)
                        rants.push(result.value);
                }
                res.json(rants); // write the rants array to the response
            }

        });
    });
    app.post("/api/set/var", function (req, res) {

    });
    app.post("/api/get/var", function (req, res) {
        bucket.get(req.body.variable,function (err, r) {
            res.json(r)
        })
    });

};

module.exports = appRouter;
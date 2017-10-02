import SourceMapSupport from 'source-map-support';
SourceMapSupport.install();
import 'babel-polyfill';
import couchbase from 'couchbase';
import ottoman from 'ottoman';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import config from '../config/config.json';

const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const CouchbaseStore = require('connect-couchbase')(session);
const couchbaseStore = new CouchbaseStore({
    bucket: config.couchbase.bucket,               //optional
    host: config.couchbase.server,          //optional
    prefix: 'Sess|'
    //ttl: 84400 in secondi
});

app.use(session({
    store: couchbaseStore,
    secret: config.salt,
    cookie: {maxAge: 24 * 60 * 60 * 1000},
    resave: true,
    saveUninitialized: true //stay open for 1 day of inactivity
}));

const myBucket = (new couchbase.Cluster(config.couchbase.server)).openBucket(config.couchbase.bucket);
ottoman.store = new ottoman.CbStoreAdapter(myBucket, couchbase);
module.exports.store = new ottoman.CbStoreAdapter(myBucket, couchbase);

couchbaseStore.on('connect', function () {
    //console.log("Couchbase Session store is ready for use");
});

app.use(cookieParser());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const user = require("./routes/table_room")(app);

ottoman.store = module.exports.store;

ottoman.ensureIndices(function (error) {
    if (error) {
        console.log(error);
    }
    const server = app.listen(3000, function () {
        console.log("Listening on port %s...", server.address().port);
    });

});
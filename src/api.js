//import 'whatwg-fetch';
import config from '../config/config.json';
export default class api {
    constructor(){
        this.url = `http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}`
    }
    getTable(id) {
        return fetch(this.url + '/' + id, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json());
    }
    deleteTable(doc) {
        return fetch(this.url + '/' + doc._id + '/?rev=' + doc._rev, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json());
    }
};


import escpos from 'escpos';
import moment from 'moment'
import config from '../config/config.json';
import couchbase from 'couchbase';

moment.locale('it');
import _ from 'underscore'

const url = `http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}`;
// 33 chars type a
// 42 chars type b
function getDoc(id) {
    return fetch(url + '/' + id, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => res.json());
}

function updateDoc(doc) {
    return fetch(url + '/' + doc._id + '?new_edits=true&rev=' + doc._rev, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(doc)
    }).then(
        (res) => res.json()
    );
}

function updateStatusPrint(order, exit) {
    return getDoc(order._id).then(
        res => {
            res.entries = _.each(res.entries, f => f.print_status = 'printed');
            res.exits = _.each(res.exits, f => f.status = (f.exit === exit) ? 'printed' : f.status);
            return updateDoc(res);
        }
    )
}

function al(s, d, t = 42) {
    let ns = t - s.length - d.length;
    let sp = '';
    for (let i = 0; i < ns; i++) {
        sp += ' ';
    }
    return s + sp + d;
}

const myBucket = (new couchbase.Cluster(config.couchbase.server)).openBucket(config.couchbase.bucket);
export default function (p) {
    //const device = new escpos.Network(config.printer.ip);
    p.doc.status='ACCEPTED';
    //updateDoc(p.doc);
    const device = new escpos.Console();
    const printer = new escpos.Printer(device);
    device.open(function () {
        printer
            .encode('850')
            .font('B')
            .align('ct')
            .text(p.id).flush();
        console.log('PRINTED');
        const order = p.doc.order;
        const exit = p.doc.exit;
        // console.log(order);
        updateStatusPrint(order, exit).then(r => console.log(r));
    });
    printer.close();

};

//module.exports.stampa = stampa;

/*   const obj = {
       data: moment(new Date()).format('llll').toUpperCase(),
       az: 'Asten Srl',
       user: 'borgo',
       prod: 'Miscellaneous',
       quant: '1.000',
       costo: '18.00',
       subtotale: '18.00',
       total: '18.00',
       cash: '20.00',
       change: '2.00'
   };
   /!*device.open(function () {
       printer
           .encode('850')
           .font('A')
           .align('lt')
           .text('123456789012345678901234567890123')
           .font('B')
           .text('123456789012345678901234567890123456789012')
           .flush();
   })*!/
   device.open(function () {
       printer
           .encode('850')
           .font('B')
           .align('ct')
           .text(obj.data)
           .align('lt')
           .text(obj.az).text(obj.user)
           .text(al(obj.prod, obj.quant + '      ' + obj.costo))
           .text(al('Subtotal:', obj.subtotale)).size(1, 2).font('B').text(al('Total:', obj.total)).size().font('B')
           .text(al('Cash (EUR)', obj.cash))
           .text(al('Change:', obj.change)).flush()
   });*/



import escpos from 'escpos';
import moment from 'moment'
import config from '../config/config.json';
import couchbase from 'couchbase';

const N1qlQuery = couchbase.N1qlQuery;
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

function updateStatusAll(order, exit, status) {
    return getDoc(order._id).then(
        res => {
            res.entries = _.each(res.entries, f => f.print_status = status);
            res.exits = _.each(res.exits, f => f.status = f.exit === exit ? status : f.status);
            return updateDoc(res);
        }
    )
}
function updateStatusPrint(order, exit, status, lista) {
    return getDoc(order._id).then(
        res => {
            res.entries = _.each(res.entries, f => f.print_status = lista.indexOf(f.product_id) >= 0 ? status : f.print_status);
            res.exits = _.each(res.exits, f => f.status = f.exit === exit ? status : f.status);
            //console.log(res)
            return updateDoc(res);
        }
    )
}

function getPrinter(ord, exit) {
    const query = N1qlQuery.fromString("SELECT r.ip, r.name, t product_category FROM "+config.couchbase.sync_db+" r UNNEST categories t where r._type='Stampante'");

    myBucket.query(query, function (err, prn) {
        //console.log(rows)
        let res = [];
        //console.log(prn)
        ord.entries.forEach(function (p) {
            let r = _.where(prn, {"product_category": p.product_category});
            r.forEach(function (s) {
                if (res[s.ip])
                    res[s.ip].push({name: p.product_name, id: p.product_id, stampante: s.name});
                else {
                    res[s.ip] = [];
                    res[s.ip].push({name: p.product_name, id: p.product_id, stampante: s.name})
                }
            })
        });
        //console.log(res)
        for (let pr in res) {
            console.log(pr);
            print(ord,exit,res[pr],pr)
        }
    });
}

function al(s, d, t = 42) {
    let ns = t - s.length - d.length;
    let sp = '';
    for (let i = 0; i < ns; i++) {
        sp += ' ';
    }
    return s + sp + d;
}

function print(order, exit,p,ip) {
    //const device = new escpos.Network(ip);
    const device = new escpos.Console();
    const printer = new escpos.Printer(device);

    let printed = [];
    device.open(function () {
        printer
            .encode('850')
            .font('B')
            .align('ct');
        let out='';
        p.forEach(a=>{
           console.log(a.stampante);
           console.log(a.name);
           printed.push(a.id);
           printer.text(a.name);
        });
        printer.flush();
        console.log('PRINTED');
        console.log(printed);
        updateStatusPrint(order, exit, 'PRINTED', printed).then(r => console.log(r));
    });
    printer.close();
}

const myBucket = (new couchbase.Cluster(config.couchbase.server)).openBucket(config.couchbase.bucket);
export default function (p) {

    //p.doc.status='ACCEPTED';
    const order = p.doc.order;
    const exit = p.doc.exit;
    console.log('ACCEPTED');
    updateStatusAll(order, exit, 'ACCEPTED').then(r => {
        console.log(r);
        getPrinter(order, exit);
    });

    //console.log('balumba '+prn);
    //updateDoc(p.doc);
    //print(order,exit)


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



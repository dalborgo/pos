import React from 'react';
import 'whatwg-fetch';
import {v4} from 'uuid';
import Swagger from 'swagger-client';
import config from '../config/config.json';
import spec from '../static/sg/sync-gateway-public-1-4_public.json';

spec.host = config.couchbase.sync_server;

const Table = (props) => (
    <div><img src={`http://${config.couchbase.sync_server_public}/risto/${props.tables.id}/tavolo_vuoto`} /><br/>{props.tables.value.name}</div>
);

function Container(props) {
    let Tables = props.tables.map(tab => <Table key={tab.id} tables={tab}/>);
    return (
        <div>{Tables}</div>
    );
}


export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = {tables: []};
        this.handleSubmit = this.handleSubmit.bind(this);
        //this.createIssue = this.createIssue.bind(this);
    }

    componentDidMount() {
      //  this.loadData();
        let processChanges = (results) => {
            let arr=[];
            let cont=0;
            for (let i = 0; i < results.length; i++) {
                const doc = results[i].doc;
                if(doc.type==='Table')
                    arr[cont++]=doc;
            }
            console.log(arr)
                if(arr.length > 0)
                    this.loadData();
            //this.setState({tables: arr});
        };
        let client;

        new Swagger({
            spec: spec,
            usePromise: true
        }).then(function (res) {
            client = res;
            // Start getting changes at seq: 0
            getChanges(0);

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
        });
        //console.log('dopo')
    }

    loadData() {
        fetch('/api/sync/get/tables', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            if (response.ok) {
                response.json().then(val => {
                    console.log(val.obj.rows);
                    this.setState({tables: val.obj.rows});
                });
            } else {
                response.json().then(error => {
                    alert("Failed to add issue: " + error.message)
                });
            }
        }).catch(err => {
            alert("Error in sending data to server: " + err.message);
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let form = document.forms.issueAdd;
        this.createIssue({
            user: form.user.value,
            password: form.password.value
        });
        form.user.value = "";
        form.password.value = "";
    }

    render() {
        return (
            <div>
                <Container tables={this.state.tables}/>
                {/*<div>
                    <form name="issueAdd" onSubmit={this.handleSubmit}>
                        <input type="text" name="user" placeholder="User" />
                        <input type="text" name="password" placeholder="Password" />
                        <button>Add</button>
                    </form>
                </div>*/}
            </div>

        );
    }
}
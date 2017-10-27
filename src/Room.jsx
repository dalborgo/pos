import React from 'react';
//import 'whatwg-fetch';
import {v4} from 'uuid';
import Swagger from 'swagger-client';
import config from '../config/config.json';
import request from 'request';
import GridListExampleSingleLine from './GridListExampleSingleLine.jsx';
import spec from '../static/sg/sync-gateway-public-1-4_public.json';
import api from './api'

const a = new api();
const poll = {
    longpoll: function (that) {
        function getChanges(seq) {
            console.log('seq %s', seq)
            let url = `http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}`;
            fetch(url + `/_changes?include_docs=true&feed=longpoll&filter=sync_gateway/bychannel&channels=tables&since=${seq}`, {})
                .then((res) => res.json())
                .then((res) => {
                    let m = res.results;
                    console.log('Tavoli ' + m.length);
                    if (m.length > 0) {
                        console.log('CARICA2')
                        that.loadData(false);
                    }
                    getChanges(res.last_seq);
                });
        }

        fetch('/api/table/get/var', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({variable:'_sync:seq'}),
        }).then((res) => res.json()).then(res=>
            {
                getChanges(res.value);
            }
        );
    },
    longpoll2: function (that) {
        const sync_gateway_url = `http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}/`;
        getChanges(0);

        function getChanges(seq) {
            console.log('seq %s', seq)
            const querystring = 'feed=longpoll&filter=sync_gateway/bychannel&channels=Tables&timeout=0&since=' + seq;
            const options = {
                url: sync_gateway_url + '_changes?' + querystring
            };
            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    const json = JSON.parse(body);
                    let m = json.results;
                    //let res2 = m.map((row) => row);
                    console.log('Tavoli ' + m.length);
                    if (m.length > 0)
                        that.loadData();
                    getChanges(json.last_seq);
                }
            });
        }
    }
};

//spec.host = config.couchbase.sync_server;

const Table = (props) => (
    <div><img
        src={`http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}/${props.tables.id}/tavolo_vuoto_100`}/><br/>{props.tables.value.name}
    </div>
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
    }

    componentWillMount() {
        console.log('CARICA')
        poll.longpoll(this);
        this.loadData('');
    }

    loadData(stale) {
       a.getView('tables','all',stale).then(
           (res)=>{
               console.log(res);
               this.setState({tables: res.rows});
           }
       )
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
                <GridListExampleSingleLine tables={this.state.tables}/>
            </div>

        );
    }
}
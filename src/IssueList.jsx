import React from 'react';
import 'whatwg-fetch';
import { v4 } from 'uuid';

export default class IssueList extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <h1>Ciao a Tutti {v4()} </h1>
            </div>
        );
    }
}
import React from 'react';
import 'whatwg-fetch';
import {v4} from 'uuid';

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createIssue = this.createIssue.bind(this);
    }

    createIssue(newIssue) {
        fetch('/api/sync/user/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newIssue),
        }).then(response => {
            if (response.ok) {
                response.json().then(updatedIssue => {
                    console.log(updatedIssue);
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
        form.user.value = ""; form.password.value = "";
    }
    render() {
        return (
            <div>
                <h1>Ciao a Tutti {v4()} </h1>
                <div>
                    <form name="issueAdd" onSubmit={this.handleSubmit}>
                        <input type="text" name="user" placeholder="User" />
                        <input type="text" name="password" placeholder="Password" />
                        <button>Add</button>
                    </form>
                </div>
            </div>

        );
    }
}
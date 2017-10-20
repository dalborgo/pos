import React from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    NavItem, Glyphicon, Modal, Form, FormGroup, FormControl, ControlLabel,
    Button, ButtonToolbar
} from 'react-bootstrap';

import Toast from './Toast.jsx';

class IssueAddNavItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showing: false,
            init: false,
            toastVisible: false, toastMessage: '',
            toastType: 'success'
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.submit = this.submit.bind(this);
        this.showError = this.showError.bind(this);
        this.dismissToast = this.dismissToast.bind(this);
    }

    showModal() {
        if(!this.state.init)
            this.setState({showing: true, init: true});
    }

    hideModal() {
        this.setState({showing: false, init: false});
    }

    showError(message) {
        this.setState({toastVisible: true, toastMessage: message, toastType: 'danger'});
    }

    dismissToast() {
        this.setState({toastVisible: false});
    }

    submit(e) {
        e.preventDefault();
        this.hideModal();
        const form = document.forms.issueAdd;
        const newIssue = {
            owner: form.owner.value,
            title: form.owner.title
        };
        fetch('/api/sync/table/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newIssue),
        }).then(response => {
            if (response.ok) {
                response.json().then(updatedIssue => {
                    this.props.history.push('/room');
                });
            } else {
                response.json().then(error => {
                    this.showError(`Failed to add issue: ${error.message}`);
                });
            }
        }).catch(err => {
            this.showError(`Error in sending data to server: ${err.message}`);
        });
    }

    render() {
        return (
            <NavItem onClick={this.showModal}><Glyphicon glyph="plus"/> Create Table
                <Modal keyboard show={this.state.showing} onHide={this.hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Table</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form name="issueAdd">
                            <FormGroup>
                                <ControlLabel>Title</ControlLabel>
                                <FormControl name="title" autoFocus/>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Owner</ControlLabel>
                                <FormControl name="owner"/>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonToolbar>
                            <Button type="button" bsStyle="primary" onClick={this.submit}>Submit</Button>
                            <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
                        </ButtonToolbar>
                    </Modal.Footer>
                </Modal>
                <Toast
                    showing={this.state.toastVisible} message={this.state.toastMessage}
                    onDismiss={this.dismissToast} bsStyle={this.state.toastType}
                />
            </NavItem>
        );
    }
}

IssueAddNavItem.propTypes = {
    router: PropTypes.object,
};

export default withRouter(IssueAddNavItem);

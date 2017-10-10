import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom'
import Room from './Room.jsx';
const NoMatch = () => <p>Page Not Found</p>;
const Basic = () => (
    <Router>
        <Switch>
            <Route exact path="/" component={Room}/>
            <Route component={NoMatch}/>
        </Switch>
    </Router>
);

const contentNode = document.getElementById('contents');
ReactDOM.render(<Basic/>, contentNode);    // Render the component inside the content Node

if (module.hot) {
    module.hot.accept();
}
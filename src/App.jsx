import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import Room from './Room.jsx';

const contentNode = document.getElementById('contents');
ReactDOM.render(<Room />, contentNode);    // Render the component inside the content Node

if (module.hot) {
    module.hot.accept();
}
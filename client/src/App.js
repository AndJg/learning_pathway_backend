import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import LoginRegister from './components/LoginRegister';
import User from './components/User';
import './App.css';

const App = () => (
    <Router>
        <Fragment>
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={LoginRegister} />
            <Route path="/user" component={User} />
        </Fragment>
    </Router>
);

export default App;

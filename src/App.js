import React from 'react';
import './bootstrap.min.css';
import './App.css';
import TopNav from './TopNav';
import Clipboard from './Clipboard';
import Cookies from 'universal-cookie';
import Create from './Create';
import BuyResource from './Wallet';
import Home from './Home';
import NotFound from './NotFound';

import logoBig from './img/minter-logo-grey.svg'

import i18n from './i18n';
import {} from 'reactstrap';

import {Switch, Route, BrowserRouter as Router} from 'react-router-dom'


class App extends React.Component {
    pollTimer;

    errCount = 0;
    gameContent = null;

    constructor(props) {
        super(props);
        this._clipboard = React.createRef();
        this._toast = React.createRef();
        window.app = this;
        this.state = {
            isAuthenticated: false,
            token: null,
        };
    }

    getLangFromCookies() {
        const cookies = new Cookies();
        const i18next = cookies.get('i18next');
        const lng = !i18next || i18next === null ? 'en' : i18next;
        if (lng.toLowerCase().startsWith('ru')) {
            return 'ru'
        } else {
            return 'en';
        }

    }


    getApiUrl() {
        return window.location.host.toLowerCase().includes("minterpush.com") ? "https://minterpush.com/minterpush/api" : "http://"+window.location.hostname+":8080/minterpush/api";
    }

    getBaseUrl(){
        const location = window.location;
        return location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
    }

    getOrderToken() {
        const cookies = new Cookies();
        const token = cookies.get('userTkn');
        return token;
    }

    saveOrderTkn(token) {
        const cookies = new Cookies();
        cookies.set('userTkn', token, {path: '/', expires: new Date('2995-01-01')});
    }

    getClipboard() {
        return this._clipboard.current;
    }

    onLangChange(lang) {
        console.log('lang changed ' + lang)
        this.forceUpdate();
    }


    componentDidMount() {
    }

    componentWillUnmount() {
        clearInterval(this.pollTimer);
    }

    onResourceCreated(data, token, history) {
        console.log("onResourceCreated, token " + token + ": " + data);
        this.saveOrderTkn(token);
        history.push({pathname: '/create/' + data.id, state: {showSuccess: true}});
    }


    componentWillReceiveProps(nextProps) {
        debugger;
    }


    getHeader(center) {
        const cent = center === true ? "mb-auto" : "mb-0";
        return (<header className={"masthead " + cent}>
            <TopNav onLangChange={(lang) => this.onLangChange(lang)}/>
        </header>);
    }

    render() {


        return (
            <React.Fragment>
                <Router>
                    <Switch>
                        <Route exact path="/" render={props => this.getHeader(true) }/>
                        <Route render={props => this.getHeader(false)}/>
                    </Switch>

                    <main role="main" className="inner cover">
                        <div className="container">
                            <Switch>
                                <Route exact path="/" component={Home}/>
                                {/*<Route exact path="/orders" component={Orders}/>*/}
                                <Route exact path="/create/:id?" render={(props) => <Create
                                    onCreated={(data, token, history) => this.onResourceCreated(data, token, history) }/>}/>
                                {/*<Route exact path="/p/:id" render={(props) => <ResourceSummary {...props} />}/>*/}
                                <Route exact path="/:id/:type?" component={BuyResource}/>
                                <Route component={NotFound}/>
                            </Switch>
                            <Clipboard ref={this._clipboard}/>

                        </div>
                    </main>
                    <footer className="mastfoot mt-auto text-muted text-center text-small">
                        <p className="mb-1 mt-3">© {new Date().getFullYear()} MinterPush.com</p>
                        <ul className="list-inline">
                            {/*<li className="list-inline-item"><a rel="noopener noreferrer" href="https://t.me/mintboxio"*/}
                                                                {/*target="_blank">{i18n.t('support')}</a></li>*/}
                        </ul>
                        <div className="mb-3">Powered by: <a href="https://minter.network" target="_blank"><img src={logoBig} className="logo-big mb-2" /></a></div>
                    </footer>
                </Router>
            </React.Fragment>
        );
    }


    // init(token) {
    //     fetch(this.getApiUrl() + '/api/init', {
    //         method: 'post',
    //         headers: new Headers({
    //             'Authorization': "Bearer " + token,
    //         })
    //
    //     })
    //         .then(response => {
    //             if (response.status === 200) {
    //                 return response.json();
    //             } else {
    //                 throw new Error(response.json());
    //             }
    //         })
    //         .then(
    //             data => {
    //                     this.gameContent = data.data;
    //             }
    //         )
    //         .catch(error => {
    //             console.log("err " + error);
    //         });
    // }

}

export default App;


// class Header extends React.Component {
//
//
//
//     render() {
//         return (
//             <Router>
//                 <Switch>
//                     <Route exact path="/" render={props=> this.get(true) }/>
//                     <Route render={props => <div>ZZZZ</div>}/>
//                 </Switch>
//             </Router>
//
//         );
//     }
// }






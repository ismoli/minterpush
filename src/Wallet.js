import React from 'react';
import i18n from './i18n';
import BaseComponent from './BaseComponent';
import TransferToMx from './TransferToMx';
import BipToPhone from './BipToPhone';
import Donate from './Donate';
import {Switch, withRouter, Redirect, Link, Route} from 'react-router-dom';
import {Button, Popover, PopoverHeader, PopoverBody, ListGroup, ListGroupItem} from 'reactstrap';
class Wallet extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            popoverOpen: false,
        };

    }

    componentDidMount() {
        this.mounted = true;
        this.loadResource(this.props.match.params.id)
    }

    componentWillUnmount() {
        this.mounted = false;
    }


    loadResource(id) {
        this.setLoading(true);
        fetch(window.app.getApiUrl() + '/' + id, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'userTkn': window.app.getOrderToken()
            },
        })
            .then(response => {
                let json = response.json();
                if (response.status === 200) {
                    return json;
                } else {
                    return json.then(err => {
                        throw err;
                    });
                }
            })
            .then(
                data => {
                    if (!data.success) {
                        this.onError("", data.msg);
                    } else {
                        this.onResourceLoaded(data.data);
                    }
                }
            )
            .catch(error => {
                this.onError(error, "err.fetch")
            });
    }

    onResourceLoaded(data) {
        this.setState({
            isLoading: false,
            data: data
        });
    }

    onTransferCompleted() {
        this.props.history.push("/"+this.props.match.params.id);
        this.loadResource(this.props.match.params.id)
    }


    togglePopover() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        })
    }


    render() {

        let rend = super.render();
        if (rend) return rend;
        //
        let array = [];
        const bipBalance = this.state.data.bipBalance.amount;
        for (let i = 0; i < this.state.data.rates.length; i++) {
            let item = this.state.data.rates[i];
            array.push(
                <div className="p-0 font-weight-normal"
                     key={i}>{(item.rate * bipBalance).toFixed(2)} {item.pair.ticker}</div>
            );
        }


        return (
            <React.Fragment>
                <React.Fragment>
                    <div className="text-center py-2">
                        <h2>{i18n.t('wallet.hi')}{this.state.data.recipient && " "+this.state.data.recipient}!</h2>
                        {this.state.data.sender && <h6>{this.state.data.sender} {i18n.t('wallet.subTitle')}</h6>}
                        {!this.state.data.sender && <h6>{i18n.t('wallet.subTitle2')}</h6>}
                        <h3>{this.state.data.balance.amount.toFixed(4)} {this.state.data.balance.coin}</h3>
                        <button className="btn btn-outline-dark btn-sm" id="Popover1">
                            ~{this.state.data.fiatBalance.amount.toFixed(2)} {this.state.data.fiatBalance.coin}</button>
                        <Popover placement="auto" isOpen={this.state.popoverOpen} target="Popover1"
                                 toggle={() => this.togglePopover()}>
                            <PopoverHeader>{i18n.t('balance')}</PopoverHeader>
                            <PopoverBody>
                                {array}
                            </PopoverBody>
                        </Popover>
                        <hr/>


                        <Route path="/:id/send"
                               render={(props) => <TransferToMx onCompleted={() => this.onTransferCompleted()}
                                                                data={this.state.data}/> }/>
                        <Route path="/:id/biptophone"
                               render={(props) => <BipToPhone onCompleted={() => this.onTransferCompleted()}
                                                              data={this.state.data}/> }/>
                        <Route path="/:id/mintego"
                               render={(props) => <Donate onCompleted={() => this.onTransferCompleted()}
                                                              data={this.state.data}/> }/>

                        <Route exact path="/:id"
                               render={(props) => <React.Fragment>

                        <div className="h6 text-uppercase text-secondary">{i18n.t('wallet.cat1')}</div>
                        <div className="row justify-content-center">
                            <div className="card-deck">
                                <div className="card component-card mb-3">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{i18n.t('wallet.anotherPerson')}</h5>
                                        <p className="card-text"></p>
                                        <Link className="btn btn-primary mt-auto"
                                              to={"/" + this.state.data.id + "/send"}>{i18n.t('send')}</Link>
                                    </div>
                                </div>
                                <div className="card component-card mb-3">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{i18n.t('wallet.yourWallet')}</h5>
                                        <p className="card-text"></p>
                                        <Link className="btn btn-primary mt-auto"
                                              to={"/" + this.state.data.id + "/send"}>{i18n.t('send')}</Link>
                                    </div>
                                </div>
                                <div className="card component-card mb-3 text-muted">
                                    <div className="card-body d-flex flex-column ">
                                        <h5 className="card-title">{i18n.t('wallet.exchangeBTC')}</h5>
                                        <p className="card-text"></p>
                                        <Link className="btn btn-primary disabled mt-auto"
                                              to={"/" + this.state.data.id + "/exchange"}>{i18n.t('wallet.exchange')}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="h6 text-uppercase text-secondary">{i18n.t('wallet.cat2')}</div>
                        <div className="row justify-content-center">
                            <div className="card-deck">

                                <div className="card component-card mb-3">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{i18n.t('wallet.topupMobile')}</h5>
                                        <p className="card-text"></p>
                                            <Link className="mt-auto btn btn-info" to={"/" + this.state.data.id + "/biptophone"}>{i18n.t('wallet.topup')}</Link>

                                    </div>
                                </div>
                                <div className="card component-card mb-3 text-muted">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{i18n.t('wallet.giftCerts')}</h5>
                                        <p className="card-text"></p>
                                        <Link className="btn btn-info disabled mt-auto" to={"/" + this.state.data.id + "/gift"}>{i18n.t('wallet.buy')}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>



                                <div className="h6 text-uppercase text-secondary">{i18n.t('wallet.cat3')}</div>
                        <div className="row justify-content-center">
                            <div className="card-deck">
                                <div className="card component-card mb-3">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">MinteGo</h5>
                                        <p className="card-text"></p>
                                        <Link className="btn btn-success mt-auto" to={"/" + this.state.data.id + "/mintego"}>{i18n.t('wallet.donate')}</Link>
                                    </div>
                                </div>
                                <div className="card component-card mb-3 text-muted">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">Red Cross</h5>
                                        <p className="card-text"></p>
                                        <Link className="btn btn-success disabled mt-auto" to={"/" + this.state.data.id + "/redcross"}>{i18n.t('wallet.donate')}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                               </React.Fragment>}/>
                    </div>
                </React.Fragment>
            </React.Fragment>

        );
    }


}

export
default withRouter(Wallet);
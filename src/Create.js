import React from 'react';
import {FormGroup, Input} from 'reactstrap';
import SpinnerButton from './SpinnerButton'
import BaseComponent from './BaseComponent'
import i18n from './i18n';
import {withRouter} from 'react-router-dom';
import {Trans} from 'react-i18next';
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom'

class Create extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: '',
            msg: ''
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.load(this.props.match.params.id, true);
    }

    componentWillUnmount() {
        this.mounted = false;
    }


    load(id, loading, callback) {
        id = id ? id : null;
        if (id == null) return;
        console.log("loading..." + id);
        this.setLoading(loading)

        fetch(window.app.getApiUrl() + '/create/' + id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'userTkn': window.app.getOrderToken()
            },
            body: JSON.stringify({})
        })
            .then(response => {
                // console.log(response);
                if (response.status === 200) {
                    var token = response.headers.get("userTkn");
                    const res = response.json();
                    return Promise.all([res, token]);
                } else {
                    throw new Error("response status " + response.status);
                }
            })
            .then(
                d => {
                    const data = d[0];
                    if (this.mounted) {
                        if (data.success) {
                            this.onLoaded(data.data)
                            if(callback) {
                                callback(data.data)
                            }
                            // this.props.onCreated(data.data, d[1], this.props.history);
                        } else {
                            this.onError('', data.msg)

                        }
                    }
                }
            )
            .catch(error => {
                this.onError(error)
            });
    }


    onLoaded(data) {
        this.setLoading(false)
        this.setBtnLoading(false)
        this.setState({
            data: data
        })
    }

    onConfirm() {
        this.setBtnLoading(true);
        this.load(this.props.match.params.id, false, (data)=> {
            console.log(data);
            if(data.status === 'CREATED') {
                this.setState({
                    msg: i18n.t('step2alert')
                })
            }
        });
    }


    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setLoading(true)

        fetch(window.app.getApiUrl() + '/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'userTkn': window.app.getOrderToken()
            },
            body: JSON.stringify({
                sender: this.state.sender,
                recipient: this.state.recipient,
            })
        })
            .then(response => {
                // console.log(response);
                if (response.status === 200) {
                    var token = response.headers.get("userTkn");
                    const res = response.json();
                    return Promise.all([res, token]);
                } else {
                    throw new Error("response status " + response.status);
                }
            })
            .then(
                d => {
                    const data = d[0];
                    if (this.mounted) {
                        if (data.success) {
                            this.onLoaded(data.data)
                            this.props.onCreated(data.data, d[1], this.props.history);
                        } else {
                            this.onError('', data.msg)

                        }
                    }
                }
            )
            .catch(error => {
                this.onError(error, error.message)
            });


    }


    getFirstStep() {

        return (
            <form onSubmit={(event) => this.handleSubmit(event)} className="needs-validation" noValidate
            ><h4 className="mt-3">{i18n.t('step1title')}</h4>
                <FormGroup>
                    <Input name="sender" value={this.state.sender} onChange={(e) => this.handleChange(e)}
                           className="" type="text"
                           placeholder={i18n.t('senderHint')}
                    />
                    <small className="form-text text-muted ml-1">{i18n.t('senderText')}</small>
                </FormGroup>
                <FormGroup>
                    <Input name="recipient" value={this.state.recipient} onChange={(e) => this.handleChange(e)}
                           className="" type="text"
                           placeholder={i18n.t('recipientHint')}
                    />
                    <small className="form-text text-muted ml-1">{i18n.t('recipientText')}</small>
                </FormGroup>


                <div className="small text-center text-danger mb-4">{i18n.t(this.state.error)}</div>
                <FormGroup>
                    <SpinnerButton loading={this.state.isLoading ? 1 : 0} disabled={this.state.isLoading}
                                   type="submit" className="btn btn-block btn-primary">{i18n.t('next')}</SpinnerButton>
                </FormGroup>

            </form>


        )
    }


    getSecondStep() {
        let shareUrl = '';
        if (this.state.data) {
            shareUrl = window.app.getBaseUrl() + "/" + this.state.data.id
        }

        return (

            <div >
                {this.state.data &&
                <div className="text-center">
                    {this.state.data.status === "CREATED" &&
                    <React.Fragment>
                    <h5 className="mb-3">
                        {i18n.t('hello')}{this.state.data.sender? " "+this.state.data.sender: ""}!
                    </h5>
                    <h4>{i18n.t('balance')}: {this.state.data.balance.amount} {this.state.data.balance.coin}</h4>

                    <div>

                        <h6>{i18n.t('step2desc')}</h6>
                        <span onClick={() => window.app.getClipboard().copyTextToClipboard(this.state.data.address)} className="badge badge-primary badge-clickable">{this.state.data.address}</span>

                        <div className="row">
                            <div className="col col-12">
                                <img src={"data:image/png;base64, " + this.state.data.qr} alt="qr code"/>
                            </div>
                        </div>
                        <div className="mb-3"><small className="text-info font-weight-bold">{this.state.msg}</small></div>
                        <SpinnerButton className="btn btn-block btn-primary" loading={this.state.btnLoading ? 1 : 0} onClick={() => this.onConfirm()}
                                       >{i18n.t('step2btn')}</SpinnerButton>
                    </div>
                    </React.Fragment>
                    }
                    {this.state.data.status === "INITIATED" &&
                    <div>
                        <h4>{i18n.t('step3title')}</h4>
                        <p>{i18n.t('step3text')}</p>
                        <p className="alert alert-success font-weight-bold">{shareUrl}</p>
                        <button onClick={() => window.app.getClipboard().copyTextToClipboard(shareUrl)}
                                className="btn btn-outline-primary">{i18n.t('step3btn')}
                        </button>
                    </div>
                    }

                </div>
                }
            </div>


        )
    }

    render() {
        let rend = super.render();
        if (rend) return rend;
        return (

            <div className="row justify-content-center">
                <div className="col col-sm-12 col-md-8 mx-auto">


                    <Switch>
                        <Route exact path="/create" render={(props) => this.getFirstStep()}/>
                        <Route exact path="/create/:id" render={(props) => this.getSecondStep() }/>
                    </Switch>

                </div>
            </div>
        );
    }

}

export
default withRouter(Create);
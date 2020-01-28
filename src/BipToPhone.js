import React from 'react';
import SpinnerButton from './SpinnerButton'
import BaseComponent from './BaseComponent'
import i18n from './i18n';
import {Trans} from 'react-i18next';
import {FormGroup, Input} from 'reactstrap';
import { withRouter } from "react-router-dom";

class BipToPhone extends BaseComponent {


    constructor(props) {
        super(props);
        this.state = {
            error: null,
            btnLoading: false,
            data: '',
            initData: null
        };

    }

    componentDidMount() {
        super.componentDidMount();
        this.init();
    }

    componentWillReceiveProps(nextProps) {
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value
        });
    }

    init() {
        this.setLoading(true)

        fetch(window.app.getApiUrl() + '/' + this.props.data.id + "/biptophone", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'userTkn': window.app.getOrderToken()
            },

        })
            .then(response => {
                if (response.status === 200) {
                    // var token = response.headers.get("userTkn");
                    const res = response.json();
                    return Promise.all([res]);
                } else {
                    throw new Error(response.json());
                }
            })
            .then(
                data => {
                    console.log("resp " + data[0]);
                    this.onInit(data[0]);
                }
            )
            .catch(error => {
                this.setLoading(false)
                this.setState({
                    error: error.message
                })
                console.log("err " + error);
            });
    }

    onInit(response){
        this.setLoading(false)
        if(!response.success){
            this.setState({
                error: response.msg
            })
        }else{
            this.setState({
                initData: response.data
            });
        }
    }

    makeTransfer(phone) {
        this.setBtnLoading(true)

        fetch(window.app.getApiUrl() + '/' + this.props.data.id + "/biptophone", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'userTkn': window.app.getOrderToken()
            },
            body: JSON.stringify({
                phone: phone
            })
        })
            .then(response => {
                if (response.status === 200) {
                    // var token = response.headers.get("userTkn");
                    const res = response.json();
                    return Promise.all([res]);
                } else {
                    throw new Error(response.json());
                }
            })
            .then(
                data => {
                    console.log("resp " + data[0]);
                    this.onTransferResponse(data[0]);
                }
            )
            .catch(error => {
                this.setBtnLoading(false);
                this.setState({
                    error: error.message
                })
                console.log("err " + error);
            });
    }


    onTransferResponse(response) {
        this.setBtnLoading(false);
        if(!response.success){
            this.setState({
                error: response.msg
            })
        }else{
            this.setState({
                msg: response.msg
            }, ()=> setTimeout(()=>{
                this.props.history.push("/"+this.props.data.id);
                this.props.onCompleted();
            }, 2000))
        }

    }

    onSendClick(){
        this.setState({
            error: null
        })
        this.makeTransfer(this.state.phone)
    }

    setBtnLoading(loading) {
        this.setState({
            btnLoading: loading,
        });
    }


    render() {

        let rend = super.render();
        if (rend) return rend;

        let elem = <React.Fragment>
            <div className="">
                <div className="row justify-content-center">
                    <div className="col col-sm-12 col-md-9">
                        <h6>{i18n.t('wallet.topupMobile')}</h6>
                        <p>{i18n.t('biptophone.subtitle')}</p>
                        {this.state.initData &&
                         <div>
                        <p  className="font-weight-bold">{i18n.t('biptophone.topupAmount')}:</p>
                        <p className="mt-0">
                            ~{this.state.initData.depositRub.toFixed(2)} RUB<br/>
                            ~{this.state.initData.depositKzt.toFixed(2)} KZT<br/>
                            ~{this.state.initData.depositUah.toFixed(2)} UAH<br/>
                            ~{this.state.initData.depositByn.toFixed(2)} BYN
                        </p>
                         </div>
                        }
                        <p>{i18n.t('biptophone.phoneLabel')}</p>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col col-sm-12 col-md-6">
                        <Input name="phone" value={this.state.phone} onChange={(e) => this.handleChange(e)}
                               className="" type="tel" required
                               placeholder="+79..."
                        />
                    </div>
                </div>
                <div className="row justify-content-center mt-3">
                    <div className="col col-sm-12 col-md-6">
                        <SpinnerButton onClick={()=>this.onSendClick()} loading={this.state.btnLoading ? 1 : 0} disabled={this.state.btnLoading}
                                       type="button" className="btn btn-block btn-outline-info">{i18n.t('wallet.topup')}</SpinnerButton>
                        <div className="small text-center text-danger mt-2">{i18n.t(this.state.error)}</div>
                        <div className="small text-center text-success mt-2">{i18n.t(this.state.msg)}</div>
                    </div>
                </div>
            </div>
            <small className="text-muted">Service provided by <a href="https://biptophone.ru" target="_blank">biptophone.ru</a></small>
        </React.Fragment>

        return (
            <div className="text-center mb-5">
                <div className="row">
                    <div className="col">
                        {/*<strong>Order #{data.order.id}</strong>*/}
                    </div>
                </div>
                {elem}
            </div>
        );
    }

}

export
default
withRouter(BipToPhone);


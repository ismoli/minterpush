import React from 'react';
import SpinnerButton from './SpinnerButton'
import BaseComponent from './BaseComponent'
import i18n from './i18n';
import {Trans} from 'react-i18next';
import {FormGroup, Input} from 'reactstrap';
import { withRouter } from "react-router-dom";

class TransferToMx extends BaseComponent {


    constructor(props) {
        super(props);
        this.state = {
            error: null,
            btnLoading: false,
            data: ''
        };

    }

    componentDidMount() {
        super.componentDidMount();
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

    makeTransfer(address, payload) {
        this.setBtnLoading(true)

        fetch(window.app.getApiUrl() + '/' + this.props.data.id + "/send", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'userTkn': window.app.getOrderToken()
            },
            body: JSON.stringify({
                address: address,
                payload: payload
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
                msg: 'Coins successfully sent'
            }, ()=> setTimeout(()=>{
                // this.props.history.push("/"+this.props.data.id);
                this.props.onCompleted();
            }, 3000))
        }

    }

    onSendClick(){
        this.setState({
            error: null
        })
        this.makeTransfer(this.state.addressTo)
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
                    <div className="col col-sm-12">
                        {/*{i18n.t('orderDetails')}:*/}
                        <p>{i18n.t('wallet.enterAddress')}</p>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col col-sm-12 col-md-8">
                        <Input name="addressTo" value={this.state.addressTo} onChange={(e) => this.handleChange(e)}
                               className="" type="text" required
                               placeholder="Mx..."
                        />
                    </div>
                </div>
                <div className="row justify-content-center mt-3">
                    <div className="col col-md-8  col-sm-12">
                        <SpinnerButton onClick={()=>this.onSendClick()} loading={this.state.btnLoading ? 1 : 0} disabled={this.state.btnLoading}
                                       type="button" className="btn btn-block btn-outline-primary">{i18n.t('send')}</SpinnerButton>
                        <div className="small text-center text-danger mt-2">{i18n.t(this.state.error)}</div>
                        <div className="small text-center text-success mt-2">{i18n.t(this.state.msg)}</div>
                    </div>
                </div>
            </div>
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
default TransferToMx;


import React from 'react';
import SpinnerButton from './SpinnerButton'
import BaseComponent from './BaseComponent'
import TransferToMx from './TransferToMx'
import i18n from './i18n';
import {Trans} from 'react-i18next';
import {FormGroup, Input} from 'reactstrap';
import { withRouter } from "react-router-dom";

class Donate extends TransferToMx {


    constructor(props) {
        super(props);
        this.state = {
            tx:null,
            msg:null
        };
    }


    onTransferResponse(response) {
        this.setBtnLoading(false);
        if(!response.success){
            this.setState({
                error: response.msg
            })
        }else{
            const txt = 'Coins successfully sent';
            debugger;
            this.setState({
                msg: txt,
                tx: response.data.tx
            }, ()=> setTimeout(()=>{
                this.props.onCompleted();
            }, 5000))
        }

    }

    onSendClick(){
        this.setState({
            error: null
        })
        this.makeTransfer("Mx57b20f1004438a2539c851d02704081944d76016", "donation from minterpush.com")
    }


    render() {
        //
        // let rend = super.render();
        // if (rend) return rend;


        let elem = <React.Fragment>
            <div className="">
                <div className="row justify-content-center">
                    <div className="col col-8">
                        {i18n.t('mintego.text')}
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col col-8">

                    </div>
                </div>
                <div className="row justify-content-center mt-3">
                    <div className="col col-8">
                        <SpinnerButton onClick={()=>this.onSendClick()} loading={this.state.btnLoading ? 1 : 0} disabled={this.state.tx || this.state.btnLoading}
                                       type="button" className="btn btn-block btn-outline-success">{i18n.t('wallet.donate')}</SpinnerButton>
                        <div className="small text-center text-danger mt-2">{i18n.t(this.state.error)}</div>
                        <div className="small text-center text-success mt-2">
                            {i18n.t(this.state.msg)}
                            {this.state.tx &&
                            <div><a href={"https://explorer.minter.network/transactions/" + this.state.tx}
                                    target="_blank">Donation transaction</a></div>
                            }
                        </div>
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
default Donate;


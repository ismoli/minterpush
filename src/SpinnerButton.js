import React from 'react';
import { Button } from 'reactstrap';
class SpinnerButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }



    render() {
        let elem;
        if(this.props.loading){
             elem = <button disabled {...this.props}><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> {this.props.children}</button>
        }else{
             elem = <button {...this.props}>{this.props.children}</button>
        }
        return (
            elem
        );
    }
}

export default SpinnerButton;
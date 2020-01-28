import React from 'react';
import {Toast, ToastBody} from 'reactstrap';
class Toast2 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            text: ''
        }
    }


    show(text) {
        this.setState({
            isOpen: true,
            text: text
        });
    }

    render() {
        const delay = this.props.delay ? this.props.delay : 3000;
        if (this.state.isOpen) {
            setTimeout(
                function () {
                    this.setState({isOpen: false});
                }
                    .bind(this),
                delay
            );
        }
        return (
            <Toast style={{position: 'fixed', top: '53px', right: '10px'}} isOpen={this.state.isOpen}>
                <ToastBody>
                    {this.state.text}
                </ToastBody>
            </Toast>
        );
    }

}

export default Toast2;
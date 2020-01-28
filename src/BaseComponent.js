import React from 'react';
import i18n from './i18n';

class BaseComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            btnLoading: false
        };

    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    setLoading(loading) {
        this.setState({
            isLoading: loading
        })
    }

    setBtnLoading(loading) {
        this.setState({
            btnLoading: loading
        })
    }


    onError(error, msg){
        console.log("onError: " + error + " | msg: "+msg)
        if (this.mounted) {
            this.setState({
                onError: true,
                isLoading: false,
                data: null,
                error: msg
            });
        }
    }


    render(){
        if(this.state.onError){
            return (<div className="mt-5 text-center text-danger h5">{i18n.t(this.state.error)}</div>)
        }

        if(this.state.data == null || this.state.isLoading){
            return (<div className="mt-5 text-center"><div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div></div>);
        }
    }

}

export
default
BaseComponent;
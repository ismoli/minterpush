import React from 'react';
import Toast2 from './Toast2'
import i18n from './i18n';
import * as clipboard from "clipboard-polyfill"
class Clipboard extends React.Component {

    constructor(props) {
        super(props);
        this._toast = React.createRef();
        this.state = {
            isOpen: false
        }
    }


    render() {
            return (
                <Toast2 ref={this._toast}/>
            );

    }


    copyTextToClipboard(text) {
        clipboard.writeText(text);
        this._toast.current.show(i18n.t('msg.copied'));
    }


}

export default Clipboard;
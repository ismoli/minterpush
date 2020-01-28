import React from 'react';
import i18n from './i18n';
import { Link } from 'react-router-dom'
import logo from './img/minter-logo-circle.svg'

import {
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem, Container
} from 'reactstrap';



class TopNav extends React.Component {
    constructor(props) {
        super(props);
        this._modal = React.createRef();

        this.state = {
            isOpen: false,
            lang: window.app.getLangFromCookies(),
            flag : window.app.getLangFromCookies() === 'ru' ? 'flag-icon-ru':'flag-icon-gb',
            depositAddress: ''
        };

        this.toggle = this.toggle.bind(this);
        this.showModal = this.showModal.bind(this);

    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    showModal(){
        if(this.props.isAuthenticated && this.props.user) {
            console.log("swho modal");
            this._modal.current.toggle();
        }
    }

    changeLanguage(e) {
        const lng = e.currentTarget.value;
        i18n.changeLanguage(lng);
        this.props.onLangChange(lng);
        this.setState({
            lang:  lng,
            flag : e.currentTarget.attributes.flag.value
        });

    }

    render() {
        const flagCss = this.state.flag + " flag-icon";
        return (
            <React.Fragment>

                    <Navbar color="light" light className="navbar-expand">
                    <NavbarBrand href="/" >
                        <img src={logo} width="30" height="30" className="d-inline-block align-top" alt=""/>
                        <span className="font-weight-bold ml-1">Push<sup>beta</sup></span>
                    </NavbarBrand>
                        <Nav className="ml-auto" navbar>
                            {/*<NavItem >*/}
                                {/*<Link className="nav-link" to={'/orders'}>{i18n.t('orders')}</Link>*/}
                            {/*</NavItem>*/}
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav  style={{textTransform: 'capitalize'}}>
                                    <span className={flagCss}> </span> {this.state.lang}
                                </DropdownToggle>

                                <DropdownMenu className="lang-dropdown" right>

                                    <DropdownItem onClick={(e) => this.changeLanguage(e)} value='en' flag="flag-icon-gb">
                                        <span className="flag-icon flag-icon-gb"> </span> En
                                    </DropdownItem>

                                    <DropdownItem onClick={(e) => this.changeLanguage(e)} value='ru' flag="flag-icon-ru">
                                        <span className="flag-icon flag-icon-ru"> </span> Ru
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>

                        </Nav>

                    </Navbar>

            </React.Fragment>
        );
    }
}

export default TopNav;
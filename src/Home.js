import React from 'react';
import { Link } from 'react-router-dom'
import i18n from './i18n';
import {Trans } from 'react-i18next';



class Home extends React.Component {

    render() {
        return (
            <div className="">
                <h2 className="cover-heading">
                    <Trans i18nKey="title"/>
                </h2>
            <p className="lead">
                <Trans i18nKey="lead"/>
            </p>
            <div className=" mt-3 mb-3"><Link to='/create' className="btn btn-lg btn-primary">
                {i18n.t('mainBtn')}
                </Link></div>
        </div>
        );
    }

}


export default Home;
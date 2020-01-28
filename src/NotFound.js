import React from 'react'
import i18n from './i18n';

const NotFound = () => <h5 className="mt-5 text-center text-danger">{i18n.t('msg.resourceNotFound')}</h5>

export default NotFound
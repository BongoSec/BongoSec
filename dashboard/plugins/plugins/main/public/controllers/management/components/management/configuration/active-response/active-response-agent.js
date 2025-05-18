/*
 * Bongosec app - React component for show configuration of active response - agent tab.
 * Copyright (C) 2015-2022 Bongosec, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import WzNoConfig from '../util-components/no-config';
import WzConfigurationSettingsHeader from '../util-components/configuration-settings-header';
import WzConfigurationSettingsGroup from '../util-components/configuration-settings-group';
import withWzConfig from '../util-hocs/wz-config';

import { compose } from 'redux';
import { connect } from 'react-redux';

import { isString, renderValueNoThenEnabled } from '../utils/utils';
import { webDocumentationLink } from '../../../../../../../common/services/web_documentation';

const helpLinks = [
  {
    text: 'Active response documentation',
    href: webDocumentationLink(
      'user-manual/capabilities/active-response/index.html',
    ),
  },
  {
    text: 'Active response reference',
    href: webDocumentationLink(
      'user-manual/reference/ossec-conf/active-response.html',
    ),
  },
];

const mainSettings = [
  {
    field: 'disabled',
    label: 'Active response status',
    render: renderValueNoThenEnabled,
  },
  {
    field: 'repeated_offenders',
    label: 'List of timeouts (in minutes) for repeated offenders',
  },
  {
    field: 'ca_store',
    label: 'Use the following list of root CA certificates',
  },
  {
    field: 'ca_verification',
    label: 'Validate WPKs using root CA certificate',
  },
];

class WzConfigurationActiveResponseAgent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { currentConfig, bongosecNotReadyYet } = this.props;
    return (
      <Fragment>
        {currentConfig['com-active-response'] &&
          isString(currentConfig['com-active-response']) && (
            <WzNoConfig
              error={currentConfig['com-active-response']}
              help={helpLinks}
            />
          )}
        {currentConfig['com-active-response'] &&
          !isString(currentConfig['com-active-response']) &&
          !currentConfig['com-active-response']['active-response'] && (
            <WzNoConfig error='not-present' help={helpLinks} />
          )}
        {bongosecNotReadyYet &&
          (!currentConfig || !currentConfig['com-active-response']) && (
            <WzNoConfig error='Server not ready yet' help={helpLinks} />
          )}
        {currentConfig['com-active-response'] &&
          !isString(currentConfig['com-active-response']) &&
          currentConfig['com-active-response']['active-response'] && (
            <WzConfigurationSettingsHeader
              title='Active response settings'
              description='Find here all the Active response settings for this agent'
              help={helpLinks}
            >
              <WzConfigurationSettingsGroup
                config={currentConfig['com-active-response']['active-response']}
                items={mainSettings}
              />
            </WzConfigurationSettingsHeader>
          )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  bongosecNotReadyYet: state.appStateReducers.bongosecNotReadyYet,
});

const sectionsAgent = [{ component: 'com', configuration: 'active-response' }];

WzConfigurationActiveResponseAgent.propTypes = {
  bongosecNotReadyYet: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default compose(
  connect(mapStateToProps),
  withWzConfig(sectionsAgent),
)(WzConfigurationActiveResponseAgent);

/**
 * Copyright (c)  WSO2 Inc. (http://wso2.com) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, useState } from 'react';
import {
    FormControl,
    Grid,
    Paper,
    Typography,
    withStyles,
    Radio,
    FormControlLabel,
    RadioGroup,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import EndpointListing from './EndpointListing';
import EndpointAdd from './EndpointAdd';
import { getEndpointTemplateByType, getEndpointTypeProperty } from './endpointUtils';
import GeneralConfiguration from './GeneralConfiguration';
import GenericEndpoint from './GenericEndpoint';


const styles = theme => ({
    overviewWrapper: {
        marginTop: theme.spacing.unit * 2,
    },
    listing: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
    },
    endpointContainer: {
        paddingBottom: theme.spacing.unit,
        width: '100%',
        marginTop: theme.spacing.unit,
    },
    endpointName: {
        paddingLeft: theme.spacing.unit,
        fontSize: '1rem',
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
    endpointTypesWrapper: {
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 2,
    },
    sandboxHeading: {
        display: 'flex',
        alignItems: 'center',
    },
    radioGroup: {
        display: 'flex',
        flexDirection: 'row',
    },
    endpointsWrapper: {
        padding: theme.spacing.unit,
    },
    endpointsTypeSelectWrapper: {
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        padding: theme.spacing.unit,
        display: 'flex',
        justifyContent: 'space-between',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '5px',
        borderColor: '#c4c4c4',
    },
    defaultEndpointWrapper: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
});

/**
 * The endpoint overview component. This component holds the views of endpoint creation and configuration.
 * @param {any} props The props that are being passed to the component.
 * @returns {any} HTML view of the endpoints overview.
 */
function EndpointOverview(props) {
    const { classes, api, onChangeAPI } = props;
    const { endpointConfig, endpointSecurity } = api;
    const [isSOAPEndpoint, setSOAPEndpoint] = useState({ key: 'http', value: 'HTTP/REST Endpoint' });
    const [epConfig, setEpConfig] = useState(endpointConfig);
    const [endpointSecurityInfo, setEndpointSecurityInfo] = useState({});

    console.log(api);
    const endpointTypes = [{ key: 'http', value: 'HTTP/REST Endpoint' },
        { key: 'address', value: 'HTTP/SOAP Endpoint' }];
    const getEndpointType = (type) => {
        if (type === 'http') {
            return endpointTypes[0];
        } else if (type === 'address') {
            return endpointTypes[1];
        } else {
            const prodEndpoints = endpointConfig.production_endpoints;
            if (Array.isArray(prodEndpoints)) {
                return prodEndpoints[0].endpoint_type !== undefined ? endpointTypes[1] : endpointTypes[0];
            }
            return prodEndpoints.endpoint_type !== undefined ? endpointTypes[1] : endpointTypes[0];
        }
    };
    useEffect(() => {
        setEpConfig(endpointConfig);
    }, []);
    useEffect(() => {
        const type = endpointConfig.endpoint_type;
        setSOAPEndpoint(getEndpointType(type));
    }, []);

    useEffect(() => {
        setEndpointSecurityInfo(endpointSecurity);
    }, []);

    useEffect(() => {
        onChangeAPI({ ...api, endpointSecurity: endpointSecurityInfo });
    }, [endpointSecurityInfo]);

    useEffect(() => {
        console.log('newConfig', epConfig);
        onChangeAPI({ ...api, endpointConfig: epConfig });
    }, [epConfig]);

    useEffect(() => {
        let endpointConfiguration = {};
        if (isSOAPEndpoint.key === 'address') {
            endpointConfiguration = {
                ...epConfig,
                production_endpoints: {
                    endpoint_type: 'address',
                    template_not_supported: false,
                    url: 'http://myservice/resource',
                },
                sandbox_endpoints: {
                    endpoint_type: 'address',
                    template_not_supported: false,
                    url: 'http://myservice/resource',
                },
                production_failovers: [],
                sandbox_failovers: [],
            };
        } else {
            endpointConfiguration = { ...epConfig };
        }
        setEpConfig(endpointConfiguration);
    }, [isSOAPEndpoint]);

    const editEndpoint = (index, category, url) => {
        let modifiedEndpoint = null;
        let endpointTypeProperty = null;
        if (index > 0) {
            endpointTypeProperty = getEndpointTypeProperty(epConfig.endpoint_type, category);
            modifiedEndpoint = epConfig[endpointTypeProperty];
            if (epConfig.endpoint_type === 'failover') {
                modifiedEndpoint[index - 1].url = url;
            } else {
                modifiedEndpoint[index].url = url;
            }
        } else {
            modifiedEndpoint = epConfig[category];
            if (Array.isArray(modifiedEndpoint)) {
                modifiedEndpoint[0].url = url;
            } else {
                modifiedEndpoint.url = url;
            }
        }
        setEpConfig({ ...epConfig, [endpointTypeProperty]: modifiedEndpoint });
    };

    const addEndpoint = (category, type, newURL) => {
        let endpointTemplate = {};
        if (isSOAPEndpoint.key === 'address' || type === 'failover') {
            endpointTemplate = {
                endpoint_type: isSOAPEndpoint.key,
                template_not_supported: false,
                url: newURL,
            };
        } else {
            endpointTemplate = {
                url: newURL,
            };
        }
        const epConfigProperty = getEndpointTypeProperty(type, category);
        let endpointList = epConfig[epConfigProperty];
        /**
         * Check whether we have existing endpoints added.
         * */
        if (endpointList) {
            if (!Array.isArray(endpointList)) {
                endpointList = [endpointList].concat(endpointTemplate);
            } else {
                endpointList = endpointList.concat(endpointTemplate);
            }
        } else {
            endpointList = [endpointTemplate];
        }
        setEpConfig({ ...epConfig, [epConfigProperty]: endpointList });
    };

    const onChangeEndpointCategory = (event) => {
        const tmpEndpointConfig = getEndpointTemplateByType(
            event.target.value,
            isSOAPEndpoint.key === 'address',
            epConfig,
        );
        setEpConfig({ ...tmpEndpointConfig });
    };

    const handleEndpointTypeSelect = (event) => {
        const selectedKey = event.target.value;
        const selectedType = endpointTypes.filter((type) => {
            return type.key === selectedKey;
        })[0];
        setSOAPEndpoint(selectedType);
    };

    const handleToggleEndpointSecurity = () => {
        setEndpointSecurityInfo(() => {
            if (endpointSecurityInfo === null) {
                return { type: 'BASIC', username: '', password: '' };
            }
            return null;
        });
    };

    const removeEndpoint = (index, epType, category) => {
        const endpointConfigProperty = getEndpointTypeProperty(epType, category);
        const indexToRemove = epType === 'failover' ? index - 1 : index;
        const tmpEndpoints = epConfig[endpointConfigProperty];
        tmpEndpoints.splice(indexToRemove, 1);
        setEpConfig({ ...epConfig, [endpointConfigProperty]: tmpEndpoints });
    };

    const handleEndpointSecurityChange = (event, field) => {
        setEndpointSecurityInfo({ ...endpointSecurityInfo, [field]: event.target.value });
    };

    return (
        <div className={classes.overviewWrapper}>
            <GeneralConfiguration
                epConfig={epConfig}
                endpointSecurityInfo={endpointSecurityInfo}
                onChangeEndpointCategory={onChangeEndpointCategory}
                handleToggleEndpointSecurity={handleToggleEndpointSecurity}
                handleEndpointSecurityChange={handleEndpointSecurityChange}
                handleEndpointTypeSelect={handleEndpointTypeSelect}
                isSOAPEndpoint={isSOAPEndpoint}
            />
            <Paper className={classes.endpointContainer}>
                <Grid container xs spacing={2}>
                    <Grid xs className={classes.endpointsWrapper}>
                        <Typography className={classes.endpointName}>
                            <FormattedMessage
                                id='Apis.Details.EndpointsNew.EndpointOverview.production'
                                defaultMessage='Production'
                            />
                        </Typography>
                        <GenericEndpoint
                            className={classes.defaultEndpointWrapper}
                            endpointURL={epConfig.production_endpoints.length > 0 ?
                                epConfig.production_endpoints[0].url : epConfig.production_endpoints.url}
                            type=''
                            index={0}
                            category='production_endpoints'
                            editEndpoint={editEndpoint}
                        />
                    </Grid>
                    <Grid xs className={classes.endpointsWrapper}>
                        <div className={classes.sandboxHeading}>
                            <Typography className={classes.endpointName}>
                                <FormattedMessage
                                    id='Apis.Details.EndpointsNew.EndpointOverview.sandbox'
                                    defaultMessage='Sandbox'
                                />
                            </Typography>
                        </div>
                        <GenericEndpoint
                            className={classes.defaultEndpointWrapper}
                            endpointURL={epConfig.sandbox_endpoints.length > 0 ?
                                epConfig.sandbox_endpoints[0].url : epConfig.sandbox_endpoints.url}
                            type=''
                            index={0}
                            category='sandbox_endpoints'
                            editEndpoint={editEndpoint}
                        />
                    </Grid>
                </Grid>
                <Grid xs className={classes.endpointsTypeSelectWrapper}>
                    <div />
                    <div className={classes.endpointTypesSelectWrapper}>
                        <FormControl component='fieldset' className={classes.formControl}>
                            <RadioGroup
                                aria-label='Gender'
                                name='gender1'
                                className={classes.radioGroup}
                                value={epConfig.endpoint_type}
                                onChange={onChangeEndpointCategory}
                            >
                                {/* <FormControlLabel */}
                                {/*    value='http' */}
                                {/*    control={<Radio />} */}
                                {/*    label='Default' */}
                                {/* /> */}
                                <FormControlLabel
                                    value='load_balance'
                                    control={<Radio />}
                                    label='Load balance'
                                />
                                <FormControlLabel
                                    value='failover'
                                    control={<Radio />}
                                    label='Failover'
                                />
                            </RadioGroup>
                        </FormControl>
                        {/* <div className={classes.loadbalanceBtnContainer}> */}
                        {/*    <Button */}
                        {/*        disabled={epConfig.endpoint_type !== 'load_balance'} */}
                        {/*        onClick={() => setLBConfigOpen(true)} */}
                        {/*        className={classes.loadBalanceConfigButton} */}
                        {/*    > */}
                        {/*        <Icon> */}
                        {/*            settings */}
                        {/*        </Icon> */}
                        {/*    </Button> */}
                        {/* </div> */}
                    </div>
                    <div />
                </Grid>
                <Grid xs container>
                    <Grid xs={6} className={classes.endpointsWrapper}>
                        <EndpointListing
                            apiEndpoints={epConfig.production_endpoints}
                            failOvers={epConfig.production_failovers}
                            epType={epConfig.endpoint_type}
                            endpointAddComponent={<EndpointAdd />}
                            addNewEndpoint={addEndpoint}
                            removeEndpoint={removeEndpoint}
                            editEndpoint={editEndpoint}
                            category='production_endpoints'
                        />
                    </Grid>
                    <Grid xs className={classes.endpointsWrapper}>
                        <EndpointListing
                            apiEndpoints={epConfig.sandbox_endpoints}
                            failOvers={epConfig.sandbox_failovers}
                            epType={epConfig.endpoint_type}
                            endpointAddComponent={<EndpointAdd />}
                            addNewEndpoint={addEndpoint}
                            removeEndpoint={removeEndpoint}
                            editEndpoint={editEndpoint}
                            category='sandbox_endpoints'
                        />
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

EndpointOverview.propTypes = {
    classes: PropTypes.shape({
        overviewWrapper: PropTypes.shape({}),
        endpointTypesWrapper: PropTypes.shape({}),
        endpointName: PropTypes.shape({}),
    }).isRequired,
    api: PropTypes.shape({}).isRequired,
};

export default injectIntl(withStyles(styles)(EndpointOverview));

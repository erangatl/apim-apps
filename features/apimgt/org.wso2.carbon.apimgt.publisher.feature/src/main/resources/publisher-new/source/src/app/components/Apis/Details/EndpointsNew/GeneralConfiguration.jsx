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

import React, { useState, useEffect } from 'react';
import {
    Button,
    Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FormControl, FormControlLabel,
    Grid, Icon,
    InputLabel, MenuItem, Radio, RadioGroup, Select, Switch,
    Typography,
    withStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { FormattedMessage, injectIntl } from 'react-intl';
import EndpointSecurity from './GeneralConfiguration/EndpointSecurity';
import Certificates from './GeneralConfiguration/Certificates';
import LoadBalanceConfig from './LoadBalanceConfig';

const styles = theme => ({
    radioGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    endpointTypeSelect: {
        width: '50%',
    },
    configHeaderContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    endpointConfigSection: {
        padding: '10px',
    },
    loadBalanceConfigButton: {
        position: 'absolute',
        top: '40%',
    },
    loadbalanceBtnContainer: {
        position: 'relative',
        height: '100%',
    },
    endpointTypesSelectWrapper: {
        display: 'flex',
        padding: '10px',
    },
});

const endpointTypes = [{ key: 'http', value: 'HTTP/REST Endpoint' },
    { key: 'address', value: 'HTTP/SOAP Endpoint' }];

function GeneralConfiguration(props) {
    const {
        epConfig,
        endpointSecurityInfo,
        onChangeEndpointCategory,
        handleToggleEndpointSecurity,
        handleEndpointSecurityChange,
        handleEndpointTypeSelect,
        isSOAPEndpoint,
        classes,
    } = props;
    const [isConfigExpanded, setConfigExpand] = useState(true);
    const [isLBConfigOpen, setLBConfigOpen] = useState(false);

    useEffect(() => {
    });

    return (
        <div>
            <ExpansionPanel expanded={isConfigExpanded} onChange={() => setConfigExpand(!isConfigExpanded)}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1bh-content'
                    id='panel1bh-header'
                    className={classes.configHeaderContainer}
                >
                    <Typography className={classes.heading}>
                        <FormattedMessage
                            id='Apis.Details.EndpointsNew.GeneralConfiguration.general.configuration.heading'
                            defaultMessage='GeneralConfiguration'
                        />
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                        Endpoint Type: {epConfig.endpoint_type}, Endpoint Security: , Certificates: None
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container direction='row'>
                        <Grid item xs container className={classes.endpointConfigSection} direction='column'>
                            <FormControl className={classes.endpointTypeSelect}>
                                <InputLabel htmlFor='endpoint-type-select'>
                                    <FormattedMessage
                                        id='Apis.Details.EndpointsNew.EndpointOverview.endpointType'
                                        defaultMessage='Endpoint Type'
                                    />
                                </InputLabel>
                                <Select
                                    value={isSOAPEndpoint.key}
                                    onChange={handleEndpointTypeSelect}
                                    inputProps={{
                                        name: 'key',
                                        id: 'endpoint-type-select',
                                    }}
                                >
                                    {endpointTypes.map((type) => {
                                        return (<MenuItem value={type.key}>{type.value}</MenuItem>);
                                    })}
                                </Select>
                            </FormControl>
                            {/*<div className={classes.endpointTypesSelectWrapper}>*/}
                            {/*    <FormControl component='fieldset' className={classes.formControl}>*/}
                            {/*        <RadioGroup*/}
                            {/*            aria-label='Gender'*/}
                            {/*            name='gender1'*/}
                            {/*            className={classes.radioGroup}*/}
                            {/*            value={epConfig.endpoint_type}*/}
                            {/*            onChange={onChangeEndpointCategory}*/}
                            {/*        >*/}
                            {/*            <FormControlLabel*/}
                            {/*                value='http'*/}
                            {/*                control={<Radio />}*/}
                            {/*                label='Default'*/}
                            {/*            />*/}
                            {/*            <FormControlLabel*/}
                            {/*                value='load_balance'*/}
                            {/*                control={<Radio />}*/}
                            {/*                label='Load balance'*/}
                            {/*            />*/}
                            {/*            <FormControlLabel*/}
                            {/*                value='failover'*/}
                            {/*                control={<Radio />}*/}
                            {/*                label='Failover'*/}
                            {/*            />*/}
                            {/*        </RadioGroup>*/}
                            {/*    </FormControl>*/}
                            {/*    <div className={classes.loadbalanceBtnContainer}>*/}
                            {/*        <Button*/}
                            {/*            disabled={epConfig.endpoint_type !== 'load_balance'}*/}
                            {/*            onClick={() => setLBConfigOpen(true)}*/}
                            {/*            className={classes.loadBalanceConfigButton}*/}
                            {/*        >*/}
                            {/*            <Icon>*/}
                            {/*                settings*/}
                            {/*            </Icon>*/}
                            {/*        </Button>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </Grid>
                        <Grid item xs className={classes.endpointConfigSection}>
                            <FormControlLabel
                                value='start'
                                checked={endpointSecurityInfo !== null}
                                control={<Switch color='primary' />}
                                label={<FormattedMessage
                                    id='Apis.Details.EndpointsNew.EndpointOverview.endpoint.security.enable.switch'
                                    defaultMessage='Endpoint Security'
                                />}
                                labelPlacement='start'
                                onChange={handleToggleEndpointSecurity}
                            />
                            <Collapse in={endpointSecurityInfo !== null}>
                                <EndpointSecurity
                                    securityInfo={endpointSecurityInfo}
                                    onChangeEndpointAuth={handleEndpointSecurityChange}
                                />
                            </Collapse>
                        </Grid>
                        <Grid item xs className={classes.endpointConfigSection}>
                            {/*<Certificates />*/}
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <Dialog open={isLBConfigOpen}>
                <DialogTitle>
                    <Typography className={classes.dialogHeader}>
                        <FormattedMessage
                            id='Apis.Details.EndpointsNew.EndpointListing.loadbalance.endpoint.configuration'
                            defaultMessage='Load Balance Endpoint Configuration'
                        />
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <LoadBalanceConfig />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLBConfigOpen(false)} color='primary'>
                        <FormattedMessage id='Apis.Details.EndpointsNew.EndpointListing.close' defaultMessage='Close' />
                    </Button>
                    <Button onClick={() => setLBConfigOpen(false)} color='primary' autoFocus>
                        <FormattedMessage id='Apis.Details.EndpointsNew.EndpointListing.save' defaultMessage='Save' />
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

GeneralConfiguration.propTypes = {
    epConfig: PropTypes.shape({}).isRequired,
    endpointSecurityInfo: PropTypes.shape({}).isRequired,
    onChangeEndpointCategory: PropTypes.func.isRequired,
    handleToggleEndpointSecurity: PropTypes.func.isRequired,
    handleEndpointSecurityChange: PropTypes.func.isRequired,
    handleEndpointTypeSelect: PropTypes.func.isRequired,
    isSOAPEndpoint: PropTypes.shape({}).isRequired,
    classes: PropTypes.shape({}).isRequired,
};

export default injectIntl(withStyles(styles)(GeneralConfiguration));

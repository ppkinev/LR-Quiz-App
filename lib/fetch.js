import axios from 'axios'
import {getAccessToken} from './auth-utils'

//require("imports?window=>{},this=>window!exports?window.easyXDM!./easyXDM.debug.js"); // TODO

export const XDM = {
    api: {},
    foundationUrl: ''
};

export const AppConfig = {
    virtualBetFlow: true
};

export const getApp = function (response) {
    if (response.data.IsActive) {
        // XDM.foundationUrl = response.data.FoundationRewardsSiteUrl;
        // XDM.api.rpcAuthCreate();

        if (response.data['CustomData']
            && response.data['CustomData']['VirtualBetFlow'] !== undefined
            && response.data['CustomData']['VirtualBetFlow'] !== null
            && response.data['CustomData']['VirtualBetFlow'] !== 'off'
        )
            AppConfig.virtualBetFlow = response.data['CustomData']['VirtualBetFlow'];
    }
};

function fetch(options, callback) {
    const {method = 'GET', endpoint, data} = options;

    return new Promise((resolve, reject) => {
        getAccessToken(function (token) {
            if (token) {
                const axiosConfig = {
                    url: window.config.apiPrefix + endpoint,
                    method: method,
                    mode: 'cors',
                    headers: {
                        'Authorization': token
                    }
                };

                if (method === 'POST') axiosConfig.data = data;
                else axiosConfig.params = data;


                console.info('Getting ' + endpoint + ' using axios');
                axios(axiosConfig)
                    .then(function (result) {
                        const status = result.status;
                        console.info('Getting ' + endpoint + ' succeed');

                        if (status === 401) {
                            // do something on unauthorize
                            // DGW.global.methods.unAuthorize();
                        }

                        if (callback) callback(result);
                        resolve(result.data);
                    })
                    .catch(function (error) {
                        if (error.response) {
                            console.warn('Getting ' + endpoint + ' failed');
                            console.warn(error);

                            const status = error.response.status;
                            if (status === 401) {
                                // do something on unauthorize
                                // DGW.global.methods.unAuthorize();
                            }
                            if (callback) callback(error.response);
                            reject(error);
                        }
                    });

            }
        })
    });
}

export default fetch;

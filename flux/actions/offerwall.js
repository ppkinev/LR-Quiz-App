import fetch, {apiPrefix, apiKey} from '../../lib/fetch.js';

export const FETCH_OFFERWALLS = 'FETCH_OFFERWALLS';
export const FETCH_OFFERWALLS_FAIL = 'FETCH_OFFERWALLS_FAIL';
export const FETCH_OFFERWALLS_SUCCESS = 'FETCH_OFFERWALLS_SUCCESS';


function getOfferWallsSuccess(offerwalls) {

    offerwalls = offerwalls.map((offerwall) => {
        return {
            url: offerwall['CustomData']['Url']
                .replace(/\[APIKEY]/g, apiKey)
                .replace(/\[OWID]/g, offerwall['Id']),
            name: offerwall['Sponsor']['Name'],
            sortOrder: offerwall['Sponsor']['SortOrder']
        }
    }).sort((a, b) => a.sortOrder - b.sortOrder);

    return {
        type: FETCH_OFFERWALLS_SUCCESS,
        payload: offerwalls
    }
}

export function getOfferWalls() {
    return (dispatch) => {
        dispatch({type: FETCH_OFFERWALLS});

        return fetch({
            endpoint: 'offer/getofferwalls'
        })
        .then((offerwalls) => {
            dispatch(getOfferWallsSuccess(offerwalls['OfferWalls']));
        })
        .catch({type: FETCH_OFFERWALLS_FAIL});
    };
}

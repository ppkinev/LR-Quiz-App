import partnersData from '../../components/PartnersContainer/data.js'; // fake response data
// TODO- api

export const FETCH_PARTNERS = 'FETCH_PARTNERS';
export const FETCH_PARTNERS_SUCCESS = 'FETCH_PARTNERS_SUCCESS';
export const FETCH_PARTNERS_ERROR = 'FETCH_PARTNERS_ERROR'; // TODO

const DELAY = 100;

function fetchPartnersStart() {
	return {
		type: FETCH_PARTNERS,
	};
}


function fetchPartnersSuccess(json) {
	return {
		type: FETCH_PARTNERS_SUCCESS,
		payload: json,
		receivedAt: Date.now()
	};
}

export function fetchPartners() {
	return (dispatch) => {
		dispatch(fetchPartnersStart());

		console.log('>>TODO: fetch /partners');

		const response = partnersData;

		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(response), DELAY);
		}).then((json) => {
			dispatch(fetchPartnersSuccess(json));
		});
	};
}

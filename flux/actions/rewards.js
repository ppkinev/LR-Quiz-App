import fetch, { apiPrefix, apiKey } from '../../lib/fetch.js';
import { Window } from '../../lib/utils.js';
import { fetchProfile, fetchProfileSuccess } from './profile.js'

export const FETCH_REWARDS = 'FETCH_REWARDS';
export const FETCH_REWARDS_SUCCESS = 'FETCH_REWARDS_SUCCESS';
export const FETCH_REWARDS_ERROR = 'FETCH_REWARDS_ERROR';

const REWARD_FACEBOOK_SHARE_TYPE = 'FacebookShare';
const REWARD_FACEBOOK_CONNECT_TYPE = 'FacebookConnect';
const REWARD_TWITTER_SHARE_TYPE = 'TwitterShare';
const REWARD_TWITTER_SHARE_ID = 5;


export const SHOW_SHARE = 'SHOW_SHARE';
export const HIDE_SHARE = 'HIDE_SHARE';


const popup = Window();


function fetchRewardsStart() {
	return {
		type: FETCH_REWARDS
	};
}

function fetchRewardsSuccess(json) {
	return {
		type: FETCH_REWARDS_SUCCESS,
		payload: json.Actions.reduce((acc, {
			Id: rewardId,
			PointsReward: rewardPoints,
			Type: rewardType,
			}) => {
			switch (rewardType) {
				case REWARD_FACEBOOK_SHARE_TYPE:
					return {
						...acc,
						facebookShare: {
							rewardId,
							rewardPoints
						}
					};
				case REWARD_FACEBOOK_CONNECT_TYPE:
					return {
						...acc,
						facebookConnect: {
							rewardId,
							rewardPoints
						}
					};
				case REWARD_TWITTER_SHARE_TYPE:
					return {
						...acc,
						twitterShare: {
							rewardId,
							rewardPoints
						}
					};
				default:
					return acc;
			}
		}, {}),
		receivedAt: Date.now()
	};
}

function fetchRewardsError(error) {
	return {
		type: FETCH_REWARDS_ERROR,
		error
	};
}

export function fetchRewards() {
	return (dispatch) => {
		dispatch(fetchRewardsStart());

		return fetch({
			endpoint: 'rewardedaction/getuseractions'
		}).then((json) => {
			dispatch(fetchRewardsSuccess(json));
		}).catch(({ Message: error = 'Invalid'}) => {
			dispatch(fetchRewardsError(error)); // TODO
			//throw error;
		});
	};
}

export function fetchRewardsNotLoggedIn() {
	return (dispatch) => {
		dispatch(fetchRewardsStart());

		return fetch({
			endpoint: 'rewardedaction/getactions'
		}).then((json) => {
			dispatch(fetchRewardsSuccess(json));
		}).catch(({ Message: error = 'Invalid'}) => {
			dispatch(fetchRewardsError(error)); // TODO
			//throw error;
		});
	};
}

function postTrackRewards(typeId) {
	return (dispatch) => {
		return fetch({
			method: 'POST',
			endpoint: 'rewardedaction/trackrewardedaction',
			data: {
				'RewardedActionTypeId': typeId,
			}
		}).then((json) => {
			dispatch(fetchRewards()).then(() => {
				dispatch(fetchProfileSuccess(json.User));
			});
		}).catch(() => {
			//TODO
		});
	};
}

export function startSharingFacebook(matchId) {
	return (dispatch) => {
		const { origin } = document.location;
		const sharedUrl = `${origin}/quiz?matchId=${matchId}`;
		const url = `${apiPrefix}rewardedaction/facebookshare?api_key=${apiKey}&shareurl=${ encodeURIComponent(sharedUrl) }`;

		//console.log('>>[%s]', url);

		popup.open({url}, () => {
			dispatch(fetchRewards());
			dispatch(fetchProfile());
			
		});
	};
}

export function startSharingTwitter(matchId) {
	return (dispatch) => {
		const tweetText = 'Mates, I\'ve made prediction for Premier League, join to win free prizes';
		const { origin } = document.location;
		const sharedUrl = `${origin}/quiz?matchId=${matchId}`;
		const url = `https://twitter.com/intent/tweet?text=${ encodeURI(tweetText) }&url=${ encodeURIComponent(sharedUrl) }&hashtags=EPL,Everton,matchquiz`;
		const title = 'Twitter';

		popup.open({url}, () => {
			dispatch(postTrackRewards(REWARD_TWITTER_SHARE_ID));
			
		});
	};
}

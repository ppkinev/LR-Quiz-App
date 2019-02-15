import { FETCH_BADGES, FETCH_BADGES_SUCCESS, FETCH_BADGES_ERROR } from '../actions';

export function badges(state = {
	isFetching: false,
	earned: [],
	missing: []
}, action) {
	switch (action.type) {

		case FETCH_BADGES:
			return {
				...state,
				isFetching: true
			};

    case FETCH_BADGES_SUCCESS:
			const { earnedBadges, badges } = action.payload;

      return {
        ...state,
				isFetching: false,
        earned: badges.filter(badge => {
					return earnedBadges.some(earnedBadge => earnedBadge.BadgeId === badge.BadgeId);
				}),
				missing: badges.filter(badge => {
					return !earnedBadges.some(earnedBadge => earnedBadge.BadgeId === badge.BadgeId);
				})
      };

		case FETCH_BADGES_ERROR:
			return {
				...state,
				isFetching: false,
				earned: [],
				missing: []
			}

		default:
			return state;
	}
  return state;
}

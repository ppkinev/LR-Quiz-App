import { combineReducers } from 'redux';
import { showWelcomePopup, auth } from './auth.js';
import { profile } from './profile.js';
import { fixtures } from './fixtures.js';
import { quizes, selectedMatchId } from './quiz.js';
import { partners } from './partners.js';
import { userList, userProfiles, selectedUserProfile } from './users.js';
import { draws, selectedDrawId } from './draws.js';
import { rewards } from './rewards.js';
import { earns } from './earns.js';
import { offerwalls } from './offerwall.js';
import { videoPopup } from './video-popup.js';
import { surveyPopup } from './survey-popup.js';
import { badges } from './badges.js';
import { friends } from './friends.js';
import { user } from './user.js';
import { activity } from './activity.js';
import { notifications } from './notifications.js';
import { leaderboard } from './leaderboard.js';
import { inviteFriends } from './inviteFriends'


const rootReducer = combineReducers({
	showWelcomePopup,
	auth,
	profile,
	fixtures,
	quizes,
	selectedMatchId,
	draws,
	selectedDrawId,
	rewards,
	earns,
    offerwalls,
	videoPopup,
    surveyPopup,
	badges,
	friends,
	user,
	activity,
	notifications,
	leaderboard,
	inviteFriends,

	// Somewhat shaky:
	partners,
	userList,
	userProfiles,
	selectedUserProfile,
});

export default rootReducer;

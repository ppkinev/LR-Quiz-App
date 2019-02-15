import {TOGGLE_NOTIFICATION, CLOSE_NOTIFICATION, OPEN_NOTIFICATION} from '../actions';
import _ from 'lodash';
import moment from 'moment';

export function notifications(state = {

    list: [
        {
            type: 'registration',
            title: 'Thanks for registaration!',
            msg: 'You\'ve got extra +5 points.',
            show: false
        },
        {
            type: 'leaderboard',
            title: 'Leaderboard updated!',
            msg: 'Meet new leaders of this month.',
            show: false
        },
        {
            type: 'invite-friend',
            title: 'Invite your friends!',
            msg: 'And you`ll get additional +50 points.',
            show: true
        },
        {
            type: 'top3',
            title: 'You`ve got in TOP 3 !!!',
            msg: 'Have a look at leaderboards.',
            show: false
        }
    ],
    active: ''

}, action) {
    switch (action.type) {

        case TOGGLE_NOTIFICATION:
            return {
                ...state,
                list: state.list.map(item => {
                    if (item.type === action.notification) {
                        item.show = !item.show;
                    }
                    return item;
                }),
                active: action.notification
            };


        case OPEN_NOTIFICATION :
            return {
                ...state,
                list: state.list.map(item => {
                    item.show = false;
                    if (item.type === action.notification) {
                        console.warn(item);
                        item.show = true;
                    }
                    return item;
                })
            };

        case CLOSE_NOTIFICATION :
            return {
                ...state,
                list: state.list.map(item => {
                    if (item.type === action.notification) {
                        console.warn(item);
                        item.show = false;
                    }
                    return item;
                })
            };

        default:
            return state;
    }
}

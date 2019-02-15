import {
    OPEN_VIDEO_POPUP,
    CLOSE_VIDEO_POPUP
} from '../actions';

export function videoPopup(state = {
    isOpen: false,
    videoUrl: '',
    earnId: ''
}, action) {

    switch (action.type) {
        case OPEN_VIDEO_POPUP:
            return {
                ...state,
                isOpen: true,
                videoUrl: action.videoUrl,
                earnId: action.earnId
            };

        case CLOSE_VIDEO_POPUP:
            return {
                ...state,
                isOpen: false,
                videoUrl: '',
                earnId: ''
            };

        default:
            return state;
    }
}

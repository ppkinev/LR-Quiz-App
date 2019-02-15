export const OPEN_VIDEO_POPUP = 'OPEN_VIDEO_POPUP';
export const CLOSE_VIDEO_POPUP = 'CLOSE_VIDEO_POPUP';

export function openVideoPopup(earnId, videoUrl) {
    return {
        type: OPEN_VIDEO_POPUP,
        earnId: earnId,
        videoUrl: videoUrl
    }
}

export function closeVideoPopup() {
    return {
        type: CLOSE_VIDEO_POPUP,
        earnId: null,
        videoUrl: null
    }
}

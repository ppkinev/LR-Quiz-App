
export const TOGGLE_NOTIFICATION = 'TOGGLE_NOTIFICATION';
export const OPEN_NOTIFICATION = 'OPEN_NOTIFICATION';
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';
export const NOTIFICATIONS_CHECK = 'NOTIFICATIONS_CHECK';

export function toggle_notification(notification) {
  return {
    type: TOGGLE_NOTIFICATION,
    notification,
  }
}

export function open_notification(notification) {
  return {
    type: OPEN_NOTIFICATION,
    notification,
  }
}

export function close_notification(notification) {
  return {
    type: CLOSE_NOTIFICATION,
    notification,
  }
}

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Header from '../Header';
import Menu from '../Menu';
import AuthPopup from '../AuthPopup';
import WelcomePopup from '../WelcomePopup';
import Notifications from '../Notifications';
import {toggle_notification, fetchProfileIfNeeded} from '../../flux/actions';
import {userManager, saveAuthSettings, getAuthSettings} from '../../lib/auth-utils';
import './Layout.scss';


export const Fetching = ({isOnTop}) => {
    const overlay = isOnTop ? ' overlay' : '';
    return (
        <div className={'fetching' + overlay}>
            <div className="loader"></div>
        </div>
    );
};


class Layout extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        showAuthPopup: PropTypes.bool.isRequired,
        authPopupView: PropTypes.string.isRequired,
        showWelcomePopup: PropTypes.bool.isRequired,
        children: PropTypes.element.isRequired,

        surveyIsOpen: PropTypes.bool,

        fetchProfile: PropTypes.func.isRequired
    };

    static childContextTypes = {
        updateHeader: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {
            updateHeader: (opts) => this.updateHeader(opts)
        }
    }

    state = {
        showMenu: false,
        header: {
            title: '',
            hasBack: false,
            hasLogout: false,
            directBack: ''
        },

        checkForUserTries: 0,
        userWasInitiallyGot: false,
    };

    stopCheckingForUser({isUserGot} = {}) {
        this.setState({
            userWasInitiallyGot: !!isUserGot
        });
        window.clearInterval(this.checkForUserInterval);
    }

    componentWillReceiveProps({path, title}) {
        const hasNavigated = this.props.path !== path;
        if (hasNavigated) {
            this.updateHeader({title}); // reset all updates on navigate
        }
    }

    componentDidMount() {
        this.checkForUserInterval = window.setInterval(() => {
            if (this.state.userWasInitiallyGot) this.stopCheckingForUser({isUserGot: true});

            userManager.getUser().then(user => {
                if (user) {
                    this.props.fetchProfile();
                    this.stopCheckingForUser({isUserGot: true});
                }
            });

            this.setState({
                checkForUserTries: this.state.checkForUserTries + 1
            }, () => {
                if (this.state.checkForUserTries >= 10) {
                    this.stopCheckingForUser();
                }
            })

        }, 300);
    }

    toggleMenu(on) {
        this.setState({
            showMenu: on
        });
    }

    updateHeader({title = '', hasBack = false, hasLogout = false, hasInviteFriendsIco = false, directBack = ''}) {

        this.setState({
            header: {
                title,
                hasBack,
                hasLogout,
                hasInviteFriendsIco,
                directBack
            }
        });
    }

    render() {
        const {title: pageTitle, path, showAuthPopup, authPopupView, showWelcomePopup, children, notifications, toggle_notification, surveyIsOpen} = this.props;
        const {showMenu, header: {title: stateTitle, hasBack, directBack, hasLogout, hasInviteFriendsIco}} = this.state;
        // const contentClass = (path === '/partners') ? 'safari-scroll-fix' : '';

        const surveyShownClass = surveyIsOpen ? 'survey-popup-shown' : '';
        const contentClasses = ['content', surveyShownClass].join(' ');
        const layoutClasses = ['layout', surveyShownClass].join(' ');

        return (
            <div className={layoutClasses}>
                <Header
                    title={stateTitle || pageTitle}
                    hasBack={hasBack}
                    directBack={directBack}
                    hasLogout={hasLogout}
                    hasInviteFriendsIco={hasInviteFriendsIco}
                    onMenuBtnClick={() => this.toggleMenu(true)}
                />

                <Notifications list={notifications.list} active={notifications.active} toggle={toggle_notification}/>

                <Menu
                    activePath={path}
                    show={showMenu}
                    onClick={() => this.toggleMenu(false)}
                />

                <AuthPopup show={showAuthPopup} view={authPopupView}/>

                <WelcomePopup show={showWelcomePopup}/>

                <div className={contentClasses}>
                    {children}
                </div>
            </div>
        );
    }

}


// Connect to store
//
const mapStateToProps = (state) => {
    const {auth, showWelcomePopup, notifications, surveyPopup} = state;
    return {
        showAuthPopup: auth.showAuthPopup,
        authPopupView: auth.authPopupView,
        showWelcomePopup,
        notifications,
        surveyIsOpen: surveyPopup.isOpen
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggle_notification: () => dispatch(toggle_notification()),
        fetchProfile: () => dispatch(fetchProfileIfNeeded()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);

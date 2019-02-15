import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {toggleWelcome} from '../../flux/actions';
import ScreenSwiper from '../ScreenSwiper';
import {AppConfig} from '../../lib/fetch';
import './WelcomePopup.scss';

import {isFacebookApp, getBrandName, getWelcomeImagesPath} from '../../lib/utils';

const brandName = getBrandName(window.config.skin) || 'Everton';
const imagesPath = getWelcomeImagesPath(window.config.skin) || '';

const slides = {
    default: [
        {
            icon: 'win',
            title: `Win ${brandName} Prizes`,
            lines: ['exclusive merchandise', 'money can’t buy experiences']
        },
        {
            icon: 'earn',
            title: `Earn ${brandName} Points`,
            lines: ['predicting match outcomes', 'downloading apps', 'sharing & more']
        },
        {
            icon: 'predict',
            title: 'Predict Match Scores',
            lines: ['beat your mates', 'rank highest in Leaderboards']
        }
    ],
    virtualBet: [
        {
            icon: 'credits',
            title: `Earn Free ${brandName} Cash to Bet`,
            lines: ['download apps', 'take surveys']
        },
        {
            icon: 'win',
            title: 'Predict Correct Score',
            lines: ['&', `win ${brandName} cash for free`]
        },
        {
            icon: 'earn',
            title: 'Compete',
            lines: ['follow top predictors', 'feature in leaderboards', 'see friends predictions']
        },
        {
            icon: 'predict',
            title: `Earn ${brandName} Points`,
            lines: ['predict correct outcomes', 'win prizes']
        }
    ]
};

// const clubImages = {
//     everton: {
//         win: require('./images/welcome-fig-win.svg'),
//         credits: require('./images/welcome-fig-credits.png'),
//         earn: require('./images/welcome-fig-earn.svg'),
//         predict: require('./images/welcome-fig-predict.svg')
//     },
//     mbet: {
//         win: require('./images/mbet-welcome/mbet-welcome-fig-win.svg'),
//         credits: require('./images/mbet-welcome/mbet-welcome-fig-credits.png'),
//         earn: require('./images/mbet-welcome/mbet-welcome-fig-earn.svg'),
//         predict: require('./images/mbet-welcome/mbet-welcome-fig-predict.svg')
//     }
// };

const WelcomeScreen = ({figure, title, lines}) => {
    const linesStyled = lines.map((text, i) => {
        const opacity = .8 - .2 * i;
        return <p key={`p-${i}`} style={{opacity}}>{ text }</p>;
    });

    const isMBet = window.config.skin === 'mbet';

    let image;

    switch (figure) {
        case 'win':
            image = <img src={ require('../../static/images/welcome-fig-win.svg') }/>;
            if (isMBet) image = <img src={ require('../../static/images/mbet-welcome/mbet-welcome-fig-win.svg') }/>;
            break;
        case 'credits':
            image = <img src={ require('../../static/images/welcome-fig-credits.png') }/>;
            if (isMBet) image = <img src={ require('../../static/images/mbet-welcome/mbet-welcome-fig-credits.png') }/>;
            break;
        case 'earn':
            image = <img src={ require('../../static/images/welcome-fig-earn.svg') }/>;
            if (isMBet) image = <img src={ require('../../static/images/mbet-welcome/mbet-welcome-fig-earn.svg') }/>;
            break;
        case 'predict':
            image = <img src={ require('../../static/images/welcome-fig-predict.svg') }/>;
            if (isMBet) image = <img src={ require('../../static/images/mbet-welcome/mbet-welcome-fig-predict.svg') }/>;
    }

    return (
        <div className="welcome-content">
            <div className="welcome-figure">
                { image }
            </div>
            <div className="welcome-text">
                <h2 className="welcome-title">{ title }</h2>
                { linesStyled }
            </div>
        </div>
    );
};


const WelcomeFooter = ({stepIdx, onNext, onSkip, slidesLength}) => {
    let bullets = [];
    for (let i = 0; i < slidesLength; i++) {
        bullets.push(
            <li key={`bullet-${i}`} className={"bullet" + ((i === stepIdx) ? ' active' : '')}></li>
        );
    }

    const lastSlide = stepIdx === slidesLength - 1;
    const leftBtnStyle = lastSlide ? {visibility: 'hidden'} : {};
    let rightBtn = (
        <div className="welcome-footer-link right" onClick={ onNext }>
            Next
            <img className="icon-next" src={ require('../../static/images/arrow-left-white.png') }/>
        </div>
    );
    if (lastSlide) {
        rightBtn = <div className="welcome-footer-link right" onClick={ onSkip }>Done</div>;
    }

    return (
        <div className="welcome-footer">
            <div className="welcome-footer-link left" style={ leftBtnStyle } onClick={ onSkip }>Skip</div>
            <ul className="welcome-bullets">
                { bullets }
            </ul>
            { rightBtn }
        </div>
    );
};


class WelcomePopup extends Component {

    static propTypes = {
        show: PropTypes.bool.isRequired,
        //from store
        onClose: PropTypes.func.isRequired,
    };

    state = {
        currentScreenIdx: 0,
        slides: AppConfig.virtualBetFlow ? slides.virtualBet : slides.default
    };

    nextScreen() {
        const {currentScreenIdx: idx, slides} = this.state;
        const totalSteps = slides.length;
        if (idx + 1 < totalSteps) {
            this.setState({
                currentScreenIdx: idx + 1
            })
        }
    }

    prevScreen() {
        const {currentScreenIdx: idx} = this.state;
        if (idx > 0) {
            this.setState({
                currentScreenIdx: idx - 1
            });
        }
    }

    render() {
        const {show, onClose} = this.props;
        const {currentScreenIdx: idx, slides} = this.state;
        const hiddenClass = !show ? 'is-hidden' : '';
        const onPrev = () => this.prevScreen();
        const onNext = () => this.nextScreen();
        const onSkip = () => onClose();

        const welcomeSlides = slides.map((slide) => {
            return <WelcomeScreen
                figure={ slide.icon }
                title={ slide.title }
                lines={ slide.lines }
            />
        });

        const classForFBApp = isFacebookApp ? ' fb-app' : '';

        return (
            <div className={"popup-screen welcome-screen " + hiddenClass }>
                <div className={"welcome-popup" + classForFBApp}>
                    <ScreenSwiper currentScreenIdx={ idx } onPrevScreen={onPrev} onNextScreen={onNext}>
                        { welcomeSlides }
                    </ScreenSwiper>

                    <WelcomeFooter
                        stepIdx={ idx }
                        onNext={ onNext }
                        onSkip={ onSkip }
                        slidesLength={ slides.length }
                    />
                </div>
            </div>
        );
    }
}

// Connect to store
//
const mapDispatchToProps = (dispatch) => {
    return {
        onClose: () => dispatch(toggleWelcome(false)),
    };
};

export default connect(null, mapDispatchToProps)(WelcomePopup);

import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import Link from '../Link';
import Button from '../Button';
import Slider from '../Slider';
import SectionCollapsible from '../SectionCollapsible';
import Countdown from '../Countdown';
import './DrawBet.scss';


class DrawBet extends Component {

    static propTypes = {
        drawItem: PropTypes.object.isRequired,
        points: PropTypes.number.isRequired,
        demoPoints: PropTypes.number.isRequired,
        onSubmit: PropTypes.func.isRequired,
        betError: PropTypes.string,
    };

    state = {
        betValue: undefined,
        madeBet: false
    };

    handelBetValueChange(betValue) {
        this.setState({betValue});
    }

    submitButtonChange() {
        const {onSubmit, drawItem: {drawId}, nextPage, isLoggedIn, points, demoPoints} = this.props;
        const {betValue = (demoPoints || points)} = this.state;

        if (!isLoggedIn) {
            nextPage();
            return;
        }

        onSubmit(drawId, betValue).then(() => {
            this.setState({madeBet: true});
            window.setTimeout(() => {
                nextPage();
            }, 1000);
        });
    }

    render() {
        const {
            drawItem: {prizeTitle, prizeImageUrl, prizeDescription, endDate},
            points,
            demoPoints,
            betError = ''
        } = this.props;
        const maxPoints = (demoPoints || points);
        const minPoints = maxPoints > 0 ? 1 : 0;
        let {betValue = maxPoints, madeBet} = this.state;
        betValue = Math.min(maxPoints, betValue);

        const disabledBet = (betValue === 0);
        const disabledBtnClass = disabledBet ? ' disabled' : '';
        const successClass = madeBet ? ' success' : '';
        const dateFormatted = moment(endDate).format('YYYY/MM');
        const errorClass = betError ? 'reveal' : '';
        const onChange = (v) => this.handelBetValueChange(v);
        const onBtnClick = () => !disabledBet && this.submitButtonChange();

        const btnText = madeBet ? 'Thanks!' : 'Place points';

        const betErrorEl = betError.length > 0 ? (<div className={"bet-error " + errorClass}>{ betError }</div>) : null;

        return (
            <div className="draw-content">

                <div className="draw-panel">
                    <div className="draw-details">
                        <div className="draw-details-image">
                            <img src={ prizeImageUrl }/>
                        </div>
                        <div className="draw-details-content">
                            <Countdown dateStr={ endDate }/>
                            <h3 className="list-title">{ prizeTitle }</h3>
                            <h5 className="list-meta">{ dateFormatted }</h5>
                        </div>
                    </div>

                    <SectionCollapsible>
                        <div className="bet-description">{ prizeDescription }</div>
                    </SectionCollapsible>

                    <div className="bet-subtitle">How many points<br/> you want to place?</div>

                    <div className="bet-value">
                        <span className="bet-points">{ betValue }</span>
                        <span> { `point${ betValue === 1 ? '' : 's' }` }</span>
                    </div>

                    <Slider min={ minPoints } max={ maxPoints } value={ betValue } step={ 1 } onChange={ onChange }/>

                    { betErrorEl }

                    <Button className={"big-btn money-btn" + disabledBtnClass + successClass} onClick={onBtnClick}>
                        { btnText }
                    </Button>
                </div>

                <div className="draw-panel">
                    <Link className="big-btn share-btn" to="./earn">Earn more points</Link>
                </div>
            </div>
        );
    }
}

export default DrawBet;

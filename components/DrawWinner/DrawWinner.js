import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import Link from '../Link';
import SectionCollapsible from '../SectionCollapsible';
import './DrawWinner.scss';


class DrawWinner extends Component {

    static propTypes = {
        drawItem: PropTypes.object.isRequired,
    };

    render() {
        const {
            drawItem: {
                prizeTitle, prizeImageUrl, prizeDescription, endDate,
                winner: {
                    ImageUrl: winnerImageUrl,
                    UserName: winnerUseName
                }
            }
        } = this.props;
        const titleDateEnded = `Finished ${ moment(endDate).fromNow() }`;
        const dateFormatted = moment(endDate).format('YYYY/MM');

        return (
            <div className="draw-content">
                <div className="draw-panel">
                    <div className="draw-details">
                        <div className="draw-details-image">
                            <img src={ prizeImageUrl }/>
                        </div>
                        <div className="draw-details-content">
                            <h3 className="list-meta as-header">{ titleDateEnded }</h3>
                            <h3 className="list-title">{ prizeTitle }</h3>
                            <h5 className="list-meta">{ dateFormatted }</h5>
                        </div>
                    </div>

                    <SectionCollapsible>
                        <div className="bet-description">{ prizeDescription }</div>
                    </SectionCollapsible>

                    <div className="draw-winner">
                        <div className="draw-winner-image">
                            <img src={ winnerImageUrl }/>
                        </div>
                        <div className="draw-winner-text orange">{ winnerUseName } has won this draw</div>
                        <div className="draw-winner-text">Our congratulations!</div>
                    </div>
                </div>

                <div className="draw-panel">
                    <Link className="big-btn share-btn" to="./earn">Earn more points</Link>
                </div>
            </div>
        );
    }
}

export default DrawWinner;

import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import Link from '../Link';
import SectionCollapsible from '../SectionCollapsible';
import './DrawStatic.scss';


class DrawStatic extends Component {

    static propTypes = {
        drawItem: PropTypes.object.isRequired,
        withLabel: PropTypes.bool.isRequired,
        children: PropTypes.any.isRequired,
    };

    render() {
        const {drawItem: {prizeTitle, prizeImageUrl, prizeDescription, endDate}, withLabel, children} = this.props;
        const titleDateEnded = `Finished ${ moment(endDate).fromNow() }`;
        const dateFormatted = moment(endDate).format('YYYY/MM');
        const labelMaybe = withLabel ? <div className="draw-details-label orange">You won!</div> : '';

        return (
            <div className="draw-content draw-static">
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
                        { labelMaybe }
                    </div>

                    <SectionCollapsible>
                        <div className="bet-description">{ prizeDescription }</div>
                    </SectionCollapsible>

                    { children }

                </div>

                <div className="draw-panel">
                    <Link className="big-btn share-btn" to="./earn">Earn more points</Link>
                </div>
            </div>
        );
    }
}

export default DrawStatic;

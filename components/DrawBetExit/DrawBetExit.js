import React, { Component, PropTypes } from 'react';
import Link from '../Link';
import './DrawBetExit.scss';


class DrawBetExit extends Component {

	static propTypes = {
		nextDrawItem: PropTypes.object.isRequired
	};

	render() {
		const { drawId, prizeImageUrl } = this.props.nextDrawItem;

		return (
			<div className="draw-exit">
				<div className="draw-panel">
					<div className="big-image">
						<img src={ prizeImageUrl }/>
					</div>

					<Link className="big-btn money-btn" to="./draw" query={ {drawId} }>
						Enter next draw
					</Link>
				</div>

                <div className="draw-panel">
                    <Link className="big-btn share-btn" to="./earn">
                        Earn more points
                    </Link>
                </div>
			</div>
		);
	}
}

export default DrawBetExit;

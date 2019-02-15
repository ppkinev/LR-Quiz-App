import React, { Component, PropTypes } from 'react';
import Link from '../Link';
import './QuizBetExit.scss';


class QuizBetExit extends Component {

	static propTypes = {
		latestDrawItem: PropTypes.object.isRequired,
	};

	render() {
		const { prizeImageUrl } = this.props.latestDrawItem;

		return (
			<div className="quiz-exit">

				<Link className="big-image-panel" to="./draws">
					<div className="quiz-big-image">
						<img src={ require('./images/s1.png') }/>
					</div>
					<div>
						<div className='quiz-exit-title free-draws'>Enter Free Draws</div>
						<span className='quiz-exit-subtitle'>Spend your pts on exclusive merchandise</span>
					</div>
				</Link>

				<Link className="big-image-panel" to="./earn">
					<div className="quiz-big-image">
						<img src={ require('./images/s2.png') }/>
					</div>
					<div>
						<div className='quiz-exit-title earn-more'>Earn more points</div>
						<span className='quiz-exit-subtitle'>Complete some action & earn extra points</span>
					</div>
				</Link>

                {/*
                // TODO: activate when proper partners are ready
				<Link className="big-image-panel" to="./partners">
					<div className="quiz-big-image">
						<img src={ require('./images/s3.png') }/>
					</div>
					<div>
						<div className='quiz-exit-title signup-bet'>SignUp to our betting partner</div>
						<span className='quiz-exit-subtitle'>and get +500 points</span>
					</div>
				</Link>
				*/}

			</div>
		);
	}
}

export default QuizBetExit;

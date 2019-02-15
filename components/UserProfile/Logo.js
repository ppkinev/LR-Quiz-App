import React, { Component, PropTypes } from 'react';
import '../LeaderBoard/leader-board.scss'; // TODO


class Logo extends Component {

	static propTypes = {
		src: PropTypes.string,
		rank: PropTypes.number
	};

	render() {
		const { src, rank } = this.props;
		const defaultPicture = require("../../static/images/user-default.png");
		let medalImg;
		if (rank) {
			const medal = ['gold', 'silver', 'bronze'][rank - 1];
			medalImg = <div className={`user-medal ${medal}`}>{ rank }</div>;
		}
		return (
			<div className="user-logo-cont">
				<img className="user-logo" src={src || defaultPicture} alt="User logo"/>
				{ medalImg }
			</div>
		);
	}
}

export default Logo;

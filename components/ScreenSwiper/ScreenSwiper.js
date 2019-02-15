import React, { Component, PropTypes } from 'react';
import Hammer from 'react-hammerjs';

import { connect } from 'react-redux';

const DIRECTION_LEFT = 2; //from Hammer
const DIRECTION_RIGHT = 4; //from Hammer


class ScreenSwiper extends Component {

	static propTypes = {
		currentScreenIdx: PropTypes.number.isRequired,
		onPrevScreen: PropTypes.func,
		onNextScreen: PropTypes.func,
	};




	render() {

		const { currentScreenIdx: idx, onPrevScreen, onNextScreen, children, showInvite , isLoggedIn , notifications, page } = this.props;
		const total = children.length;
		const width = 100 * total;
		const scrollX = -100 * idx / total;
		const top = location.pathname === '/earn' ?  4.2 : '';

		let notStatus = notifications;
		let count = 0;
		notStatus.forEach((n) => {
			if(n.show && isLoggedIn) {
				count++
			}
		})

		let marginTop = location.pathname === '/earn' ?  90* count : 0 ;

		let containerStyle = {
			width: `${width}%`,
			transition : `top 0.5s linear`,
			transform: `translateX(${scrollX}%)`,
			WebkitTransform: `translateX(${scrollX}%)`,
			top : `${top}em`,
			marginTop : `${marginTop}px`
		};

		if (page === 'friends') {
			containerStyle.width = '100%';
		}

		const onSwipe = (e) => {
			if (e.direction === DIRECTION_LEFT) {
				onNextScreen();
			}
			if (e.direction === DIRECTION_RIGHT) {
				onPrevScreen();
			}
		};



		return (
			<Hammer onSwipe={onSwipe}>
				<div className="screen-swiper" style={ containerStyle }>
					{ children }
				</div>
			</Hammer>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		notifications: state.notifications.list,
	};
};


export default connect(mapStateToProps)(ScreenSwiper);

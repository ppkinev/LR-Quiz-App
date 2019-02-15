import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { requestAuth, toggleWelcome } from '../flux/actions';
import Link from '../components/Link';

class Test extends Component {

	static title = 'Test';

	static propTypes = {
		openAuthPopup: PropTypes.func,
		openWelcomePopup: PropTypes.func,
	};

	render() {
		const onAuthPopupClick = () => this.props.openAuthPopup();
		const onWelcomePopupClick = () => this.props.openWelcomePopup();

		return (
			<div>
				<ul style={{margin: '20px auto', textAlign: 'center', fontSize: '2rem'}}>
					<li>
						<Link to="./fixtures">Fixtures</Link>
					</li>
					<li >
						<a href="#" onClick={ onAuthPopupClick }>Toggle Auth</a>
					</li>
					<li >
						<a href="#" onClick={ onWelcomePopupClick }>Toggle Welcome</a>
					</li>
					<li>
						<Link to="./partners">Partners</Link>
					</li>
					<li>
						<Link to="./">Index</Link>
					</li>
				</ul>
			</div>
		);
	}
}


// Connect to store
//
const mapDispatchToProps = (dispatch) => {
	return {
		openAuthPopup: () => dispatch(requestAuth()),
		openWelcomePopup: () => dispatch(toggleWelcome(true)),
	};
};

export default connect(null, mapDispatchToProps)(Test);

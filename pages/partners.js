import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Fetching } from '../components/Layout';
import { fetchPartners } from '../flux/actions';
import PartnersContainer from '../components/PartnersContainer';


class Partners extends Component {

	static title = 'Betting partner';

	static propTypes = {
		// from store
		fetchPartners: PropTypes.func.isRequired,
		partners: PropTypes.object.isRequired,
	};

	componentDidMount() {
		this.props.fetchPartners();
	}

	render() {
		const { partners: { isFetching, list } } = this.props;

		if (isFetching) {
			return <Fetching/>;
		}
		return <PartnersContainer partnersList={ list }/>;
	}
}

// Connect to store
//
const mapStateToProps = (state) => {
	return {
		partners: state.partners
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		fetchPartners: () => dispatch(fetchPartners())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Partners);

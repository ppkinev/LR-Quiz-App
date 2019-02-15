import React, { Component, PropTypes } from 'react';
import './FriendsList.scss';

const searchDelay = 500;
let searchTimeout;

class FriendsSearchBar extends Component {

	state = {
		inputValue: ''
	};

	constructor(props) {
	    super(props);
        this.resetSearchBarField = this.resetSearchBarField.bind(this);
    }

	handlerOnChange() {
		const { changeSearchBarField, findUsers, resetSearch } = this.props;
		const value = this.refs.search.value;

		this.setState({ inputValue: value });

		if (value.length > 0) {
			if (searchTimeout) window.clearTimeout(searchTimeout);
			searchTimeout = window.setTimeout(() => {
				findUsers(value);
			}, searchDelay);
		} else {
			if (searchTimeout) window.clearTimeout(searchTimeout);
			resetSearch();
		}
	}

	resetSearchBarField() {
		if (searchTimeout) window.clearTimeout(searchTimeout);
		this.setState({ inputValue: '' });
		this.props.resetSearch();
	}

	render() {
		const { clearSearchBarField, isSearching } = this.props;
		const { inputValue } = this.state;

		const searchStatus = () => {
			if (isSearching) return <img className='search-inprogress' src={require('./images/loading.svg')} />;
			if (inputValue.length) return <span>&times;</span>;
			return null;
		};

		const onSearchChange = () => this.handlerOnChange();

		return (
			<div className="friends-search">
				<img className="search-ico" src={require('./images/search-ico.png')} />
				<input className="search-field" placeholder='Search' ref='search' value={inputValue} onChange={onSearchChange} />
				<span className="search-decorator" onClick={this.resetSearchBarField}>{searchStatus()}</span>
			</div>
		);
	}
}

export default FriendsSearchBar;

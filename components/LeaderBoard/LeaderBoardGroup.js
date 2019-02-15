import React, { Component, PropTypes } from 'react';
import Section from './Section.js';
import Link from '../Link';
import Logo from '../UserProfile/Logo.js';
import './leader-board.scss';


class LeaderBoardGroup extends Component {

	static propTypes = {
		top3: PropTypes.array.isRequired,
		groups: PropTypes.array.isRequired
	};

	render() {
		const { top3, groups } = this.props;
		const rankTitle = `You are in 4 groups`;
		const top3cols = top3.map((group, i) => {
			const {picture, name, members, rank} = group;

			return (
				<div key={`top-group-${i}`} className="col">
					<Logo src={ picture } rank={ rank }/>
					<div className="user-name">{ name }</div>
					<div className="user-points">{ members } members</div>
				</div>
			);
		});
		const groupItems = groups.map((user, i) => {
			const {picture, name, members, rank} = user;

			return (
				<div key={`group-${i}`} className={"user-list-item"}>
					<div className="user-rank">{ rank }</div>
					<Logo src={picture}/>
					<div className="user-details">
						<div className="user-name large">{ name }</div>
						<div className="user-points large">{ members } members</div>
					</div>
				</div>
			);
		});

		return (
			<div className="screen-content">
				<Section title="TOP groups">
					<div className="user-cols-3">
						{ top3cols }
					</div>
				</Section>

				<Section title={ rankTitle }>
					<ul className="user-list">
						{ groupItems }
					</ul>
				</Section>
			</div>
		);
	}
}

export default LeaderBoardGroup;

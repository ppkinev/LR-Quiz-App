import React, { Component, PropTypes } from 'react';
import './SocialLink.scss';

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}


const SocialLink = ({name, points, onClick}) => {
	const text = points ?
		`Share & get ${points}` :
		`Share with ${capitalizeFirstLetter(name)}`;
	const ptsImg = points ?
		<img className="social-pts" src={ require(`./images/icon-pts-${name}.png`) } /> :
		'';
	const _onClick = () => onClick(name);

	return (
		<div className={ `social-link ${name}` } onClick={ _onClick }>
			<img className="social-icon" src={ require(`./images/icon-${name}.png`) } alt={ name }/>
			{ text }
			{ ptsImg }
		</div>
	)
};


export default SocialLink;

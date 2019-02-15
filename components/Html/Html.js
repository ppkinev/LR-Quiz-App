import React, { Component, PropTypes } from 'react';
import GoogleAnalytics from '../GoogleAnalytics';
import { title, description } from '../../config';

import './Html.scss';

class Html extends Component {

	static propTypes = {
		title: PropTypes.string,
		description: PropTypes.string,
		body: PropTypes.string.isRequired,
		debug: PropTypes.bool.isRequired,
	};

	render() {
		return (
			<html className="no-js" lang="">
			<head>
				<meta charSet="utf-8"/>
				<meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
				<title>{this.props.title || title}</title>
				<meta name="description" content={this.props.description || description}/>
				<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"/>
				<link rel="apple-touch-icon" href="apple-touch-icon.png"/>
				<link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,700'/>

				<script src={'./app.js?' + new Date().getTime()}></script>
			</head>
			<body>
			<div id="app" dangerouslySetInnerHTML={{__html: this.props.body}}/>
			{/*<GoogleAnalytics />*/}
			</body>
			</html>
		);
	}

}

export default Html;

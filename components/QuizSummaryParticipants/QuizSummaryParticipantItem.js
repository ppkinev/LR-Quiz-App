import React, {Component, PropTypes} from 'react';
import Link from '../Link';
import Location from '../../lib/Location.js';
import {numToFixed} from '../../lib/utils';

class QuizSummaryParticipantItem extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

	getQuestions() {
		const {questions, userInfo: {Predictions: predictions}} = this.props;
		let choices = predictions.map((pr) => {
			let answer = '', title = '', id = 0;
			let correct = pr['IsCorrect'] ? ' correct' : '';
			for (let n = 0; n < questions.length; n++) {
				if (questions[n]['QuestionId'] === pr['QuestionId']) {
					for (let m = 0; m < questions[n]['Outcomes'].length; m++) {
						let outcome = questions[n]['Outcomes'][m];
						if (outcome['OutcomeId'] === pr['OutcomeId']) {
							switch (questions[n]['Type']) {
								case 'FirstHalfResult':
									title = 'HalfTime';
									answer = outcome['Team'];
									id = 1;
									break;
								case 'CorrectScore':
									title = `Winner: `;
									answer = `${outcome['Score'].replace('-', ':')} (${outcome['Team']})`;
									// answer = outcome['Team'];
									id = 0;
									break;
								case 'FirstGoalScorer':
									title = 'FirstGoal';
									// answer = outcome['FirstScorer'].replace(/\s/g, '&nbsp;');
									answer = outcome['FirstScorer'];
									id = 2;
							}
							break;
						}
					}
					break;
				}
			}

			return {id, answer, title, correct};
		});

		choices.sort((a, b) => a.id - b.id);

		return choices.map(({answer, title, correct}, i) => {
			return (
				<div key={"user-" + i} className={ "user-question" + correct }>
					<h4 className="user-question-title">{ title }</h4>
					<div className="choice-holder">
						<p className="user-question-choice">{ answer }</p>
					</div>
				</div>
			)
		});
	}

	getWinningLabel() {
		const {userInfo: {WonAmount: wonAmount, CreditsWonAmount: creditsWonAmount}} = this.props;
		if (creditsWonAmount) {
			return (
				<div className="user-winning">£{ numToFixed(creditsWonAmount, 2) }</div>
			)
		}
		return '';
	}

	getRelationsClass() {
		const {UserRelationship: {Rels: rel = []}} = this.props.userInfo;
		if (rel.some(r => r.toLowerCase() === 'friends')) {
			return ' friend'; // friends icon
		}
		if (rel.some(r => r.toLowerCase() === 'following')) {
			return ' follower'; // followers icon
		}
		return ''; // general icon
	}

	handleClick(){
        const {sameUser, openAuthPopup, isLoggedIn} = this.props;
        const page = sameUser ? './profile' : './user';
        const {UserRelationship: info} = this.props.userInfo;
        const {User: {UserId: userId}} = info;

        if (isLoggedIn) Location.push({pathname: page, query: {userId}});
        else openAuthPopup();
    }

	render() {
	    const {winnerClass = '', sameUser} = this.props;
		const {
			BetAmount: betAmount, WonAmount: wonAmount,
			IsWinner: isWinner, Predictions: predictions,
			UserRelationship: info
		} = this.props.userInfo;

		const {User: {ImageUrl: userImage, UserName: name, UserId: userId}} = info;
		const questions = this.getQuestions();
		const winning = this.getWinningLabel();
		const relationClass = !sameUser ? this.getRelationsClass() : ' same-user';
		const page = sameUser ? './profile' : './user';

		const itemClick = this.handleClick;

		return (
			<li className="participants-list-item-li">
				<div onClick={itemClick} className="participants-list-item">
					<div className={"user-image-holder" + winnerClass}>
						<img src={ userImage }/>
					</div>
					<div className="user-info-section">
						<div className="user-top">
							<h3 className="user-name">{ name }</h3>
							{ winning }
						</div>
						<div className="user-bottom">
							{ questions }
						</div>
					</div>
					<div className={"user-relations" + relationClass}></div>
				</div>
			</li>
		);
	}
}

export default QuizSummaryParticipantItem;

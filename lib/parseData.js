export function parseWinOrDrawData(data, [teamHome, teamAway], outcomeId) {
	const {
		TotalAnswersCount: total,
		QuestionId: questionId,
	} = data;
	const calcStat = (count, id) => {
		const selectedCount = (id === outcomeId) ? count + 1 : count;
		return Math.floor(selectedCount / (total + 1) * 100)
	};
	const outcomes = data.Outcomes.reduce((acc, {OutcomeId: id, Team: name, AnswersCount: count}) => {
		const percent = calcStat(count, id);
		switch (name) {
			case teamHome.Name:
				return {...acc, home: {id, name, percent}};
			case teamAway.Name:
				return {...acc, away: {id, name, percent}};
			default:
				return {...acc, draw: {id, name, percent}};
		}
	}, {});

	let winnerName = function () {
		if (outcomes.home.id === outcomeId) {
			return outcomes.home.name;
		} else if (outcomes.away.id === outcomeId) {
			return outcomes.away.name;
		} else {
			return outcomes.draw.name
		}
	};

	return {
		questionId,
		outcomes: outcomes,
		summary: {
			halfTimeWinner: {
				questionId,
				outcomeId,
				isHome: outcomes.home.id === outcomeId,
				isAway: outcomes.away.id === outcomeId,
				name: winnerName()
			}
		},
	};
}


export function parseFirstGoalData(data, [teamHome, teamAway], selectedOutcomeId) {
	const {
		QuestionId: questionId,
		TotalAnswersCount: total,
		Outcomes: outcomes
	} = data;
	const players = outcomes.map(({
		OutcomeId: outcomeId,
		FirstScorer: name,
		ScorerTeam: team,
		AnswersCount: count
	}) => {
		const isSelected = (selectedOutcomeId === outcomeId);
		const countSelected = isSelected ? count + 1 : count;
		const percent = Math.floor(countSelected / (total + 1) * 100);

		return {
			outcomeId,
			name,
			team,
			percent,
			isSelected,
		};
	});
	const noGoalPlayer = players.find(p => p.name === 'No Goalscorer');
	const noGoalPlayerIdx = players.indexOf(noGoalPlayer);
	const adjustedPlayers = [
		{
			...noGoalPlayer,
			team: ''
		},
		...players.slice(0, noGoalPlayerIdx),
		...players.slice(noGoalPlayerIdx + 1)
	];

	const {name, team} = adjustedPlayers.find(p => p.isSelected) || {};

	return {
		questionId,
		players: adjustedPlayers,
		summary: {
			firstGoalScorer: {
				questionId,
				outcomeId: selectedOutcomeId,
				name: name,
				isHome: team === teamHome.Name,
				isAway: team === teamAway.Name,
			}
		}
	};
}

export function parseScoreData(data, [teamHome, teamAway], scores = [], selectedOutcomeId) {
	const {
		TotalAnswersCount: total,
		QuestionId: questionId,
		Outcomes: outcomes
	} = data;
	const score2outcome = (scores) => {
		const [scoreHome, scoreAway] = scores;
		const scorePair = (scoreHome >= scoreAway) ? `${scoreHome}-${scoreAway}` : `${scoreAway}-${scoreHome}`;
		const winningTeam = (scoreHome > scoreAway) ? teamHome.Name : (scoreHome < scoreAway) ? teamAway.Name : 'Draw';

		return outcomes.find(({Score, Team}) => {
				return (Score === scorePair && winningTeam === Team);
			}) || {};
	};
	const outcome2score = (outcome) => {
		const {Score, Team} = outcome;
		const scores = Score.split('-').map(Number);
		return (Team === teamHome.Name) ? scores : scores.reverse();
	};

	let outcome;
	if (scores !== null) {
		outcome = score2outcome(scores);
	} else {
		outcome = outcomes.find(({OutcomeId}) => selectedOutcomeId == OutcomeId);
		scores = outcome2score(outcome);
	}
	const [scoreHome, scoreAway] = scores;
	const {OutcomeId: outcomeId, AnswersCount: count = 0} = outcome;
	const percent = Math.floor((count + 1) / (total + 1) * 100);

	let winnerName = function () {
		if (scoreHome > scoreAway) {
			return teamHome.Name;
		} else if (scoreHome < scoreAway) {
			return teamAway.Name;
		} else {
			return 'Draw';
		}
	};

	return {
		questionId,
		outcomeId,
		summary: {
			score: {
				questionId,
				outcomeId,
				scoreHome,
				scoreAway,
			},
			winner: {
				questionId,
				outcomeId,
				isHome: scoreHome > scoreAway,
				isAway: scoreHome < scoreAway,
				name: winnerName()
			}
		},
		stats: percent
	};
}


export function getFinalMatchScore(questionList, [teamHome, teamAway]) {
	const noResult = ['?', '?'];
	const scoreQuestion = questionList.find(({Type}) => 'CorrectScore' === Type);
	if (!scoreQuestion) {
		return noResult;
	}

	const winingResult = scoreQuestion.Outcomes.find((o) => o['ResultCode'] === 'W' || o['IsCorrect']);
	if (!winingResult) {
		return noResult;
	}

	const {Score: score, Team: team} = winingResult;
	const scoreArr = score.split('-');

	return (team === teamHome.Name ? scoreArr : scoreArr.reverse());
}

export function getWinnerOptions(questionList) {
	let result = {};
	questionList.forEach((question) => {
		let winner = question['Outcomes'].filter((o) => o['ResultCode'] === 'W' || o['IsCorrect']);
		if (winner[0]) {
			result[question['Type']] = {
				team: winner[0]['Team'] || winner[0]['ScorerTeam'],
				id: winner[0]['OutcomeId'],
				score: winner[0]['Score'],
				goalScorer: winner[0]['FirstScorer']
			};
		}
	});

	return result;
}

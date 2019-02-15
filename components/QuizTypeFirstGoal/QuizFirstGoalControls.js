import React, {Component, PropTypes} from 'react';
import './players.scss';


class QuizFirstGoalControls extends Component {

    static propTypes = {
        info: PropTypes.string.isRequired,
        players: PropTypes.array.isRequired,
        outcomeId: PropTypes.string,
        onSubmit: PropTypes.func.isRequired,
    };

    getTeamsOrdered() {
        const {teamNames, players, halfTimeWinner: {name: halfTimeWinnerName}} = this.props;

        const newTeamNames = [...teamNames];
        newTeamNames.sort(a => a.Name === halfTimeWinnerName ? -1 : 1);

        return players.sort((a, b) => {
            if (a.team === '') {
                if (b.team === '') return 0;
                return -1;
            }
            if (a.team === newTeamNames[0].Name) {
                if (b.team === '') return 1;
                if (b.team === a.team) return 0;
                return -1;
            }
            if (a.team === newTeamNames[1].Name) {
                if (b.team === a.team) return 0;
                return 1;
            }
        });
    }

    render() {
        const {teamNames, info, onSubmit, outcomeId: selectedOutcomeId, children} = this.props;
        const title = <span>Who will score<br/>the first goal?</span>;
        const selectedClass = (outcomeId) => (outcomeId === selectedOutcomeId ? 'selected' : '');

        let playerItems = this.getTeamsOrdered().map(({outcomeId, name, team}, i) => {
            const playerIcon = teamNames.filter(teamName => team === teamName.Name);
            const icon = (playerIcon && playerIcon.length > 0) ? playerIcon[0].ImageUrl : require(`../../static/images/icon-friendship.png`);
            const noGoalscorerClass = !team ? 'no-goalscorer ' : ' ';

            return (
                <li key={`player-${i}`} className={"player-item " + noGoalscorerClass + selectedClass(outcomeId)}
                    onClick={ () => onSubmit(outcomeId) }>
                    <div className="player-icon">
                        <img src={ icon }/>
                    </div>
                    <div className="player-info">
                        <div className="player-name">{ name }</div>
                        <div className="player-position">{ team.split(/(?=[A-Z])/).join(" ") }</div>
                    </div>
                </li>
            );
        });

        return (
            <div className="quiz-controls">
                <div className="stats-spacer">
                    <div className="quiz-info">{ info }</div>
                    <div className="quiz-title">{ title }</div>
                </div>

                <ul className="players-list">
                    { playerItems }
                </ul>

                { children }
            </div>
        );
    }
}

export default QuizFirstGoalControls;

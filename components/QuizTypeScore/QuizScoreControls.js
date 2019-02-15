import React, {Component, PropTypes} from 'react';
import './score.scss';

const MAX_SCORE_SUM = 6;

class QuizScoreControls extends Component {

    static propTypes = {
        info: PropTypes.string.isRequired,
        teamNames: PropTypes.array.isRequired,
        onSubmit: PropTypes.func.isRequired,
    };

    state = {
        currentTeam: this.props.teamNames[0].Name,
        scores: {},
        currentTeamIndex: 0
    };

    selectTeam(team) {
        this.setState({
            currentTeam: team
        });
    }

    selectScore(num) {
        const {teamNames, onSubmit} = this.props;

        this.setState({
            scores: {
                ...this.state.scores,
                [this.state.currentTeam]: num
            }
        }, () => {
            const {scores, currentTeam} = this.state;
            const nextTeam = teamNames.reduce((acc, name) => {
                return scores[name.Name] === undefined ? name.Name : acc;
            }, currentTeam);

            this.setState({
                currentTeam: nextTeam, // auto-switch to non-scored one
                currentTeamIndex: 1
            }, () => {
                const {scores} = this.state;
                const complete = Object.keys(scores).length === 2;
                const scoresArr = teamNames.reduce((acc, name) => [...acc, scores[name.Name]], []);

                if (complete) {
                    onSubmit(scoresArr);
                }
            });
        });
    }

    render() {
        const {info, teamNames} = this.props;
        const {currentTeam, scores, currentTeamIndex} = this.state;
        const title = <span>Select a full time score (90mins)<br/>for {currentTeam.split(/(?=[A-Z])/).join(" ")}</span>;

        const [teamBtn1, teamBtn2] = teamNames.map((name, i) => {
            const score = scores[name.Name];
            const scoreLabel = (score === undefined) ? '?' : score;
            const touchedClass = (name === currentTeam) ? 'touched' : '';
            const selectedClass = (score !== undefined) ? 'selected' : '';
            const classes = [touchedClass, selectedClass].join(' ');
            const onClick = () => this.selectTeam(name.Name);
            const activeToSetScore = (score === undefined && currentTeamIndex === i) ? 'active-to-set-score' : '';

            return (
                <div key={`team-btn-${i}`} className={`team-idle ${classes}`} onClick={ onClick }>
                    <div className={`${activeToSetScore}`}>
                        <div className={`team-idle-content`}>{ scoreLabel }</div>
                        <div className="team-name">{ name.Name.split(/(?=[A-Z])/).join(" ") }</div>
                    </div>
                </div>
            );
        });
        const otherTeam = teamNames.find(name => name.Name !== currentTeam);
        const otherTeamScore = scores[otherTeam.Name] || 0;
        const maxAllowedScore = MAX_SCORE_SUM - otherTeamScore;

        const onClickToZero = () => this.selectScore(0);

        const scoreBtns = [...new Array(7).keys()].map(i => {
            const isDisabled = (i > maxAllowedScore);
            const disabledClass = isDisabled ? 'disabled' : '';
            const onClick = !isDisabled ? () => this.selectScore(i) : () => {
                };
            if (i === 0) return null;
            return (
                <div key={`btn-${i}`} className="score-btn-col">
                    <div className={ "score-btn " + disabledClass } onClick={ onClick }>{ i }</div>
                </div>
            );
        });

        return (
            <div className="quiz-controls">
                <div className="quiz-info">{ info }</div>

                <div className="quiz-title">{ title }</div>

                <div className="score-select-panel">
                    <div className="teams-idle-wrapper">
                        { teamBtn1 }
                        <div className="colon">:</div>
                        { teamBtn2 }
                    </div>

                    <div className="score-choice">
                        { scoreBtns }
                        <div className="score-btn-col">
                            <div className="score-btn zero" onClick={ onClickToZero }>0</div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default QuizScoreControls;

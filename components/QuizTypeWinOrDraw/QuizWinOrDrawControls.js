import React, {Component, PropTypes} from 'react';
import './draw.scss';


class QuizWinOrDrawControls extends Component {

    static propTypes = {
        info: PropTypes.string.isRequired,
        outcomes: PropTypes.object.isRequired,
        onSubmit: PropTypes.func.isRequired,
        outcomeId: PropTypes.string
    };

    render() {
        const {
            info,
            outcomes: {
                home: {name: teamHome, id: outcomeIdHome},
                away: {name: teamAway, id: outcomeIdAway},
                draw: {id: outcomeIdDraw}
            },
            onSubmit,
            teamNames
        } = this.props;
        const title = <span>Who will be winning<br/>at half-time?</span>;

        return (
            <div className="quiz-controls">
                <div className="quiz-info">{ info }</div>
                <div className="quiz-title big-margin-top">{ title }</div>

                <div className="quiz-teams big-margin-top">
                    <div className='quiz-team-container' onClick={ () => onSubmit(outcomeIdHome) }>
                        <div className={"team-container select-btn"}>
                            <img src={teamNames[0].ImageUrl}/>
                        </div>
                        <div className='quiz-team-name'>{ teamNames[0].Name.split(/(?=[A-Z])/).join(" ") }</div>
                    </div>

                    <div className="quiz-team-container">
                        <div className={"team-container select-btn"}
                             onClick={ () => onSubmit(outcomeIdDraw) }>
                            <img src={require("../../static/images/icon-friendship.png")}/>
                        </div>
                        <div className="quiz-team-name">Draw</div>
                    </div>

                    <div className='quiz-team-container' onClick={ () => onSubmit(outcomeIdAway) }>
                        <div className={"team-container select-btn"}>
                            <img src={teamNames[1].ImageUrl}/>
                        </div>
                        <div className='quiz-team-name'>{ teamNames[1].Name.split(/(?=[A-Z])/).join(" ") }</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default QuizWinOrDrawControls;

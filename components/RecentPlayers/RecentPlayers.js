import React, {PropTypes} from 'react';
import './RecentPlayers.scss';

const RecentPlayers = ({total = 0, recent = [], type = 'user', ending = ''}) => {
    if (total === 0 || !recent.length) return <div></div>;

    const images = recent.map((player, ind) => {
        return (
            <li className="player-holder" key={"players" + ind}>
                <img src={player['ImageUrl']} alt="Player" />
            </li>
        );
    });

    let text = total === 1 ? `1 ${type}` : `${total} ${type}s`;
    if (ending.length) text += ` ${ending}`;

    return (
        <div className="recent-players-holder">
            <ul className="recent-players-images">{ images }</ul>
            <p className="recent-players-text">{ text }</p>
        </div>
    );
};

RecentPlayers.propTypes = {
    total: PropTypes.number.isRequired,
    recent: PropTypes.array.isRequired,
    type: PropTypes.string,
    ending: PropTypes.string
};

export default RecentPlayers;

import React, { Component, PropTypes } from 'react';
import './Badges.scss';

export default class BadgesItem extends Component {

  openBadge() {
    const { badge, toggleBadgePopup, noClick } = this.props;

    toggleBadgePopup(badge.Title, badge.Description, badge.ImageUrl);
  }

  render() {
    const { badge } = this.props;

    return (
      <li className="badge-section-item" onClick={this.openBadge.bind(this)}>
        <div className="badge-section-item-body">
          <div className="badge-section-item-team-icons">
            <div className="badge-section-item-team">
              <img src={ badge.ImageUrl } />
            </div>
          </div>
          <div className="badge-section-item-content">
            <h3 className="badge-title">{ badge.Title }</h3>
            <h5 className="badge-description">{ badge.Description }</h5>
          </div>
        </div>
      </li>
    );
  }
}

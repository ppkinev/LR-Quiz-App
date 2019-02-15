import React, { Component, PropTypes } from 'react';
import './Badges.scss';

export default class BadgePopup extends Component {

  closePopup() {
    this.props.toggleBadgePopup();
  }


  render() {
    const { isOpen, content } = this.props;
    const classes = ['badgeModal', ...(isOpen ? ['visible'] : [])].join(' ');


    console.log(content)

    return (
      <div className={ classes } ref='modal'>
        <div className='badgeModal-content'>
          <div className='badgeModalImage testBadges ' style={{ background : `url(${content.image})`}}></div>
        
          <div className='badgeModalTitle'>{content.title}</div>
          <div className='badgeModalDesc'>{content.desc}</div>
        </div>
        <div className='overlay' ref='overlay' onClick={() => this.closePopup()}></div>
      </div>
    );
  }
}

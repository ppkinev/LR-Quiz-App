import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {getURLParameter} from '../../lib/utils';
import './VideoPopup.scss';

let playbackInterval;
const youtubeShortRXP = /youtu\.be\/([^?]+)/;

export default class VideoPopup extends Component {

    constructor(props) {
        super(props);

        this.onPlayerReady = this.onPlayerReady.bind(this);
        this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
        this.onPlayerError = this.onPlayerError.bind(this);
    }

    state = {
        shownInterval: 0,
        player: null,

        startTime: null,
        lastPauseTime: null,
        pausesDuration: 0,
    };


    startingPlayer(videoUrl) {
        let videoID = getURLParameter('v', videoUrl);
        if (!videoID) {
            videoID = videoUrl.match(youtubeShortRXP);
            if (videoID.length) videoID = videoID[1];
        }
        this.setState({
            player: new YT.Player('player', {
                height: '300',
                width: '100%',
                videoId: videoID,
                playerVars: {
                    controls: 0,
                    rel: 0,
                    enablejsapi: 1,
                    origin: window.document.origin,
                    fs: 0,
                    modestbranding: 1 // player that does not show a YouTube logo
                },
                events: {
                    'onReady': this.onPlayerReady,
                    'onStateChange': this.onPlayerStateChange,
                    'onError': this.onPlayerError
                }
            })
        });

        window.setTimeout(() => {
            window.player = this.state.player;
        }, 300);

    }


    componentDidMount() {
        const {popup: {videoUrl}} = this.props;
        this.startingPlayer(videoUrl);
    }

    onPlayerError(e) {
        window.console.log(e);
        // this.closePopup();
    }

    onPlayerReady(e) {
        const {popup, trackActions} = this.props;
        // e.target.playVideo();
        trackActions.postTrackOffer(popup.earnId);
    }

    onPlayerStateChange(e) {
        const {popup, trackActions, showErrorMessage} = this.props;
        const {player} = this.state;
        let {startTime, lastPauseTime, pausesDuration} = this.state;

        const watchedDuration = Date.now() - startTime - pausesDuration;

        if (e.data === 0) {
            // Video has finished

            if (player.getDuration) {
                if (player.getDuration() * 1000 > watchedDuration + 2000) {
                    // Video was forwarded
                    showErrorMessage('You need to watch the full video to get points');
                } else {
                    // Video normally watched and completed
                    trackActions.postCompleteOffer(popup.earnId);
                }
            } else {
                trackActions.postCompleteOffer(popup.earnId);
            }

            this.closePopup();
        }
        else if (e.data === 1) {
            // Video is playing

            if (!startTime) this.setState({startTime: Date.now()});

            if (lastPauseTime) this.setState({
                pausesDuration: pausesDuration + (Date.now() - lastPauseTime)
            });

            // this.setState({
            //     betweenPauses: (new Date()).getTime()
            // });
            this.videoInterval();
        } else if (e.data === 2) {
            // Video is paused
            this.setState({lastPauseTime: Date.now()});


            // fullDuration += ((new Date()).getTime() - betweenPauses);
            // this.setState({fullDuration});
            clearInterval(playbackInterval);
        }
    }

    closePopup() {
        const {player} = this.state;
        const {closeVideoPopup} = this.props.videoPopupActions;
        player.destroy();
        this.setState({
            shownInterval: 0,
            player: null
        });
        closeVideoPopup();
        clearInterval(playbackInterval);
    }

    videoInterval() {
        const {player} = this.state;
        if (player.getDuration && player.getCurrentTime) {
            playbackInterval = setInterval(() => {
                this.setState({
                    shownInterval: Math.floor(player.getDuration() - player.getCurrentTime())
                });
            }, 1000);
        }
    }

    showInterval(shownInterval) {
        return shownInterval ? <div className='video-text'>{shownInterval} <i>seconds left</i></div> : null;
    }

    render() {
        const {popup} = this.props;
        const {shownInterval} = this.state;
        const classes = ['modal', ...(popup.isOpen ? ['visible'] : [])].join(' ');

        return (
            <div className={classes} ref='modal'>
                <div className='modal-content'>
                    <div id='player'></div>
                    {this.showInterval(shownInterval)}
                </div>
                <div className='video-popup-close' onClick={() => this.closePopup()}>&times;</div>
                <div className='overlay' ref='overlay' onClick={() => this.closePopup()}></div>
            </div>
        );
    }
}

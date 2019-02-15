import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import Link from '../Link';
import SectionCollapsible from '../SectionCollapsible';
import Button from '../Button';
import {TextInput} from '../AuthPopup/Controls.js';
import './DrawClaimPrize.scss';


class DrawClaimPrize extends Component {

    static propTypes = {
        drawItem: PropTypes.object.isRequired,
        onSubmit: PropTypes.func.isRequired,
    };

    handleSubmit() {
        const cityEl = this.refs['input-city'];
        if (!cityEl.validate()) {
            cityEl.focus();
            return;
        }
        const addressEl = this.refs['input-address'];
        if (!addressEl.validate()) {
            addressEl.focus();
            return;
        }
        const countyEl = this.refs['input-county'];
        if (!countyEl.validate()) {
            countyEl.focus();
            return;
        }
        const postcodeEl = this.refs['input-postcode'];
        if (!postcodeEl.validate()) {
            postcodeEl.focus();
            return;
        }

        const data = {
            city: cityEl.value(),
            address: addressEl.value(),
            county: countyEl.value(),
            postcode: postcodeEl.value(),
        };

        this.props.onSubmit(data);
    }

    render() {
        const {
            drawItem: {prizeTitle, prizeImageUrl, prizeDescription, endDate}
        } = this.props;
        const titleDateEnded = `Finished ${ moment(endDate).fromNow() }`;
        const dateFormatted = moment(endDate).format('YYYY/MM');
        const onSubmit = () => this.handleSubmit();

        return (
            <div className="draw-content draw-claim">
                <div className="draw-panel">
                    <div className="draw-details">
                        <div className="draw-details-image">
                            <img src={ prizeImageUrl }/>
                        </div>
                        <div className="draw-details-content">
                            <h3 className="list-meta as-header">{ titleDateEnded }</h3>
                            <h3 className="list-title">{ prizeTitle }</h3>
                            <h5 className="list-meta">{ dateFormatted }</h5>
                        </div>
                        <div className="draw-details-label orange">You won!</div>
                    </div>

                    <SectionCollapsible>
                        <div className="bet-description">{ prizeDescription }</div>
                    </SectionCollapsible>

                    <div className="draw-claim-title">
                        <h2>Where we can deliver<br/> your prize?</h2>
                    </div>

                    <form className="draw-claim-form">
                        <TextInput ref="input-city" required={true} name="city" label="City"/>
                        <TextInput ref="input-address" required={true} name="address" label="Address"/>
                        <TextInput ref="input-county" required={true} name="country" label="County"/>
                        <TextInput ref="input-postcode" required={true} name="postcode" label="Postcode"/>

                        <Button className="big-btn money-btn" onClick={ onSubmit }>Submit</Button>
                    </form>
                </div>
            </div>
        );
    }
}

export default DrawClaimPrize;

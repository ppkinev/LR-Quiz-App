import React, { Component, PropTypes } from 'react';
import './slider.scss';


class Slider extends Component {

	static propTypes = {
		min: PropTypes.number.isRequired,
		max: PropTypes.number.isRequired,
		value: PropTypes.number.isRequired,
		step: PropTypes.number,
		onChange: PropTypes.func
	};

	getValueByOffset(pageX) {
		const { min, max } = this.props;
		const width = this.refs.slider.offsetWidth;
		let offset = pageX - this.refs.slider.offsetLeft;
		offset = Math.max(0, Math.min(width, offset));

		return min + Math.floor(offset / width * max);
	}

	getValueByDiff(diff) {
		const { value, min, max } = this.props;
		return Math.max(min, Math.min(max, value + diff))
	}

    onSliderChange(ev) {
        this.props.onChange(ev.target.value);
    }

	render() {
		const { max, value, step = .01, onChange } = this.props;

		const onPlusClick = () => onChange(this.getValueByDiff(step));
		const onMinusClick = () => onChange(this.getValueByDiff(-step));

		return (
			<div className="slider">
				<div className="slider-icon icon-minus" onClick={ onMinusClick }></div>

                <input onChange={ this.onSliderChange.bind(this) } min="0" max={ max } value={ value } step={ step } type="range" className="dg-bet-slider" />

				<div className="slider-icon icon-plus" onClick={ onPlusClick }></div>
			</div>
		);
	}

}

export default Slider;

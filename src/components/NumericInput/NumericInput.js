/**
 * Created by maxwellzietz on 5/19/15.
 */
import './NumericInput.less';
import React from 'react';

class NumericInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focussed: false,
      rawValue: (this.props.type == "text")?this.formatNumber(this.props.value):this.props.value
    };
  }

  handleFocus(event) {
    this.setState({
      focussed: true,
      rawValue: (this.props.type == "text")?this.formatNumber(this.props.value):this.props.value
    });
  }

  handleBlur(event) {
    this.setState({
      focussed: false,
      rawValue: (this.props.type == "text")?this.formatNumber(this.props.value):this.props.value
    });
  }

  handleChange(event) {
    let value = parseFloat(event.target.value.replace(/[^\d\.]/g, ''));
    if (isNaN(value)) {
      value = 0;
    }
    this.setState({ rawValue: event.target.value });
    this.props.onChange && this.props.onChange(value);
  }

  render() {
    let value;
    let formattedValue = this.formatNumber(this.props.value);

    //if (this.state.focussed) {
      value = this.state.rawValue;
    //} else {
      //value = formattedValue;
    //}

    return  (this.props.type == "text") ?
                <input type="text"
                  readOnly={this.props.readOnly}
                  onFocus={this.handleFocus.bind(this)}
                  onBlur={this.handleBlur.bind(this)}
                  onChange={this.handleChange.bind(this)}
                  value={value} /> :

                  <div className = "sliderContainer">
                    <input className="slider"
                           type="range"
                           defaultValue={this.props.value}
                           min={this.props.min}
                           max={this.props.max}
                           readOnly={this.props.readOnly}
                           onFocus={this.handleFocus.bind(this)}
                           onBlur={this.handleBlur.bind(this)}
                           onChange={this.handleChange.bind(this)}
                           value={value}
                           step={this.props.step} />
                    <p>{formattedValue}</p>
                  </div>;
  }

  formatNumber(number) {
    if (isNaN(number)) {
      return '-';
    }
    var ret = number.toFixed(this.props.dp).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (this.props.prefix) {
      ret = this.props.prefix + " " + ret;
    }
    if (this.props.postfix) {
      ret = ret + " " + this.props.postfix;
    }
    return ret;
  }
};

NumericInput.defaultProps = {
  type: "text",
  value: 0,
  min: 0,
  max: 1,
  step: 0.1,
  readOnly: false,
  dp: 0
};

export default NumericInput;

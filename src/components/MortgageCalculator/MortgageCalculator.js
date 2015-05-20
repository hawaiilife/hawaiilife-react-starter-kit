import './MortgageCalculator.less';
import React, { PropTypes } from 'react';

import AppActions from '../../actions/AppActions';
import MortgageCalculatorStore from '../../stores/MortgageCalculatorStore';
import NumericInput from '../NumericInput/NumericInput';
import PieChart from "../PieChart/PieChart";


class MortgageCalculatorInput extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.name}</td>
        <td>{this.props.unit}</td>
        <td style = {divStyle}>
          <NumericInput type = "range" step = {this.props.step} min = {this.props.min} max = {this.props.max} value={this.props.value} dp={this.props.dp}
                        prefix = {this.props.prefix} postfix = {this.props.postfix} onChange={this.props.onChange}/>
        </td>
      </tr>
    );
  }
}

class MortgageCalculatorInputGroup extends React.Component {

  handleChange(field, value) {
    this.props.onChange(React.addons.update(this.props.mortgageInputs, {
      [field]: { '$set': value }
    }));
  }

  render() {
    return (
      <table>
      <MortgageCalculatorInput name="Price" min = "0" max = "1000000" step  = "5000" prefix = "$"
                                  onChange={this.handleChange.bind(this, 'price')}
                                  value={this.props.mortgageInputs.price} />
      <MortgageCalculatorInput name="Down Payment" dp="3" min = "0" max = "40" step  = "0.5"  postfix = "%"
                                  onChange={this.handleChange.bind(this, 'percentDownPayment')}
                                  value={this.props.mortgageInputs.percentDownPayment} />
      <MortgageCalculatorInput name="Interest Rate" dp="3" min = "0" max = "12" step  = "0.125" postfix = "%"
                                  onChange={this.handleChange.bind(this, 'interest')}
                                  value={this.props.mortgageInputs.interest} />
      <MortgageCalculatorInput name="Years" min = "0" max = "100" step  = "1"
                                  onChange={this.handleChange.bind(this, 'duration')}
                                  value={this.props.mortgageInputs.duration} />
      </table>
    );
  }
}

class MortgageCalculatorResultsGroup extends React.Component {

  render() {
    let value = this.formatNumber(this.props.monthlyPayment);

    var slices = [
      { color: '#33CCFF', value: this.props.totalInterest },
      { color: '#CCCCFF', value: this.props.totalCost },
      { color: '#CCDDFF', value: this.props.downPayment }
    ];

    return (
      <div>
        <h4>Your payment:  ${value}/mo</h4>
        <div style = {divStyle} >
          <PieChart slices={slices} />
        </div>
      </div>
    );
  }

  formatNumber(number) {
    if (isNaN(number)) {
      return '-';
    }
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
var divStyle = {
  width: '200px'
};

class MortgageCalculator extends React.Component {

  constructor(props) {
    super(props);
    this.state = { mortgageInputs: MortgageCalculatorStore.getMortgageInputs(), monthlyPayment: MortgageCalculatorStore.getMonthlyPayment(), totalInterest: MortgageCalculatorStore.getTotalInterest(), totalCost: MortgageCalculatorStore.getTotalCost() };
  }

  componentDidMount() {
    MortgageCalculatorStore.onChange(this.handleMortgageResultsChange.bind(this));
  }

  componentWillUnmount() {
    MortgageCalculatorStore.off(this.handleMortgageResultsChange.bind(this));
  }

  handleMortgageResultsChange() {
     this.setState({ mortgageInputs: MortgageCalculatorStore.getMortgageInputs(), monthlyPayment: MortgageCalculatorStore.getMonthlyPayment(), totalInterest: MortgageCalculatorStore.getTotalInterest(), totalCost: MortgageCalculatorStore.getTotalCost() });
  }

  handleMortgageInputsChange(value) {
    AppActions.mortgageInputsChanged(value);
  }

  render() {
    var downPayment = this.state.mortgageInputs.percentDownPayment/100 * this.state.mortgageInputs.price;
    console.log(downPayment);
    return (
      <div>
        <h3>Mortgage Calculator</h3>
        <MortgageCalculatorResultsGroup monthlyPayment = {this.state.monthlyPayment} totalInterest = { this.state.totalInterest} totalCost = { this.state.totalCost} downPayment = { downPayment } />
        <MortgageCalculatorInputGroup
          mortgageInputs={this.state.mortgageInputs}
          onChange={this.handleMortgageInputsChange.bind(this)}/>
      </div>
    );
  }
}

MortgageCalculator.propTypes = { mortgageInputs: React.PropTypes.object };
MortgageCalculator.defaultProps =
{
  mortgageInputs : {
    price: 0,
    percentDownPayment: 0,
    interest: 0.0,
    duration: 0
  },
  monthlyPayment : 0,
  totalInterest: 0,
  totalCost : 0
};

export default MortgageCalculator;

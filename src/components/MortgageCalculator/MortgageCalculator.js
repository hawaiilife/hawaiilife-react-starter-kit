'use strict'
import './MortgageCalculator.less';
import React, { PropTypes } from 'react';
import AppActions from '../../actions/AppActions';
import MortgageCalculatorStore from '../../stores/MortgageCalculatorStore';
import ReactD3 from 'react-d3-components';
var PieChart = ReactD3.PieChart;
var d3 = require("./../../../node_modules/react-d3-components/node_modules/d3");
import ReactSlider from 'react-slider';

//----------------------------------------------------------------------------------------------------------------------
function formatNumber(number) {
  if (isNaN(number)) {
    return '-';
  }
  return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//----------------------------------------------------------------------------------------------------------------------
class MortgageCalculatorInput extends React.Component {
  render() {
    return (
      <div className='input-item'>
        <div className='slider-text-group'>
          <div className='input-title'>
            {this.props.name}
          </div>
          <div className='input-value'>
            {this.props.displayValue}
          </div>
        </div>
        <ReactSlider className='horizontal-slider' value={this.props.value} step={this.props.step}
                     min={this.props.min} max={this.props.max} withBars={true} onChange={this.props.onChange}/>
      </div>
    );
  }
}

MortgageCalculatorInput.propTypes =
{
  name: React.PropTypes.string,
  displayValue: React.PropTypes.string,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
  value: React.PropTypes.number,
  onChange: React.PropTypes.func
};

MortgageCalculatorInput.defaultProps =
{}

//----------------------------------------------------------------------------------------------------------------------
class MortgageCalculatorInputGroup extends React.Component {

  handleChange(field, value) {
    this.props.onChange(React.addons.update(this.props.mortgageInputs, {
      [field]: {'$set': value}
    }));
  }

  render() {

    var priceValue = this.props.mortgageInputs.price;
    var priceDisplay = formatNumber(priceValue);
    var interestValue = this.props.mortgageInputs.interest;
    var interestDisplay = '% ' + interestValue.toFixed(2);
    var durationValue = this.props.mortgageInputs.duration;
    var durationDisplay = durationValue.toString();
    var downPaymentValue = this.props.mortgageInputs.percentDownPayment;
    var downPaymentDisplay = '% ' + downPaymentValue.toFixed(1);

    return (
      <div className='border-box input'>

        <MortgageCalculatorInput name='Price' min={5000} max={1000000} step={5000} displayValue={priceDisplay}
                                 onChange={this.handleChange.bind(this, 'price')}
                                 value={priceValue}/>

        <MortgageCalculatorInput name='Down Payment' min={0} max={40} step={0.5} displayValue={downPaymentDisplay}
                                 onChange={this.handleChange.bind(this, 'percentDownPayment')}
                                 value={downPaymentValue}/>

        <MortgageCalculatorInput name='Interest Rate' min={0} max={12} step={0.125} displayValue={interestDisplay}
                                 onChange={this.handleChange.bind(this, 'interest')}
                                 value={interestValue}/>

        <MortgageCalculatorInput name='Years' min={1} max={100} step={1} displayValue={durationDisplay}
                                 onChange={this.handleChange.bind(this, 'duration')}
                                 value={durationValue}/>
      </div>
    );
  }
}
MortgageCalculatorInputGroup.propTypes =
{
  mortgageInputs: React.PropTypes.object,
  onChange: React.PropTypes.func
};

MortgageCalculatorInputGroup.defaultProps =
{};

//----------------------------------------------------------------------------------------------------------------------
class MortgageCalculatorResultsGroup extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let value = formatNumber(this.props.mortgageOutputs.monthlyPayment);

    var data = {
      label: 'mortgagePaymentChart',
      values: [
        {x: 'Loan', y: this.props.mortgageOutputs.totalCost},
        {x: 'Down', y: this.props.mortgageOutputs.downPayment},
        {x: 'Interest', y: this.props.mortgageOutputs.totalInterest}
      ]
    };

    var sort = null;// d3.ascending(), d3.descending(), func(a,b) { return a - b; }, etc..

    return (
      <div className='border-box output'>
        <div className='output-text-group'>
          <div className='output-text'>Your payment</div>
          <div className='output-text-value'>$ {value}/mo</div>
        </div>

        <div className='chart'>
          <PieChart
            data={data}
            width={500}
            height={300}
            margin={{top: 10, bottom: 10, left: 0, right: 100}}
            sort={sort}
            colorScale={d3.scale.category20c()}
            />
        </div>
      </div>
    );
  }
}
MortgageCalculatorResultsGroup.propTypes =
{
  mortgageOutputs: React.PropTypes.object
};
MortgageCalculatorResultsGroup.defaultProps =
{};

//----------------------------------------------------------------------------------------------------------------------
class MortgageCalculator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mortgageInputs: MortgageCalculatorStore.getMortgageInputs(),
      mortgageOutputs: MortgageCalculatorStore.getMortgageOutputs()
    };
  }

  componentDidMount() {
    MortgageCalculatorStore.onChange(this.handleMortgageResultsChange.bind(this));
  }

  componentWillUnmount() {
    MortgageCalculatorStore.off(this.handleMortgageResultsChange.bind(this));
  }

  handleMortgageResultsChange() {
    this.setState({
      mortgageInputs: MortgageCalculatorStore.getMortgageInputs(),
      mortgageOutputs: MortgageCalculatorStore.getMortgageOutputs()
    });
  }

  handleMortgageInputsChange(value) {
    AppActions.mortgageInputsChanged(value);
  }

  render() {
    return (
      <div className='border-box body'>
        <h3>Mortgage Calculator</h3>

        <div className='border-box flex-down'>
          <MortgageCalculatorResultsGroup mortgageOutputs={this.state.mortgageOutputs}/>
          <MortgageCalculatorInputGroup mortgageInputs={this.state.mortgageInputs}
                                        onChange={this.handleMortgageInputsChange.bind(this)}/>
        </div>
      </div>
    );
  }
}
MortgageCalculator.propTypes = {mortgageInputs: React.PropTypes.object};
MortgageCalculator.defaultProps =
{
  mortgageInputs: {
    price: 0,
    percentDownPayment: 0,
    interest: 0.0,
    duration: 0
  },
  monthlyPayment: 0,
  totalInterest: 0,
  totalCost: 0
};
export default MortgageCalculator;

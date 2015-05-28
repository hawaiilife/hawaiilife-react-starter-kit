/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Dispatcher from '../core/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import PayloadSources from '../constants/PayloadSources';
import EventEmitter from 'eventemitter3';
import assign from 'react/lib/Object.assign';

var CHANGE_EVENT = 'change';

var mortgageInputs = {
  price: 200000,
  percentDownPayment: 10.0,
  interest: 1.5,
  duration: 30
};

var mortgageOutputs = null;

var MortgageCalculatorStore = assign({}, EventEmitter.prototype, {

  getMortgageOutputs() {
    if (mortgageOutputs == null) {
      mortgageOutputs = {};
      calculateMortgageOutputs();
    }
    return mortgageOutputs;
  },

  getMortgageInputs() {
    return mortgageInputs;
  },

  emitChange() {
    return this.emit(CHANGE_EVENT);
  },

  onChange(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  off(callback) {
    this.off(CHANGE_EVENT, callback);
  }

});

MortgageCalculatorStore.dispatcherToken = Dispatcher.register((payload) => {
  var action = payload.action;

  switch (action.actionType) {
    case ActionTypes.MORTGAGE_INPUTS_CHANGED:
      mortgageInputs = action.mortgageInputs;
      calculateMortgageOutputs();
      MortgageCalculatorStore.emitChange();
      break;
    default:
  }
});

function totalOwed() {
  return Math.max(mortgageInputs.price - mortgageInputs.price * mortgageInputs.percentDownPayment / 100, 0);
}

function calculateTotalInterest() {
  mortgageOutputs.totalInterest = ( mortgageOutputs.monthlyPayment * mortgageInputs.duration * 12) - totalOwed();
}

function calculateTotalCost() {
  mortgageOutputs.totalCost = ( mortgageOutputs.monthlyPayment * mortgageInputs.duration * 12);
}

function calculateMonthlyPayment() {
  const monthlyInterest = mortgageInputs.interest / 100 / 12;
  const numPeriods = mortgageInputs.duration * 12;

  if (mortgageInputs.duration == 0) {
    mortgageOutputs.monthlyPayment = totalOwed();
  }
  else if (monthlyInterest == 0) {
    mortgageOutputs.monthlyPayment = totalOwed() / numPeriods;
  }
  else {
    mortgageOutputs.monthlyPayment = totalOwed() *
      ((monthlyInterest * Math.pow(1 + monthlyInterest, numPeriods)) /
      (Math.pow(1 + monthlyInterest, numPeriods) - 1));
  }
}

function calculateMortgageOutputs() {
  calculateMonthlyPayment();
  calculateTotalInterest();
  calculateTotalCost();
  mortgageOutputs.downPayment = mortgageInputs.percentDownPayment / 100 * mortgageInputs.price;
}

export default MortgageCalculatorStore;

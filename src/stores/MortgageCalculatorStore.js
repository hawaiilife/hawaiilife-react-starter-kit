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

var price = 200000;
var percentDownPayment = 10.0;
var interest = 1.5;
var duration = 30;
var monthlyPayment = -1;
var totalInterest = -1;
var totalCost = -1;

var MortgageCalculatorStore = assign({}, EventEmitter.prototype, {

  getMonthlyPayment() {
    if (monthlyPayment == -1) {
      calculateMonthlyPayment();
    }
    return monthlyPayment;
  },

  getTotalInterest() {
    if (totalInterest == -1) {
      calculateTotalInterest();
    }
    return totalInterest;
  },

  getTotalCost() {
    if (totalCost == -1) {
      calculateTotalCost();
    }
    return totalCost;
  },

  getMortgageInputs() {
    return {price: price,
      percentDownPayment: percentDownPayment,
      interest: interest,
      duration: duration };
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

      price = action.mortgageInputs.price;
      interest = action.mortgageInputs.interest;
      percentDownPayment = action.mortgageInputs.percentDownPayment;
      duration = action.mortgageInputs.duration;

      calculateMonthlyPayment();
      calculateTotalInterest();
      calculateTotalCost();

      MortgageCalculatorStore.emitChange();
    break;
    default:
  }
});

function totalOwed() {
  return Math.max(price - price*percentDownPayment/100, 0);
}

function calculateTotalInterest() {
  totalInterest = (monthlyPayment * duration * 12) - totalOwed();
}

function calculateTotalCost() {
  totalCost = (monthlyPayment * duration * 12);
}

function calculateMonthlyPayment() {
  const monthlyInterest = interest / 100 / 12;
  const numPeriods = duration * 12;

  if (duration == 0) {
    monthlyPayment = totalOwed();
  }
  else if (monthlyInterest == 0)
  {
    monthlyPayment = totalOwed()/numPeriods;
  }
  else
  {
    monthlyPayment = totalOwed() *
      ((monthlyInterest * Math.pow(1 + monthlyInterest, numPeriods)) /
      (Math.pow(1 + monthlyInterest, numPeriods) - 1));
  }

}

export default MortgageCalculatorStore;

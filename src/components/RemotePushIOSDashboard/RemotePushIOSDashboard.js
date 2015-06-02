/**
 * Created by maxwellzietz on 5/28/15.
 */

"use strict";

import React, { PropTypes } from 'react';

import './RemotePushIOSDashboard.less';

var API_URL = 'http://hawaiilife-47072.onmodulus.net/api';
API_URL = 'http://192.168.1.149:8080/api';
var request = require('superagent');

class InstallColumns extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var row = this.props.keys.map((key)=> {
      return (
        <div className='rpiCell'>
          {key}
        </div>);
    });
    return (
      <div className='rpiColumns'>
        {row}
      </div>
    );
  }
}
InstallColumns.propTypes = {keys: React.PropTypes.array};
InstallColumns.defaultProps = {};

class InstallRow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {customData: 'payload'};
  }

  render() {
    return (
      <div className='rpiRow'>
        <div className='rpiCell'>
          {this.props.id}
        </div>
        <div className='rpiCell'>
          <input onChange = {(value) => { this.setState({message: value.target.value }) } }/>
        </div>
        <div className='rpiCell'>
          <button className='rpiButton' onClick={ ()=> {
            var self = this;
            request
              .post(API_URL + "/apn/" + self.props.deviceToken)
              .set("customData", self.state.message)
              .end(function (err, res) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("push ok!");
                  }
              });
              }}>

            Push
          </button>
        </div>
      </div>
    );
  }
}
InstallRow.propTypes = {
  id: React.PropTypes.string,
  deviceToken: React.PropTypes.string,
  onClick: React.PropTypes.func
};
InstallRow.defaultProps = {};

class InstallsTable extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var rows = this.props.installs.map((install)=> {
      return (<InstallRow id={install._id} deviceToken={install.deviceToken} />);
    });
    return (
      <div className='rpiTable'>
        <InstallColumns keys={['ID', 'MESSAGE', 'SEND']}/>
        {rows}
      </div>
    );
  }
}
InstallsTable.propTypes = {installs: React.PropTypes.array, onClick: React.PropTypes.func};
InstallsTable.defaultProps = {};

class RemotePushIOSDashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isLoaded: false};
  }

  componentDidMount() {
    var self = this;
    request
      .get(API_URL + "/installs")
      .end(function (err, res) {
        if (err) {
          console.log(err);
        } else {
          self.setState({isLoaded: true, installs: res.body});
        }
      });
  }

  componentWillUnmount() {
  }

  render() {
    var table = (this.state.isLoaded) ? <InstallsTable installs={this.state.installs} /> : "";
    return (
      <div className='rpiContainer'>
        <h3>Remote Push iOS Dashboard</h3>
        {table}
      </div>
    );
  }
}
RemotePushIOSDashboard.propTypes = {};
RemotePushIOSDashboard.defaultProps = {};

export default RemotePushIOSDashboard;


'use strict';
import './D3Test.less';
import React, { PropTypes } from 'react';

import ReactD3 from 'react-d3-components';
var d3 = require('./../../../node_modules/react-d3-components/node_modules/d3');

var ScatterPlot = ReactD3.ScatterPlot;
var BarChart = ReactD3.BarChart;


//var ReactGoogleMaps = require('react-googlemaps');
//var GoogleMapsAPI = window.google.maps;
//var Map = ReactGoogleMaps.Map;
//var Marker = ReactGoogleMaps.Marker;
//var OverlayView = ReactGoogleMaps.OverlayView;

import ReactSlider from 'react-slider';

class ScatterPlotTest extends React.Component {

  constructor(props) {
    super(props);
    var data = {label: '', values: []};

    for (var i = 0; i < 100; i++) {
      data.values.push({x: i * Math.random(), y: i * Math.random()});
    }
    this.state = {
      data: data
    };
  }

  tooltipScatter(x, y) {
    return 'x: ' + x + ' y: ' + y;
  }

  render() {
    return (
      <div>
        <ScatterPlot
          data={this.state.data}
          width={400}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={this.tooltipScatter}
          xAxis={{label: 'fake'}}
          yAxis={{label: 'data'}}
          colorScale={d3.scale.category20()}/>
      </div>
    );
  }
}


class BarChartTest extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [{
        label: 'Mock',
        values: [{x: 'Mock', y: 5}, {x: 'Data', y: 4}, {x: 'Here', y: 8}]
      }]
    };
  }

  render() {
    return (
      <div>
        <BarChart
          data={this.state.data}
          width={400}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          sort={null}
          colorScale={d3.scale.category20b()}/>

      </div>
    );
  }
}

class D3Test extends React.Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {

    return (
      <div className='d3-container'>
        <ScatterPlotTest />
        <BarChartTest />

        {/*<Map
         initialZoom={10}
         initialCenter={new GoogleMapsAPI.LatLng(-41.2864, 174.7762)}>

         <Marker
         onClick={null}
         position={new GoogleMapsAPI.LatLng(-41.2864, 174.7762)}/>

         <OverlayView
         style={{backgroundColor: '#fff'}}
         position={new GoogleMapsAPI.LatLng(-41.2864, 174.7762)}>
         <p>Some content</p>
         </OverlayView>
         </Map> */}
      </div>
    );
  }
}

D3Test.propTypes = {};
D3Test.defaultProps =
{};
export default D3Test;

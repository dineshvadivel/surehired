import React, { Component } from 'react';
var PieChart = require("react-chartjs").Pie;

var data = [
    {
        value: 300,
        color: "#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    },
    {
        value: 50,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green"
    },
    {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    }
]

class AnalyticsPieChart extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <PieChart data={this.props.data} width="600" height="250" />
        )
    }
}

export default AnalyticsPieChart
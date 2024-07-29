import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// import styles from "../charts.module.css"

const PieChart = ({ dd=[],type="line" }) => {
  // Highcharts configuration options
  const options = {
    chart: {
        type: 'cylinder',
        options3d: {
            enabled: true,
            alpha: 15,
            beta: 15,
            depth: 50,
            viewDistance: 25
        }
    },
    title: {
      text: 'Line Chart Example'
    },
    xAxis: {
      categories: dd.map(obj=>obj._id)
    },
    yAxis: {
      title: {
        text: 'Value'
      }
    },
    series: [{
      name: 'Data',
      data: dd.map(obj=>obj.val)
    }]
  };

  return (
    <div >
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default PieChart;

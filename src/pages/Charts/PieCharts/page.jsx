import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// import styles from "../charts.module.css"

const PieChart = ({ dd=[],query="" }) => {
  // Highcharts configuration options
  const totol=dd.reduce((sum,currentValObj)=>sum+currentValObj.val,0)
  const options = {
    chart: {
      type: 'pie'
  },
  title: {
      text: query
  },
  tooltip: {
      valueSuffix: '%'
  },
  // subtitle: {
  //     text:
  //     'Source:<a href="https://www.mdpi.com/2072-6643/11/3/684/htm" target="_default">MDPI</a>'
  // },
  plotOptions: {
      series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [{
              enabled: true,
              distance: 20
          }, {
              enabled: true,
              distance: -40,
              format: '{point.percentage:.1f}%',
              style: {
                  fontSize: '1.2em',
                  textOutline: 'none',
                  opacity: 0.7
              },
              filter: {
                  operator: '>',
                  property: 'percentage',
                  value: 10
              }
          }]
      }
  },
  series: [
      {
          name: 'Percentage',
          colorByPoint: true,
          data: dd.map(obj=>({name:obj._id+" : "+obj.val.toFixed(2)+"("+((obj.val/totol)*100).toFixed(2)+"%"+")",y:(obj.val/totol)*100}))

  }]};

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

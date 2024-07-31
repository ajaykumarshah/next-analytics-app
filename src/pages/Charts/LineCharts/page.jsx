import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import styles from "../charts.module.css"
import { calculate_Y_Axis, calculate_Plot_Options, calculate_X_Axis, calculate_Chart_Fields } from '../utils';
import { Skeleton } from 'antd';

const LineChart = ({ dd:data=[],type="line" ,dataAnalysing,typedQuery}) => {
  // Highcharts configuration options
  const options = {
    chart: calculate_Chart_Fields({type,data}),
    title: {
      text: typedQuery
    },
    credits:{
      enabled:false
    },
    plotOptions: {
      column: {
        groupPadding: 10,
        pointPadding :10
      }
    },
    xAxis: calculate_X_Axis({type,data}),
    yAxis: calculate_Y_Axis({type,data}),
    plotOptions: calculate_Plot_Options({type,data}),
    series: [{
      name: 'Data',
      data: data.map(obj=>obj.val)
    }]
  };

  return (
    <div className={styles.chart_container}>
      {
        dataAnalysing?<Skeleton active paragraph={{rows:5}} />:(<HighchartsReact
          highcharts={Highcharts}
          options={options}
        />)
      }

    </div>
  );
};

export default LineChart;

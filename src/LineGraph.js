import React,{useState,useEffect} from 'react'
import axios from 'axios'

import {Line} from 'react-chartjs-2'
import numeral from 'numeral'

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};
function LineGraph({ casesType = 'cases' }) {
  const [data, setData] = useState({})


  const fetchGraphData = async () => {
    const { data } = await axios.get(
      'https://disease.sh/v3/covid-19/historical/all?lastdays=120'
    )
    const chartData = buildChartData(data, casesType)
    return chartData
  }
  const buildChartData = (data, caseType = 'cases') => {
    const chartData = []
    let lastdataPoint
    for (let date in data[caseType]) {
      if (lastdataPoint) {
        const newDataPoint = {
          x: date,
          y: data[caseType][date] - lastdataPoint,
        }
        chartData.push(newDataPoint)
      }
      lastdataPoint = data[caseType][date]
    }
    return chartData
  }

  useEffect(() => {
    async function fetchMyAPI() {
      const data = await fetchGraphData()
      setData(data)
    }
    fetchMyAPI()
  }, [casesType])




  return (
    <div className=''>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: 'rgba(204, 16, 52, 0.5)',
                borderColor: '#CC1034',
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  )
}

export default LineGraph

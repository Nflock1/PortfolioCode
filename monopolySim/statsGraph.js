import ChartImage from 'chart.js-image'
import fs from 'fs-extra'

//console.log(fs.readFileSync("./data.json"))
async function chart() {

  let data = JSON.parse(fs.readFileSync("./data.json"))
  console.log(data)
  // const data = [
  //   { year: 2010, count: 10 },
  //   { year: 2011, count: 20 },
  //   { year: 2012, count: 15 },
  //   { year: 2013, count: 25 },
  //   { year: 2014, count: 22 },
  //   { year: 2015, count: 30 },
  //   { year: 2016, count: 28 },
  // ];

  

  let barChart = ChartImage().chart(
    {
      "type": 'bar',
      "data": {
        "labels": data.map(row => row.space_name),
        "datasets": [
          {
            "label": 'Percentage of Moves Landing on Space',
            "data": data.map(row => row.count)
          }
        ]
      },
      options: {
        scales: {
            xAxes: [{
                ticks: {
                    autoSkip: false,
                    maxRotation: 50,
                    minRotation: 30
                },
            },]
          }
      }
    }
  ).width("800").height("300");

  await barChart.toFile('./rawLandings.png');

  let sum = 0;
  let chance = 0;
  let communityChest = 0;
  for( let i = 0; i < data.length; i ++){
    sum += data[i].count;
    if(data[i].space_name == "Chance") {
      chance += data[i].count;
    }
    
    if(data[i].space_name == "Community Chest") {
      communityChest += data[i].count;
    }
  }
  console.log(chance)
  console.log(communityChest)

  let percentBarChart = ChartImage().chart(
    {
      "type": 'bar',
      "data": {
        "labels": data.map(row => row.space_name),
        "datasets": [
          {
            "label": 'Percentage of Moves Landing on Space',
            "data": data.map(row => row.count * 100 / sum)
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: false,
              maxRotation: 50,
              minRotation: 30
            },
          }]
        }
      }
    }
  ).width("800").height("300");

  await percentBarChart.toFile('./percentageLandings.png')

  //do analysis to find correlation between some being landed on more
  let chanceVCommunity = ChartImage().chart(
    {
      "type": 'bar',
      "data": {
        "labels": ['Chance', 'Community Chest'],
        "datasets": [
          {
            "label": 'Landings on Chance vs Community chest',
            "data": [chance * 100 / sum, communityChest * 100 / sum]
          }
        ]
      }
    }
  )

  await chanceVCommunity.toFile('./ChanceVSCommunity.png')
};
chart()
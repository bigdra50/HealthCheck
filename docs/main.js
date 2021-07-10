const URLJoin = (...args) =>
  args.join('/')
    .replace(/[\/]+/g, '/')
    .replace(/^(.+):\//, '$1://')
    .replace(/^file:/, 'file:/')
    .replace(/\/(\?|&|#[^!])/g, '$1')
    .replace(/\?/g, '&')
    .replace('&', '?');

const toYYYYMMDD = dt => {
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var result = y + "-" + m + "-" + d;
  return result;
}

const host = "https://api.ouraring.com/v1/";
var today = new Date();
var lastMonth = new Date();
lastMonth.setDate(today.getDate() - 30);
const startDate = "?start=" + toYYYYMMDD(lastMonth);
const endDate = "?end=" + toYYYYMMDD(new Date());
const accessToken = "?access_token=E7VCEPQMJKI73OMWZ5BYLLIILRVKTFNP";

const ouraActivity = URLJoin(host, "activity", startDate, endDate, accessToken);
const ouraReadiness = URLJoin(host, "readiness", startDate, endDate, accessToken);
const ouraSleep = URLJoin(host, "sleep", startDate, endDate, accessToken);
console.log(ouraActivity);

//fetch(ouraReadiness, {
//  method: "GET",
//}).then(response => response.json())
//  .then(json => readinessObject(json))
//  .catch(e => console.log(e));
//
//fetch(ouraActivity, {
//  method: "GET",
//}).then(response => response.json())
//  .then(json => activityObject(json))
//  .catch(e => console.log(e));

fetch(ouraSleep, {
  method: "GET",
}).then(response => response.json())
  .then(json => sleepObject(json))
  .then(_ => sleepChart.update())
  .catch(e => console.log(e));

const labels = [];
const hr_averages = [];
const hr_lowest = [];
const activityObject = json => {
  console.log(json.activity);
  for (let i in json.activity) {
    const date = json.activity[i].summary_date;
    //label.push(date);
  }
}

const readinessObject = json => {
  console.log(json.readiness);
  for (let i in json.readiness) {
    const date = json.readiness[i].summary_date;
    //label.push(date);
    //console.log(json.readiness[i].score_hrv_balance);
  }
}
const sleepObject = json => {
  console.log(json.sleep);
  for (let i in json.sleep) {
    const sleep = json.sleep[i];
    const date = sleep.summary_date;
    labels.push(date);
    hr_averages.push(sleep.hr_average);
    hr_lowest.push(sleep.hr_lowest);
  }
}
const ctx1 = document.getElementById('chart1');
const graphData = {
  labels: labels,
  datasets: [{
    label: 'HR_Averages',
    data: hr_averages,
    backgroundColor: 'rgba(0,0,0,0)',
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)'
    ],
    borderWidth: 1
  },
  {
    label: 'HR_Lowest',
    data: hr_lowest,
    backgroundColor: 'rgba(0,0,0,0)',
    borderColor: [
      'rgba(54,162,236,1)'
    ]
  }]
};

const options = {};
const sleepChart = new Chart(ctx1, {
  type: 'line',
  data: graphData,
  options: options
});

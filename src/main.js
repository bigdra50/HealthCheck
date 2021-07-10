const model = {
  Activity: {
    labels: [],
  },
  Readiness: {
    labels: [],
  },
  Sleep: {
    labels: [],
    hr_averages: [],
    hr_lowest: [],
  },
  update: (msg, json) => {
    switch (msg) {
      case 'Activity':
        model.Activity.labels = json.activity.map(x => x.summary_date);
        break;
      case 'Readiness':
        model.Readiness.labels = json.readiness.map(x => x.summary_date);
        break;
      case 'Sleep':
        model.Sleep.labels = json.sleep.map(x => x.summary_date);
        model.Sleep.hr_averages = json.sleep.map(x => x.hr_average);
        model.Sleep.hr_lowest = json.sleep.map(x => x.hr_lowest);
        break;
      default:
        break;
    }
  }
}

const view = {
  render: (type, model) => {
    switch (type) {
      case 'Activity':
        break;
      case 'Readiness':
        break;
      case 'Sleep':
        const graphData = {
          labels: model.Sleep.labels,
          datasets: [{
            label: '平均心拍数(bpm)',
            data: model.Sleep.hr_averages,
            fill: false,
          },
          {
            label: '最低心拍数(bpm)',
            data: model.Sleep.hr_lowest,
            fill: false,
          }]
        };
        const options = {
          plugins: {
            colorschemes: {
              scheme: 'brewer.Paired12'
            }
          }
        };
        const heartRateChart = document.getElementById('heartRateChart');
        const sleepChart = new Chart(heartRateChart, {
          type: 'line',
          data: graphData,
          options: options
        });
        sleepChart.update();
        break;
      default:
        break;
    }
  }
}

const getOuraApiUrl = type => {
  const joinUrl = (...args) =>
    args.join('/')
      .replace(/[\/]+/g, '/')
      .replace(/^(.+):\//, '$1://')
      .replace(/^file:/, 'file:/')
      .replace(/\/(\?|&|#[^!])/g, '$1')
      .replace(/\?/g, '&')
      .replace('&', '?');

  const toYYYYMMDD = dt => {
    const y = dt.getFullYear();
    const m = ("00" + (dt.getMonth() + 1)).slice(-2);
    const d = ("00" + dt.getDate()).slice(-2);
    return y + "-" + m + "-" + d;
  }
  const host = "https://api.ouraring.com/v1/";
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setDate(today.getDate() - 30);
  const startDate = "?start=" + toYYYYMMDD(lastMonth);
  const endDate = "?end=" + toYYYYMMDD(today);
  const accessToken = "?access_token=E7VCEPQMJKI73OMWZ5BYLLIILRVKTFNP";
  return joinUrl(host, type.toLowerCase(), startDate, endDate, accessToken);
}

fetch(getOuraApiUrl('Sleep'))
  .then(response => response.json())
  .then(json => model.update('Sleep', json))
  .then(_ => view.render('Sleep', model))
  .catch(e => console.log(e));

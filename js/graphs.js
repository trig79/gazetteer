//Creates Chart for App using chart.js plugin

const ctx = document.getElementById('covid-chart').getContext('2d');
const totalCovidChart = (totalDeath, totalRecover, recentConf) => {
const chart = new Chart(ctx, {
    // The type of chart we want to create, Nb for stacked charts to work it need multiple datasets
    //type: 'horizontalBar',
    type: 'bar',
    data: {
        labels: [''],
        datasets: [
            {
                label: 'Total Death',
                data: [totalDeath], 
                backgroundColor: ['rgba(255, 99, 132'],
                borderColor:     ['rgb(255, 99, 132)'],
            },
            {
                label: 'Total Recoverd',
                data: [totalRecover], 
                backgroundColor: ['rgba(25, 99, 132, .5)'],
                borderColor:     ['rgb(25, 99, 132)'],
            },
            {
                label: 'Recent Confirmed Case',
                data: [recentConf], 
                backgroundColor: ['rgba(255, 9, 12, .5)'],
                borderColor:     ['rgb(255, 9, 12)'],
            }
        ]
    },

    // Configuration options go here
    options: {
        scales: {
            xAxes: [{
              stacked: true
            }],
            yAxes: [{
              stacked: true
            }]
          },
        legend: {
            display: false,
        },
        maintainAspectRatio: false,
    }
});
}

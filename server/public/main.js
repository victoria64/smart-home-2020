const socket = io();

var tempChart, lightChart;

socket.on('temperature', function (data) {
    //console.log(data);
    //let temperature = document.getElementById('temperature');
    //temperature.innerHTML = `${data}`;
    if (tempChart == undefined) {
        tempChart = initTempChart()
    }
    addData(tempChart, '', data);
});
socket.on('lighting', function (data) {
    //console.log(data);
    //let temperature = document.getElementById('lighting');
    //temperature.innerHTML = `${data}`;
    if (lightChart == undefined) {
        lightChart = initLightChart()
    }
    addData(lightChart, '', data);
});
socket.on('servo', function (data) {
    //console.log(data);
    let servo = document.getElementById('servo');
    servo.innerHTML = `${data}`;
});

function changeLedGreenStatus(e) {
    socket.emit('LedGreen', 1);
    
};

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function initTempChart() {
    var ctx = document.getElementById('tempChart');

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['temperature'],
            datasets: [{
                label: 'temperature',
                data: [],
                backgroundColor: [
                    'rgba(255, 0, 0, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 0, 0, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function initLightChart() {
    var ctx2 = document.getElementById('lightChart');

    return new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['lighting'],
            datasets: [{
                label: 'lighting',
                data: [],
                backgroundColor: [
                    'rgba(0, 0, 255, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 0, 255, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
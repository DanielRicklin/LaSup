const alerts = document.querySelector('#alerts')
const createEquipmentButton = document.querySelector('#createEquipment')
const getInterfacesButton = document.querySelector('#addInterface')
const ModalInterface = document.querySelector('#modalInterface')
const charts = document.querySelector('#latences')

if(createEquipmentButton){
    createEquipmentButton.addEventListener('click', () => {
        axios.post(
            '/equipment/create',
            {
                name: document.querySelector('#name').value,
                ip: document.querySelector('#ip').value,
                description: document.querySelector('#description').value
            }
        ).then((response) => {
            document.querySelector('#name').innerHTML = ""
            document.querySelector('#ip').innerHTML = ""
            document.querySelector('#description').innerHTML = ""
            document.location.href = `/equipment/${response.data.id}`
        }).catch((err) => {
            alerts.innerHTML = ''
            alerts.parentElement.style.display = 'block';
            alerts.innerHTML = '<i class="material-icons white-text" style="position: absolute; top: 0px; right: 5px; cursor: pointer;" id="closeButton">close</i>'
            err.response.data.error.forEach(err => {
                alerts.innerHTML += `<div class="white-text center-align">${err.msg}</div>`
            });

            //Pas top  mais je suis naze
            document.querySelector('#closeButton').addEventListener('click', () => {
                alerts.innerHTML = ''
                alerts.parentElement.style.display = 'none'
            })
        })
    })
}
if(getInterfacesButton){
    getInterfacesButton.addEventListener('click', () => {
        axios.get(
            `/equipment/${document.querySelector('#ip').value}/interfaces`
        ).then((response) => {
            console.log(response.data)
            ModalInterface.innerHTML = ''
            response.data.interfaces.forEach(interface => {
                ModalInterface.innerHTML += 
                `<p>
                    <label>
                        <input type="checkbox" class="filled-in"/>
                        <span>${interface.name}</span>
                    </label>
                </p>`
            })
            const modal = document.querySelector('.modal')
            const instance = M.Modal.init(modal, {dismissible: false})
            // ModalInterface.innerHTML += '</form>'
            instance.open()
        }).catch((err) => {
            console.error(err.response.data.error)
        })
    })
}

if(charts){
    const latence = []
    const pertes = []

    axios.get(
        `/equipment/${document.querySelector('#id').value}/data`
    ).then(response => {
        console.log(response.data)
        response.data.forEach(res => {
            let latency = Math.floor((Math.round(res.latency * 100)).toFixed(2))/100
            latence.push({date: new Date(res.createdAt), value: latency}) //faut enlever ce value pour coupeur le graph quand y'a des coupures
            pertes.push({date: new Date(res.createdAt), value: Math.round((res.pertes*100))})
        });
    }).then(()=>{
        am4core.ready(function() {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end
            
            var chart = am4core.create("latences", am4charts.XYChart);
            
            chart.data = latence;
            
            // Create axes
            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.minGridDistance = 60;

            // Zoom sur l'axe des abscisses
            // dateAxis.start = 0.7;
            // dateAxis.keepSelection = true;
            
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.title.text = "Latence (ms)"
            
            // Create series
            var series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "value";
            series.dataFields.dateX = "date";
            series.tooltipText = "{value} ms"
            series.smoothing = "monotoneX";
            // series.connect = false;
            
            series.tooltip.pointerOrientation = "vertical";
            
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.snapToSeries = series;
            chart.cursor.xAxis = dateAxis;
            
            //chart.scrollbarY = new am4core.Scrollbar();
            chart.scrollbarX = new am4core.Scrollbar();
            
        });
    }).then(()=> {
        am4core.ready(function() {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end
            
            var chart = am4core.create("pertes", am4charts.XYChart);
            
            chart.data = pertes;
            
            // Create axes
            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.minGridDistance = 60;
            
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.max = 100
            valueAxis.min = 0
            valueAxis.strictMinMax=true;
            valueAxis.title.text = "Pertes (%)"
            
            // Create series
            var series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "value";
            series.dataFields.dateX = "date";
            series.tooltipText = "{value} %"
            series.stroke = "#FF0000"
            series.strokeOpacity = 0.7
            series.fill = series.stroke
            series.fillOpacity = 0.7;
            series.smoothing = "monotoneX";
            // series.connect = false;
            
            series.tooltip.pointerOrientation = "vertical";
            
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.snapToSeries = series;
            chart.cursor.xAxis = dateAxis;
            
            //chart.scrollbarY = new am4core.Scrollbar();
            chart.scrollbarX = new am4core.Scrollbar();
            
        });
    })
    .catch(err => console.log)
}
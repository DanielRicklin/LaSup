const alerts = document.querySelector('#alerts')
const createEquipmentButton = document.querySelector('#createEquipment')
const getInterfacesButton = document.querySelector('#addInterface')
const deleteEquipmentButton = document.querySelectorAll('#deleteEquipmentButton')
const ModalInterface = document.querySelector('#modalInterface')
const charts = document.querySelector('#chartdiv')

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

if(deleteEquipmentButton){
    deleteEquipmentButton.forEach(deb => {
        deb.addEventListener('click', () => {
            axios.delete(
                `/equipment/${deb.dataset.id}`
            ).then((response) => {
                deb.parentNode.parentNode.remove()
            }).catch((err) => {
                console.error(err.response.data.error)
            })
        })  
    })
}

if(charts){
    const latence = []
    const pertes = []

    axios.get(
        `/equipment/${document.querySelector('#id').value}/data`
    ).then(response => {
        response.data.forEach(res => {
            let latency = Math.floor((Math.round(res.latency * 100)).toFixed(2))/100
            latence.push({date: new Date(res.createdAt), value: latency}) //faut enlever ce value pour coupeur le graph quand y'a des coupures
            pertes.push({date: new Date(res.createdAt), value: Math.round((res.pertes*100))})
        });
    // }).then(()=>{
    //     am4core.ready(function() {
    //         am4core.useTheme(am4themes_animated);
            
    //         var chart = am4core.create("latences", am4charts.XYChart);
            
    //         chart.data = latence;
            
    //         var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    //         dateAxis.renderer.minGridDistance = 60;
            
    //         var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    //         valueAxis.title.text = "Latence (ms)"
            
    //         var series = chart.series.push(new am4charts.LineSeries());
    //         series.dataFields.valueY = "value";
    //         series.dataFields.dateX = "date";
    //         series.tooltipText = "{value} ms"
    //         series.smoothing = "monotoneX";
            
    //         series.tooltip.pointerOrientation = "vertical";
            
    //         chart.cursor = new am4charts.XYCursor();
    //         chart.cursor.snapToSeries = series;
    //         chart.cursor.xAxis = dateAxis;
            
    //         chart.scrollbarX = new am4core.Scrollbar();
            
    //     });
    // }).then(()=> {
    //     am4core.ready(function() {
    //         am4core.useTheme(am4themes_animated);
            
    //         var chart = am4core.create("pertes", am4charts.XYChart);
            
    //         chart.data = pertes;
            
    //         var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    //         dateAxis.renderer.minGridDistance = 60;
            
    //         var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    //         valueAxis.max = 100
    //         valueAxis.min = 0
    //         valueAxis.strictMinMax=true;
    //         valueAxis.title.text = "Pertes (%)"
            
    //         var series = chart.series.push(new am4charts.LineSeries());
    //         series.dataFields.valueY = "value";
    //         series.dataFields.dateX = "date";
    //         series.tooltipText = "{value} %"
    //         series.stroke = "#FF0000"
    //         series.strokeOpacity = 0.7
    //         series.fill = series.stroke
    //         series.fillOpacity = 0.7;
    //         series.smoothing = "monotoneX";
            
    //         series.tooltip.pointerOrientation = "vertical";
            
    //         chart.cursor = new am4charts.XYCursor();
    //         chart.cursor.snapToSeries = series;
    //         chart.cursor.xAxis = dateAxis;
            
    //         chart.scrollbarX = new am4core.Scrollbar();
            
    //     });
    }).then(()=> {
        am5.ready(function() {

            var root = am5.Root.new("chartdiv");

            root.setThemes([
              am5themes_Animated.new(root)
            ]);
            
            var chart = root.container.children.push(
              am5xy.XYChart.new(root, {
                focusable: true,
                panX: true,
                panY: true,
                wheelX: "panX",
                wheelY: "zoomX",
              pinchZoomX:true
              })
            );
            
            var easing = am5.ease.linear;
            chart.get("colors").set("step", 3);
            
            var xAxis = chart.xAxes.push(
              am5xy.DateAxis.new(root, {
                maxDeviation: 0.1,
                groupData: false,
                baseInterval: {
                  timeUnit: "minute",
                  count: 5
                },
                renderer: am5xy.AxisRendererX.new(root, {}),
                tooltip: am5.Tooltip.new(root, {})
              })
            );

            function createAxisAndSeries(values, opposite, min, name) {
              var yRenderer = am5xy.AxisRendererY.new(root, {
                opposite: opposite
              });
              if(min){
                var yAxis = chart.yAxes.push(
                    am5xy.ValueAxis.new(root, {
                      min: 0,
                      max: 100,
                      strictMinMax: true,
                      maxDeviation: 1,
                      renderer: yRenderer
                    })
                  );
              } else {
                var yAxis = chart.yAxes.push(
                    am5xy.ValueAxis.new(root, {
                        min: 0,
                        maxDeviation: 1,
                        renderer: yRenderer
                    })
                );
              }
            
              if (chart.yAxes.indexOf(yAxis) > 0) {
                yAxis.set("syncWithAxis", chart.yAxes.getIndex(0));
              }
            
              // Add series
              // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
              var series = chart.series.push(
                am5xy.LineSeries.new(root, {
                  xAxis: xAxis,
                  yAxis: yAxis,
                  valueYField: "value",
                  valueXField: "date",
                  tooltip: am5.Tooltip.new(root, {
                    pointerOrientation: "horizontal",
                    labelText: name+": {valueY}"
                  })
                })
              );
            
              //series.fills.template.setAll({ fillOpacity: 0.2, visible: true });
              series.strokes.template.setAll({ strokeWidth: 1 });
            
              yRenderer.grid.template.set("strokeOpacity", 0.05);
              yRenderer.labels.template.set("fill", series.get("fill"));
              yRenderer.setAll({
                stroke: series.get("fill"),
                strokeOpacity: 1,
                opacity: 1
              });
            
              // Set up data processor to parse string dates
              // https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data
              series.data.processor = am5.DataProcessor.new(root, {
                dateFormat: "yyyy-MM-dd",
                dateFields: ["date"]
              });
            
              series.data.setAll(values);
            }
            
            // Add cursor
            // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
            var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
              xAxis: xAxis,
              behavior: "none"
            }));
            cursor.lineY.set("visible", false);
            
            // add scrollbar
            chart.set("scrollbarX", am5.Scrollbar.new(root, {
              orientation: "horizontal"
            }));
            
            createAxisAndSeries(latence, false, false, "Latence");
            createAxisAndSeries(pertes, true, true, "Pertes");
            // createAxisAndSeries(8000, true);
            
            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            chart.appear(1000, 100);
            
            });
    })
    .catch(err => console.log)
}    
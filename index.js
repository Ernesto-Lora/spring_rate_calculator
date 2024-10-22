function springRate(G, di, n, D) {
    return (G * Math.pow(di, 4)) / (8 * n * Math.pow(D, 3));
}

function findD(G, di, n, springRate) {
    return 1e3*Math.cbrt((G * Math.pow(di, 4)) / (springRate * 8 * n));
}

function completeSpringRate(G, E, alpha, d, n, D) {
    return (G * E * Math.pow(d, 4)) / (8 * n * Math.pow(D, 3) * E * Math.pow(Math.cos(alpha), 2) + 4 * n * D * G * Math.pow(d, 2) * Math.pow(Math.sin(alpha), 2));
}

function getTraces(limits = [], color = [],step, function0){
    var x = [];
    var y = [];
    for (let index = 0; index < limits.length-1; index++) {
        x[index] = math.range(limits[index], limits[index+1], step, true).toArray();
        y[index] = x[index].map(x => function0(x));
        }


    var traces = [];

    for (let index = 0; index < x.length; index++) {
        traces[index] = {
            x: x[index] ,
            y: y[index],
            name: '',
            showlegend: false,
            type: 'scatter',
            mode: 'lines',
            line: { color: color[index] }
        };
    }

    return traces;
}

class spring{
    constructor(G, d, n, min, max){
        this.G = G;
        this.d = d;
        this.n = n;
        this.min = min;
        this.max = max;
    }
    plot(){

        function springRateD(D) {
            return springRate(G.valueAsNumber*1e9,
                 d.valueAsNumber*1e-3,
                 n.valueAsNumber,
                 D*1e-3);
        }


        let limits1 = [10, 26];
        let trace = getTraces(limits1, ["#024CAA"], 0.1e-3, springRateD);

        var min1 = this.min.valueAsNumber;
        var max1 = this.max.valueAsNumber;

        var minD =  findD(G.valueAsNumber*1e9, d.valueAsNumber*1e-3,
            n.valueAsNumber, max1);

        var maxD = findD(G.valueAsNumber*1e9, d.valueAsNumber*1e-3,
            n.valueAsNumber, min1);

        var recommendedD = (minD+maxD)/2;
        var recommendedSpringRate = springRate(G.valueAsNumber*1e9,
            d.valueAsNumber*1e-3,
            n.valueAsNumber,
            recommendedD*1e-3);

        var minPlotSpringRate = 0;


        let line1 = {
            x : [10, minD],
            y : [max1, max1],
            name:"Min Spring Rate",
            type: "line",
            line: {color: "black",
                dash: "dash"
            }
        }
        let line2 = {
            x : [10, maxD],
            y : [min1, min1],
            name:"Max Spring Rate",
            type: "line",
            line: {color: "black",
                dash: "dash"
            }
        }

        let line3 = {
            x : [minD, minD],
            y : [minPlotSpringRate, max1],
            name:"Min Diameter",
            type: "line",
            line: {color: "#F95454",
                dash: "dash"
            }
        }

        let line4 = {
            x : [maxD, maxD],
            y : [minPlotSpringRate, min1],
            name:"Max Diameter",
            type: "line",
            line: {color: "#F95454",
                dash: "dash"
            }
        }

        let line5 = {
            x : [recommendedD, recommendedD],
            y : [minPlotSpringRate, recommendedSpringRate],
            name:"Recommended Diameter",
            type: "line",
            line: {color: "#1ac451",
                dash: "dash"
            }
        }

        let layout = {
            title: '',
            xaxis: {
            title: 'D[mm]',
            },
            yaxis: {
            title: 'Spring Rate [N/m]',
            }
            };

        Plotly.newPlot('spring-rate',
            [trace[0], line1, line2, line3, line4, line5], layout);

        let minDiameterDoc = document.getElementById("min-Diameter");
        let maxDiameterDoc = document.getElementById("max-Diameter");
        let recommendedDiameterDoc = document.getElementById("recommended-Diameter");


        minDiameterDoc.innerHTML = minD.toFixed(2);
        maxDiameterDoc.innerHTML = maxD.toFixed(2);
        recommendedDiameterDoc.innerHTML = recommendedD.toFixed(2);
    }
}
var G = document.getElementById("shear-modulus");
var d = document.getElementById("wire-diameter");
var n = document.getElementById("coils");

var min = document.getElementById("min");
var max = document.getElementById("max");

var spring1 = new spring(G=G, d=d, n=n, min=min, max=max);
spring1.plot();



document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        spring1.plot();
        }
});


const hideSchemasButton = document.getElementById('hide-schemas');
const schemasContainer = document.querySelector('.schemas-container');

hideSchemasButton.addEventListener('click', () => {
    schemasContainer.classList.toggle('hidden');

    if (schemasContainer.classList.contains('hidden')) {
        hideSchemasButton.textContent = 'Show Schemas';
    } else {
        hideSchemasButton.textContent = 'Hide Schemas';
    }
});

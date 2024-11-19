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
    constructor(G, d, n, length, min, max){
        this.G = G;
        this.d = d;
        this.n = n;
        this.min = min;
        this.max = max;
        this.length = length;
    }

    plot(){
        const springRateDoc = document.getElementById("spring-rate");
        const minDiameterDoc = document.getElementById("min-Diameter");
        const maxDiameterDoc = document.getElementById("max-Diameter");
        const recommendedDiameterDoc = document.getElementById("recommended-Diameter");
        const conclusionDoc = document.getElementById("conclusion");

        const errorMessage = document.getElementById("error-message");
        if(this.d.valueAsNumber*this.n.valueAsNumber > this.length.valueAsNumber){
            errorMessage.textContent = "Error: Number of coils times the wire diameter has to be shorter than Spring Length.";
            errorMessage.style.display = "block";  // Show error message
            springRateDoc.style.display = "none"; // Hide error if inputs are InCorrect
            conclusionDoc.style.display = "none"; // Hide error if inputs are InCorrect
           
        } else {
            errorMessage.style.display = "none";  // Hide error if inputs are correct
            springRateDoc.style.display = "block"; // Hide error if inputs are InCorrect
            conclusionDoc.style.display = "block"; // Hide error if inputs are InCorrect
        }

        function springRateD(D) {
            return springRate(G.valueAsNumber*1e9,
                 d.valueAsNumber*1e-3,
                 n.valueAsNumber,
                 D*1e-3);
        }

        var min1 = this.min.valueAsNumber;
        var max1 = this.max.valueAsNumber;

        var minD =  findD(G.valueAsNumber*1e9, d.valueAsNumber*1e-3,
            n.valueAsNumber, max1);

        var maxD = findD(G.valueAsNumber*1e9, d.valueAsNumber*1e-3,
            n.valueAsNumber, min1);
        
        let limits1 = [minD, 26];
        let trace = getTraces(limits1, ["#024CAA"], 0.1e-3, springRateD);

        var recommendedD = (minD+maxD)/2;
        var recommendedSpringRate = springRate(G.valueAsNumber*1e9,
            d.valueAsNumber*1e-3,
            n.valueAsNumber,
            recommendedD*1e-3);

        var minPlotSpringRate = 0;


        let line1 = {
            x : [minD, minD],
            y : [max1, max1],
            name:"Min Spring Rate",
            type: "line",
            line: {color: "black",
                dash: "dash"
            }
        }
        let line2 = {
            x : [minD, maxD],
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



        minDiameterDoc.innerHTML = minD.toFixed(2);
        maxDiameterDoc.innerHTML = maxD.toFixed(2);
        recommendedDiameterDoc.innerHTML = recommendedD.toFixed(2);
    }
}

var G = document.getElementById("shear-modulus");
var d = document.getElementById("wire-diameter");
var n = document.getElementById("coils");
var length = document.getElementById("length");

var min = document.getElementById("min");
var max = document.getElementById("max");

var spring1 = new spring(G, d, n, length, min, max);
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

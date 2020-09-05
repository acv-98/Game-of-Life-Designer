const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

const CSS_COLOR_NAMES = [
    "AliceBlue",
    "AntiqueWhite",
    "Aqua",
    "Aquamarine",
    "Azure",
    "Beige",
    "Bisque",
    "BlanchedAlmond",
    "Blue",
    "BlueViolet",
    "Brown",
    "BurlyWood",
    "CadetBlue",
    "Chartreuse",
    "Chocolate",
    "Coral",
    "CornflowerBlue",
    "Cornsilk",
    "Crimson",
    "Cyan",
    "DarkBlue",
    "DarkCyan",
    "DarkGoldenRod",
    "DarkGray",
    "DarkGreen",
    "DarkKhaki",
    "DarkMagenta",
    "DarkOliveGreen",
    "DarkOrange",
    "DarkOrchid",
    "DarkRed",
    "DarkSalmon",
    "DarkSeaGreen",
    "DarkSlateBlue",
    "DarkSlateGrey",
    "DarkTurquoise",
    "DarkViolet",
    "DeepPink",
    "DeepSkyBlue",
    "DimGrey",
    "DodgerBlue",
    "FireBrick",
    "FloralWhite",
    "ForestGreen",
    "Fuchsia",
    "Gainsboro",
    "GhostWhite",
    "Gold",
    "GoldenRod",
    "Gray",
    "Green",
    "GreenYellow",
    "HoneyDew",
    "HotPink",
    "IndianRed",
    "Indigo",
    "Ivory",
    "Khaki",
    "Lavender",
    "LavenderBlush",
    "LawnGreen",
    "LemonChiffon",
    "LightBlue",
    "LightCoral",
    "LightCyan",
    "LightGoldenRodYellow",
    "LightGray",
    "LightGreen",
    "LightPink",
    "LightSalmon",
    "LightSeaGreen",
    "LightSkyBlue",
    "LightSlateGray",
    "LightSteelBlue",
    "LightYellow",
    "Lime",
    "LimeGreen",
    "Linen",
    "Magenta",
    "Maroon",
    "MediumAquaMarine",
    "MediumBlue",
    "MediumOrchid",
    "MediumPurple",
    "MediumSeaGreen",
    "MediumSlateBlue",
    "MediumSpringGreen",
    "MediumTurquoise",
    "MediumVioletRed",
    "MidnightBlue",
    "MintCream",
    "MistyRose",
    "Moccasin",
    "NavajoWhite",
    "Navy",
    "OldLace",
    "Olive",
    "OliveDrab",
    "Orange",
    "OrangeRed",
    "Orchid",
    "PaleGoldenRod",
    "PaleGreen",
    "PaleTurquoise",
    "PaleVioletRed",
    "PapayaWhip",
    "PeachPuff",
    "Peru",
    "Pink",
    "Plum",
    "PowderBlue",
    "Purple",
    "RebeccaPurple",
    "Red",
    "RosyBrown",
    "RoyalBlue",
    "SaddleBrown",
    "Salmon",
    "SandyBrown",
    "SeaGreen",
    "SeaShell",
    "Sienna",
    "Silver",
    "SkyBlue",
    "SlateBlue",
    "SlateGrey",
    "Snow",
    "SpringGreen",
    "SteelBlue",
    "Tan",
    "Teal",
    "Thistle",
    "Tomato",
    "Turquoise",
    "Violet",
    "Wheat",
    "White",
    "WhiteSmoke",
    "Yellow",
    "YellowGreen",
  ];

let defaultColours = ["#54945C","#546156","#29472C","#009411","#80DF8B"];
let cellColours = defaultColours;
let tempColours = [];
const resolution = 10;

let cellArr = [];
let animationRunning = false;
let showingHelp = false;
let showingToolbar = true;
let choosingColours = false;
let keyboardEnabled = true;

let cols = Math.floor(canvas.width / resolution)+1;
let rows = Math.floor(canvas.height / resolution)+1;
let initialPopulationPercentage = 7;
let brushSize = 2;
let maxBrushSize = 10;
let minBrushSize = 1;
let fps = 5;
let maxFps = 60;
let minFps = 1;
let animationTimeout = null;
let initTimeout = null;
let mouse = {
    col: undefined,
    row: undefined,
    down: false,
    adding: true
}

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / resolution);
    rows = Math.floor(canvas.height / resolution);
    init();
});


window.addEventListener('mousemove', function(event){
    const rect = canvas.getBoundingClientRect();
    mouse.col = Math.floor(event.x/resolution - rect.left / resolution);
    mouse.row = Math.floor(event.y/resolution - rect.top / resolution);
    if(mouse.down){
        mouseEffect();
    }
});


window.addEventListener('click', function(event){
    mouseEffect();
})


window.addEventListener('mousedown', function(){
    mouse.down = true;
});


window.addEventListener('mouseup', function(){
    mouse.down = false;
});

window.addEventListener('keydown', function(event){
    const keyCode = event.code;
    if(keyboardEnabled){
        if(keyCode === "KeyP"){
            toggleAnimation();
        }
        if(keyCode === "KeyR"){
            init();
        }
        if(keyCode === "KeyC"){
            clearAll();
        }
        if(keyCode === "KeyS"){
            switchMouseEffect();
        }
        if(keyCode === "KeyB"){
            brushSizeIncrease(true); 
        }
        if(keyCode === "KeyV"){
            brushSizeIncrease(false); 
        }
        if(keyCode === "KeyH"){
            toggleHelp();
        }
        if(keyCode === "KeyT"){
            toggleToolbar();
        }
        if(keyCode === "KeyF"){
            fpsIncrease(true);
        }
        if(keyCode === "KeyD"){
            fpsIncrease(false);
        }
        if(keyCode === "Digit0"){
            keyboardEnabled = false;
        }
    } else if (keyCode === "Digit0"){
        keyboardEnabled = true;
    }
});


function Cell(x,y, populated){
    this.x = x;
    this.y = y;
    this.populated = populated;
    this.colour = cellColours[Math.floor(Math.random()*cellColours.length)];

    this.update = function() {
        ctx.clearRect(this.x-5, this.y-5, resolution, resolution);
        if(this.populated){
            ctx.beginPath();
            ctx.arc(this.x, this.y, resolution/2, 0, Math.PI * 2, false);
            ctx.fillStyle = this.colour;
            ctx.fill();
        }
    }
}


function init() {
    clearTimeout(initTimeout);
    initTimeout = setTimeout(function() {
        cellArr = [];
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for (let i = 0; i < cols; i++){
            let column = [];
            for (let j = 0; j < rows; j++){
                column.push(new Cell(resolution*i,resolution*j,false));
            }
            cellArr.push(column);
        }
        populateRandomly();
    }, 100);
}


function populateRandomly() {
    let population = Math.floor(cols * rows * initialPopulationPercentage / 100);
    for (let i = 0; i < population; i++){
        let col = Math.floor(Math.random() * (cols-1));
        let row = Math.floor(Math.random() * (rows-1));
        cellArr[col][row].populated = true;
        cellArr[col][row].update();
    }
}


function mouseEffect(){
    if(mouse.col > 0 && mouse.row > 0){
        let neighbourCoord = getNeighbours(brushSize, mouse.col, mouse.row, true).neighbourCoord;
        for (let i = 0; i < neighbourCoord.length; i++){
            let neighbour_x = neighbourCoord[i][0];
            let neighbour_y = neighbourCoord[i][1];
            if(mouse.adding){
                cellArr[neighbour_x][neighbour_y].populated = true;
            }else {
                cellArr[neighbour_x][neighbour_y].populated = false;
            }
            cellArr[neighbour_x][neighbour_y].update();
        }
    }
}


function getNeighbours(size, col, row, inclusive) {
    let neighbours = {
        neighbourCount : 0,
        neighbourCoord : []
    };
    for (let i = -1; i < size; i++) {
        for (let j = -1; j < size; j++) {
            const x_cell = col + i;
            const y_cell = row + j;
            if (i === 0 && j === 0 && !inclusive) {
                continue;
            }
            let coordinates = [];
            if(x_cell >= 0 && y_cell >= 0 && 
                x_cell < cols && y_cell < rows) {
                if (cellArr[x_cell][y_cell].populated){
                    neighbours.neighbourCount += 1;
                }
                coordinates.push(x_cell);
                coordinates.push(y_cell);
                neighbours.neighbourCoord.push(coordinates);
            }
        }
    }
    return neighbours;
}


function update() {
    for (let col = 0; col < cols; col++){
        for (let row = 0; row < rows; row++){
            let cell = cellArr[col][row];
            let neighbourCount = getNeighbours(2, col, row, false).neighbourCount;
            if (cell.populated && neighbourCount < 2) {
                cell.populated = 0;
                cellArr[col][row].populated = 0;
                cellArr[col][row].update();
            }
            else if (cell.populated && neighbourCount > 3) {
                cell.populated = 0;
                cellArr[col][row].populated = 0;
                cellArr[col][row].update();
            } 
            else if (!cell.populated && neighbourCount === 3) { 
                    cell.populated = 1;
                    cellArr[col][row].populated = 1;
                    cellArr[col][row].update();
            }
            cell.update();
        }
    }
}


function animate() {
    if(animationRunning){
        animationTimeout = setTimeout(function() {
            requestAnimationFrame(animate);
            update();
        }, 1000 / fps);
    }
}


function startAnimation(){
    if (!animationRunning){
        animationRunning = true;
        animate();
        document.getElementById("start_btn").style.display = "none";
        document.getElementById("pause_btn").style.display = "inline";
    }

}


function pauseAnimation(){
    clearTimeout(animationTimeout);
    animationRunning = false;
    document.getElementById("start_btn").style.display = "inline";
    document.getElementById("pause_btn").style.display = "none";
}


function clearAll(){
    pauseAnimation();
    for (let col = 0; col < cols; col++){
        for (let row = 0; row < rows; row++){
            cellArr[col][row].populated = false;
            cellArr[col][row].update();
        }
    }
}


function switchMouseEffect(){
    mouse.adding = !mouse.adding;
    const switchText = document.getElementById("mouse-effect-text");
    if (mouse.adding){
        switchText.innerText = "Adding";
        addClass(false, "switch_mfunc_btn", "btn-info");
        addClass(true, "switch_mfunc_btn", "btn-dark");
    } else {
        switchText.innerText = "Removing";
        addClass(true, "switch_mfunc_btn", "btn-info");
        addClass(false, "switch_mfunc_btn", "btn-dark");
    }
}


function brushSizeIncrease(increasing){
    const brushSizeText = document.getElementById("brush-size-text");
    brushSize = plusMinusButtons(increasing, brushSize, "brush-increaser", "brush-decreaser", minBrushSize, maxBrushSize, 1);
    brushSizeText.innerText = brushSize;
}


function fpsIncrease(increasing){
    const fpsText = document.getElementById("fps-text");
    fps = plusMinusButtons(increasing, fps, "fps-increaser", "fps-decreaser", minFps, maxFps, 2);
    fpsText.innerText = fps;
}


function plusMinusButtons(increasing, variable, increaser_id, decreaser_id, min, max, step_size){
    if(increasing){
        console.log("increasing");
        // if variable used to be min value, enable decreaser button after increase
        if(variable === min){
            addClass(false, decreaser_id, "disabled");
        }
        // if variable becomes bigger than max with step size, make it equal to max
        if((variable + step_size) < max){
            variable += step_size;
        } else {
            variable = max;
        }
        // if variable is max, disable increaser button
        if(variable === max){
            addClass(true, increaser_id, "disabled");
        }
    } else {
        // if variable used to be max value, enable increaser button after decrease
        if (variable === max){
            addClass(false, increaser_id, "disabled");
        }
        // if variable becomes smaller than min with step size, make it equal to min
        if(variable - step_size > min){
            variable -= step_size;
        } else {
            variable = min;
        }
        // if variable is min, disable decreaser button
        if (variable === min){
            addClass(true, decreaser_id, "disabled");
        }
    }
    return variable;
} 

function toggleHelp(){
    const help_btn = document.getElementById("help_btn");
    if(showingHelp){
        addClass(true, "game-help", "hidden-element");
        addClass(false, "help_btn", "btn-danger");
        showingHelp = false;
        help_btn.innerText = "Help"
    } else {
        addClass(false, "game-help", "hidden-element");
        addClass(true, "help_btn", "btn-danger");
        showingHelp = true;
        help_btn.innerText = "Hide Help";
    }
}

function toggleToolbar(){
    if(showingToolbar){
        addClass(true, "toolbar", "hidden-element");
        showingToolbar = false;
    } else {
        addClass(false, "toolbar", "hidden-element");
        showingToolbar = true;
    }
}

function toggleAnimation(){
    if (animationRunning){
        pauseAnimation();
    } else {
        startAnimation();
    }
}

function toggleColourMenu(){
    const colour_btn = document.getElementById("colour_btn");
    if (choosingColours){
        addClass(true, "colour-menu", "hidden-element");
        addClass(false, "colour_btn", "btn-danger");
        colour_btn.innerText = "Colour Menu";
        choosingColours = false;
    } else{
        addClass(false, "colour-menu", "hidden-element");
        addClass(true, "colour_btn", "btn-danger");
        colour_btn.innerText = "Hide Colour Menu";
        choosingColours = true;
    }
}

function chooseColour(){
    arrayToDropdown(CSS_COLOR_NAMES, "dropdown-options", true);
}

function addColour(colour){
    tempColours.push(colour);
    showSelectedColour(colour, "selected-colours");
    if(tempColours.length === 1){
        addClass(false, "selected-colours", "hidden-element");
    }
    addClass(false, "apply-colours-btn", "hidden-element");
}

function showSelectedColour(colour, containerId){
    const colourDiv = document.createElement("div");
    colourDiv.innerHTML = colour;
    colourDiv.style.backgroundColor = colour;
    colourDiv.style.color = "black";
    colourDiv.classList.add("temp-colour-display");
    colourDiv.onclick = () => {
        container.removeChild(colourDiv);
        tempColours.splice(tempColours.indexOf(colour),1);
        if (tempColours.length === 0){
            addClass(true, "apply-colours-btn", "hidden-element");
            addClass(true, "selected-colours", "hidden-element");
        } else{
            addClass(false, "apply-colours-btn", "hidden-element");
        }
    }
    const container = document.getElementById(containerId);
    container.appendChild(colourDiv);
}

function applyColours(){
    cellColours = tempColours;
    addClass(true, "apply-colours-btn", "hidden-element");
    addClass(false, "default_colours_btn", "hidden-element");
    init();
}

function applyDefaultColours(){
    cellColours = defaultColours;
    tempColours = [];
    $(".temp-colour-display").remove();
    addClass(true, "default_colours_btn", "hidden-element");
    addClass(true, "apply-colours-btn", "hidden-element");
    addClass(true, "selected-colours", "hidden-element");
    init();
}


function arrayToDropdown(array, dropdownId, isColour){
    const dropdown = document.getElementById(dropdownId);
    if(dropdown.innerHTML === ""){
        let optionRow = document.createElement("div");
        optionRow.classList = "col-sm-auto";
        for(let i=0; i<array.length; i++){
            const optionText = array[i];
            const btn = document.createElement("BUTTON");
            btn.classList.add("dropdown-item");
            if(isColour){
                btn.setAttribute('style', 'background-color:' + optionText + ' !important');
                btn.onclick = () => addColour(optionText);
            }
            btn.innerHTML = optionText;
            if (array.length > 10){
                if(i % 10 === 0){
                    optionRow = document.createElement("div");
                    optionRow.classList = "col-sm-auto";
                }
                optionRow.appendChild(btn);
                dropdown.appendChild(optionRow);
    
            } else {
                dropdown.appendChild(btn);
            }
        }
    }
}


function addClass(adding, elementId, className){
    let element = document.getElementById(elementId);
    if (adding){
        element.classList.add(className);
    } else{
        element.classList.remove(className);
    }
}


init();
startAnimation();

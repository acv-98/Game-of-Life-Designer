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
let showingHelp = true;
let showingToolbar = true;
let choosingColours = false;
let keyboardEnabled = true;

let cols = Math.floor(canvas.width / resolution)+1;
let rows = Math.floor(canvas.height / resolution)+1;
let initialPopulationPercentage = 7;
let brushSize = Number(document.getElementsByClassName("brush-size-text")[0].innerText);
let maxBrushSize = 10;
let minBrushSize = 1;
let fps = Number(document.getElementsByClassName("fps-text")[0].innerText);
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
            $(".shortcuts-text").text("disabled");
            $(".shortcuts-text").css('color', 'red');
        }
    } else if (keyCode === "Digit0"){
        keyboardEnabled = true;
        $(".shortcuts-text").text("enabled");
        $(".shortcuts-text").css('color', 'lightgreen');
    }
});


function Cell(x,y, populated){
    this.x = x;
    this.y = y;
    this.populated = populated;
    this.colour = cellColours[Math.floor(Math.random()*cellColours.length)];

    this.update = function() {
        ctx.clearRect(this.x - resolution/2, this.y - resolution/2, resolution, resolution);
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
        const start_pause_btn = $(".start-pause-btn");
        toggleElementClass(start_pause_btn,"btn-success","btn-warning");
        start_pause_btn.text("Pause");
        animationRunning = true;
        animate();
    }
}


function pauseAnimation(){
    if(animationRunning){
        const start_pause_btn = $(".start-pause-btn");
        toggleElementClass(start_pause_btn,"btn-success","btn-warning");
        start_pause_btn.text("Start");
        clearTimeout(animationTimeout);
        animationRunning = false;
    }
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
    const switch_btn = $(".switch-mfunc-btn");
    if (mouse.adding){
        switchText.innerText = "Adding";
        toggleElementClass(switch_btn, "btn-dark", "btn-info");
    } else {
        switchText.innerText = "Removing";
        toggleElementClass(switch_btn, "btn-dark", "btn-info");
    }
}


function brushSizeIncrease(increasing){
    brushSize = plusMinusButtons(increasing, brushSize, "brush-increaser", "brush-decreaser", minBrushSize, maxBrushSize, 1);
    $(".brush-size-text").text(brushSize);
}


function fpsIncrease(increasing){
    fps = plusMinusButtons(increasing, fps, "fps-increaser", "fps-decreaser", minFps, maxFps, 2);
    $(".fps-text").text(fps);
}


function plusMinusButtons(increasing, variable, increaser_class, decreaser_class, min, max, step_size){
    const increaser_btn = $('.' + increaser_class);
    const decreaser_btn = $('.' + decreaser_class);
    if(increasing){
        // if variable used to be min value, enable decreaser button after increase
        if(variable === min){
            decreaser_btn.removeClass("disabled");
        }
        // if variable becomes bigger than max with step size, make it equal to max
        if((variable + step_size) < max){
            variable += step_size;
        } else {
            variable = max;
        }
        // if variable is max, disable increaser button
        if(variable === max){
            increaser_btn.addClass("disabled");
        }
    } else {
        // if variable used to be max value, enable increaser button after decrease
        if (variable === max){
            increaser_btn.removeClass("disabled");
        }
        // if variable becomes smaller than min with step size, make it equal to min
        if(variable - step_size > min){
            variable -= step_size;
        } else {
            variable = min;
        }
        // if variable is min, disable decreaser button
        if (variable === min){
            decreaser_btn.addClass("disabled");
        }
    }
    return variable;
} 

function toggleHelp(){
    const help_btn = $(".help-btn");
    const help_menu = $("#game-help");
    if(showingHelp){
        help_menu.hide();
        toggleElementClass(help_btn, "btn-info", "btn-danger");
        help_btn.text("Help");
        showingHelp = false;
    } else {
        help_menu.show();
        toggleElementClass(help_btn, "btn-info", "btn-danger");
        help_btn.text("Hide Help");
        help_btn.innerText = "Hide Help";
        showingHelp = true;
    }
}

function toggleToolbar(){
    const toolbar = $("#toolbar");
    if(showingToolbar){
        toolbar.hide();
        showingToolbar = false;
    } else {
        toolbar.show();
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
    const colour_btn = $(".colour-btn");
    const colour_menu = $("#colour-menu");
    if (choosingColours){
         colour_menu.hide();
         toggleElementClass(colour_btn, "btn-info", "btn-danger");
         colour_btn.text("Colour Menu");
        choosingColours = false;
    } else{
        colour_menu.show();
        toggleElementClass(colour_btn, "btn-info", "btn-danger");
        colour_btn.text("Hide Colour Menu");
        choosingColours = true;
    }
}

function toggleElementClass(element, class1, class2){
    if (element.hasClass(class1)){
        element.removeClass(class1);
        element.addClass(class2);
    } else{
        element.removeClass(class2);
        element.addClass(class1);
    }
}

function chooseColour(){
    arrayToDropdown(CSS_COLOR_NAMES, "dropdown-options", true);
}

function addColour(colour){
    tempColours.push(colour);
    showSelectedColour(colour, "selected-colours");
    if(tempColours.length === 1){
        $("#selected-colours").show();
    }
    $("#apply-colours-btn").show();
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
            $("#apply-colours-btn").hide();
            $("#selected-colours").hide();
        } else{
            $("#apply-colours-btn").show();
        }
    }
    const container = document.getElementById(containerId);
    container.appendChild(colourDiv);
}

function applyColours(){
    cellColours = tempColours;
    $("#apply-colours-btn").hide();
    $("#default-colours-btn").show();
    init();
}

function applyDefaultColours(){
    cellColours = defaultColours;
    tempColours = [];
    $(".temp-colour-display").remove();
    $("#default-colours-btn").hide();
    $("#apply-colours-btn").hide();
    $("#selected-colours").hide();
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


init();
startAnimation();

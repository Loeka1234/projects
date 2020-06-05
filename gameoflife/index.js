class Field {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this.alive = false;
        
        const element = document.createElement("div");
        element.setAttribute("x", this._x);
        element.setAttribute("y", this._y);    
        this.html = element;
    }
}

const rows = 30;
const columns = 30;
const container = document.querySelector(".container");

const root = document.documentElement;
root.style.setProperty("--column-count", columns);
root.style.setProperty("--row-count", rows);


const fields = [];
for (let x = 0; x < rows; x++) {
    const row = document.createElement("div");
    row.classList.add("row")
    container.append(row);

    let arr = [];
    for (let y = 0; y < columns; y++) {
        const field = new Field(x, y);
        field.html.addEventListener("click", e => handleClick(e.target.getAttribute("x"), e.target.getAttribute("y")))
        row.append(field.html);
        arr.push(field);
    }
    fields.push(arr);
}

function handleClick(x, y) {
    fields[x][y].alive = !fields[x][y].alive;
    fields[x][y].html.style.backgroundColor = fields[x][y].alive ? "black" : "lightgrey";
}

function step() {
    fields.forEach(row => {
        row.forEach(field => {
            const neighbours = [
                { x: -1, y: -1 },
                { x: 0, y: -1 },
                { x: 1, y: -1 },
                { x: -1, y: 0 },
                { x: 1, y: 0 },
                { x: -1, y: 1 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
            ];
            let amountAlive = 0;
            neighbours.forEach(neighbour => {
                if(fields[field._x + neighbour.x] 
                    && fields[field._x + neighbour.x][field._y + neighbour.y]
                    && fields[field._x + neighbour.x][field._y + neighbour.y].alive)
                    {
                        amountAlive++;
                    }
            })
            field.suroundingAlive = amountAlive;
        })
    })
    fields.forEach(row => {
        row.forEach(field => {
            if(field.alive && (field.suroundingAlive == 2 || field.suroundingAlive == 3)) field.alive = field.alive;
            else if(field.alive && (field.suroundingAlive >= 4 || field.suroundingAlive < 2)) field.alive = false;
            else if(!field.alive && field.suroundingAlive == 3) field.alive = true;
            field.html.style.backgroundColor = field.alive ? "black" : "lightgrey";
        })
    })
}


let looping = false;
var x;
function loop(e) {
    if(!looping) {
        e.target.innerText = "Stop"
        x = setInterval(step, 100);
    }
    else {
        e.target.innerText = "Loop steps";
        clearInterval(x);
    } 
    looping = !looping;
}

document.querySelector(".loop").addEventListener("click", e => loop(e));
document.querySelector(".step").addEventListener("click", step);
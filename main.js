console.log('aaa');

// n = rows, m = columns
let n = null;
let m = null;
let ok = false;

while(!ok) {
    n = parseInt(prompt("Enter number of rows: "))
    m = parseInt(prompt("Enter number of rows: "))
    
    if(Number.isInteger(n) && Number.isInteger(m) && Math.pow(m, n+1) <= 4e8) ok = true;
    if(Math.pow(m, n+1) > 4e8)  {
        alert("Board size too big :( cols^(rows+1) shouldn't be more than ~4*10^8")
    }
}



let init = Array(m).fill(n);

console.log(init);

// bool -> winning state (dynamic programming)
let dp = {};

// probability of picking a losing state
let prob = {};

// bottom left is bad
let base = Array(m).fill(0);
base[0] = 1;

dp[base] = false;
prob[base] = 0;

let traversed = 0;
dfs = (state) => {
    traversed++;
    console.assert(traversed < Math.pow(m, n+1));
    if(dp.hasOwnProperty(state)) return dp[state];

    let res = false;

    let tot = 0, win = 0;
    for(let i = 0; i < m; i++) {
        for(let j = 0; j < state[i]; j++) {
            let to = []
            for(let k = 0; k < i; k++) {
                to.push(state[k]);
            }
            for(let k = i; k < m; k++) {
                to.push(Math.min(state[k], j));
            }

            let sum = 0;
            for(let k = 0; k < m; k++) {
                sum += to[k];
            }

            if(sum === 0) continue

            if(!dp.hasOwnProperty(to)) {
                dfs(to.slice());
            }
            
            tot++;
            // if can go to losing
            if(dp[to] === false) {
                win++;
                res = true;
            }
        }
    }

    prob[state] = win/tot;
    dp[state] = res;
}

dfs(init);
console.log("done precomputing all states")

// current state
let cur = init;
const sqsz = 100;

let width = sqsz*m;
let height = sqsz*n;

setup = () => {
    let cnv = createCanvas(width, height);
    cnv.parent('sketch-holder');
}

draw = () => {
    // clear();
    background(220);    


    let r = Math.floor(mouseY/sqsz);
    let c = Math.floor(mouseX / sqsz);

    // console.log([r, c]);
    
    fill(188, 143, 143);
    for(let i = 0, j = 0; j < m; i += sqsz, j++) {
        rect(i, 0, sqsz, cur[j]*sqsz);
    }

    fill('red');
    for(let i = 0, j = 0; j < m; i += sqsz, j++) {
        if(j >= c) {
            // console.log("draw at ")
            // console.log([i, sqsz*(c-1), sqsz, (n-c+1)*sqsz]);
            rect(i, sqsz*(r), sqsz, (min(n)-r+1)*sqsz);
        }
    }
    fill(188, 143, 143);
    

    stroke(0);
    strokeWeight(1);
    for(let i = sqsz; i < width; i += sqsz) {
        line(i, 0, i, height);
    }

    for(let i = sqsz; i < height; i += sqsz) {
        line(0, i, width, i);
    }
}

mouseClicked = () => {
    // console.log(mouseX);
    // console.log(mouseY);

    let r = Math.floor(mouseY/sqsz);
    let c = Math.floor(mouseX / sqsz);

    if(r == c && r == 0) {
        alert("You lose! Press f5 or reload the page to try again.");
    }

    // console.log([r, c]);

    let sum = 0;
    for(let i = c; i < m; i++) {
        // console.log(i)
        // console.log("set " + i + " to " + r-1);
        // console.log("set to: ")
        // console.log(r)
        cur[i] = Math.min(cur[i], r);
        sum += cur[i];
    }

    let winningState = Array(m).fill(0);
    winningState[0] = 1;
    console.log(cur)
    console.log(winningState)
    if(JSON.stringify(cur) == JSON.stringify(winningState)) {
        alert("You win! Press f5 or reload the page to try again.");
    }
    

    // console.log(cur);

    // if(sum != 0) {

    // }
    // find best state
    let ma = 0;
    best = [];
    let canwin = false;
    for(let i = 0; i < m; i++) {
        for(let j = 0; j < cur[i]; j++) {
            let to = []
            for(let k = 0; k < i; k++) {
                to.push(cur[k]);
            }
            for(let k = i; k < m; k++) {
                to.push(Math.min(cur[k], j));
            }

            let sum = 0;
            for(let k = 0; k < to.length; k++) {
                sum += to[k];
            } 

            if(sum == 0) continue;

            if(!dp[to]) {
                best = to;
                canwin = true;
                break;
            }

            if(prob[to] > ma) {
                ma = prob[to];
                best = to;
            }
        }
        if(canwin) break;
    }

    cur = best;
    draw();
}
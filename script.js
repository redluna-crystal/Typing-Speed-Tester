const watch = document.querySelector(".time");
const start = document.querySelector(".startbtn");
const score = document.querySelector(".score");
const timetaken = document.querySelector(".time-taken");
const speed = document.querySelector(".speed");
const history = document.querySelector(".history");
const remarks = document.querySelector(".remarks");
const headSc = document.getElementById("headSc");
const headHis = document.getElementById("headHis");
const tp = document.querySelector(".testpan");
const text = "Lorem ipsum dolor sit amet consectetur adipisicing elit.";

let speedArr = [];
let modeMap = new Map();
let timecnt, strSec, strMilisec, secon, add;
//colors
let red = false, orange = false, green = false;

let spArrlen, curRemarks, toltime, curspeed, meanspeed, medianspeed, modespeed, avgspeed, markscored;
//demo values
curRemarks = "Almost Perfect !!", toltime = "30s", curspeed = "26wpm", meanspeed = "28wpm", medianspeed = "28wpm", modespeed = "no mode of your speeds", avgspeed = "28wpm";

let end = false;
let millisecound = 0;
let timer;

function bubblesort(arr, n) {
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let key = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = key;
      }
    }
  }
}
function getMarks(inp) {
  inp.trim();
  let cnt = 0;
  for (let i = 0; i < inp.length; i++) {
    if (text[i] == inp[i]) cnt++;
  }
  return cnt++;
}


function timeStart() {
  watch.style.color = "#0f62fe";
  clearInterval(timer);
  timer = setInterval(() => {
    millisecound += 10;
    let dateTimer = new Date(millisecound);

    watch.innerHTML =
      ('0' + dateTimer.getUTCSeconds()).slice(-2) + ':' +
      ('0' + dateTimer.getUTCMilliseconds()).slice(-3, -1);

    toltime =
      ('0' + dateTimer.getUTCSeconds()).slice(-2) + 's ' +
      ('0' + dateTimer.getUTCMilliseconds()).slice(-3, -1) + 'ms';
  }, 10);
}

function timePaused() {
  watch.style.color = "red";
  clearInterval(timer);
}

function timeReset() {
  setInterval(timer)
  millisecound = 0;
  watch.innerHTML = "00:00";
}

function giveRemarks(s) {
  if (s == 0) {
    red = true;
    return "Very Poor !!!";
  }
  else if (s > 0 && s < 25) {
    red = true;
    return "Poor!!!";
  }
  else if (s >= 25 && s < 50) {
    orange = "true";
    return "Fine!!!";
  }
  else if (s >= 50 && s < 100) {
    green = true;
    return "Good!!!";
  }
  else {
    green = true;
    return "Almost Perfect!!!"
  }
}

function findMean(n, arr) {
  let sum = 0;
  for (let j = 0; j < n; j++) {
    sum += arr[j];
  }
  return sum / n;
}

function findMedian(n, arr) {
  bubblesort(arr, length);
  let idx1, idx2;
  if (n % 2) {
    // n is odd
    idx1 = (n + 1) / 2;
    return arr[idx1];
  }
  else {
    // n is even
    idx1 = n / 2;
    idx2 = (n / 2) + 1;
    return (arr[idx1] + arr[idx2]) / 2;
  }
}

start.addEventListener("click", function () {
  if (!end) {
    timeStart();
    document.getElementById("testpan").style.backgroundColor = "rgb(142, 225, 240)";
    start.style.backgroundColor = "rgb(61, 61, 228)";
    start.style.border = "none";
    start.innerHTML = "End Test";

    end = true;
  }
  else {
    timePaused();
    timeReset();
    //time taken
    strSec = toltime[0] + toltime[1];
    strMilisec = toltime[4] + toltime[5];
    timecnt = parseInt(strSec);
    secon = parseInt(strMilisec);
    if (secon > 50) add = 1
    else add = 0
    timecnt = timecnt + add;
    //speed
    markscored = getMarks(tp.value);

    curspeed = Math.trunc((60 / timecnt) * markscored);
    spArrlen = speedArr.push(curspeed);

    if (modeMap.has(curspeed)) {
      let freq = modeMap.get(curspeed);
      freq++;
      modeMap.set(curspeed, freq);
    }
    else {
      modeMap.set(curspeed, 1);
    }
    //find mode 
    if (modeMap.size == 0) modespeed = 0;
    else if (modeMap.size == 1) {
      const [firstKey] = modeMap.keys();
      modespeed = firstKey;
    }
    else {

      const iterator = modeMap.entries();
      let mpsize = modeMap.size;
      let maxi = 0;
      while (mpsize) {
        let cur = iterator.next().value;
        if (cur[1] > maxi) {
          modespeed = cur[0];
          maxi = cur[1];
        }
        mpsize--;
      }
    }

    //remarks
    curRemarks = giveRemarks(curspeed);


    timer.innerHTML = "00:00";
    document.getElementById("testpan").style.backgroundColor = "white";
    start.style.backgroundColor = "rgba(19, 214, 248, 0.959)";
    start.style.borderColor = " rgb(5, 5, 156)";
    start.style.borderStyle = "dashed";
    start.innerHTML = "Start Test";
    end = false;

    //score display
    headHis.innerHTML = "Past Speed History"
    headSc.innerHTML = "Score";
    remarks.innerHTML =
      `${curRemarks}`;

    //color conditions
    if (red) remarks.style.color = "red"
    else {
      (green) ? remarks.style.color = "green" : remarks.style.color = orange;
    }


    timetaken.innerHTML =
      `Time taken :- ${toltime}`;

    speed.innerHTML =
      `Current Speed :- ${curspeed}wpm`;

    meanspeed = findMean(spArrlen, speedArr);
    medianspeed = findMedian(spArrlen, speedArr);

    avgspeed = (meanspeed + modespeed + medianspeed) / 3;

    history.innerHTML = `
       Mean of speeds = ${meanspeed}wpm
       <p> Median of speeds = ${medianspeed}wpm
       <p> Mode of speeds = ${modespeed}wpm

       <p> Total Avg. speed = ${avgspeed}wpm
      `;

  }
});

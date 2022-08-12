const timer = document.querySelector('.working-stopwatch');

let sec = 0;
let min = 0;
let hr = 0;
let stoptime = true;

function startTimer() {
  if (stoptime == true) {
        stoptime = false;
        timerCycle();
    }
}
function stopTimer() {
  if (stoptime == false) {
    stoptime = true;
    sec = 0;
    min = 0;
    hr = 0;
  }
}

function timerCycle() {
    if (stoptime == false) {
    sec = parseInt(sec);
    min = parseInt(min);
    hr = parseInt(hr);

    sec = sec + 1;

    if (sec == 60) {
      min = min + 1;
      sec = 0;
    }
    if (min == 60) {
      hr = hr + 1;
      min = 0;
      sec = 0;
    }

    if (sec < 10 || sec == 0) {
      sec = '0' + sec;
    }
    if (min < 10 || min == 0) {
      min = '0' + min;
    }
    if (hr < 10 || hr == 0) {
      hr = '0' + hr;
    }

    timer.innerHTML = hr + ':' + min + ':' + sec;
    setTimeout("timerCycle()", 1000);
  }
};

const displayDate = () => {
    const date = dayjs().format('YYYY-MMM-DD')
    document.querySelector(".current-date").innerHTML = "<strong>Today's Date: </strong>" + date;
}

const checkTime = (i) => {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

const displayTime = () => {
    const time = dayjs().format('HH:mm:ss')
    document.querySelector(".current-time").innerHTML = "<strong>Current Time: </strong>" + time;
}

const displayButtonsAndStopwatch = () => {
    const stopWatchEl = document.querySelector(".working-stopwatch");
    document.querySelector(".clockin-button").style.display = "block";
    document.querySelector(".clockout-button").style.display = "block";
    stopWatchEl.innerHTML = `00:00:00`

        // const startTime = dayjs(data.time_stamp).format('HH:mm:ss');
        // let seconds = startTime.diff(dayjs().format("HH:mm:ss"), "second");
        // const hours = Math.floor(seconds / (60 * 60));
        // seconds = seconds - (hours * 60 * 60);
        // const minutes = Math.floor(seconds / 60);
        // seconds = seconds - (minutes * 60);
        // stopWatchEl.innerHTML = `<span id="hours">${hours}</span>:<span id="minutes">${minutes}</span>:<span id="seconds">${seconds}</span>`
} 

async function displayPage() {
    displayDate();
    displayTime();
    const id = document.querySelector('.clockin-container').getAttribute('id');
    const date = new Date().toISOString().slice(0, 10);
    const apiUrl = ``;
    const response = await fetch(apiUrl)
    if (response.ok) {
        const data = await response.json();
        displayButtonsAndStopwatch(data);
    } else {
        const res = await response.json();
        document.querySelector('#alert-message').textContent = res.message;
        document.querySelector('#pop-up').style.display = 'block'
    }
};

async function recordClockInTime () {
    const response = await fetch('/api/time_registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    const res = await response.json()
    if (response.ok) {
        document.querySelector(".message").innerHTML = `You have clocked in. Have a great day!`
    } else {
        document.querySelector('#alert-message').textContent = res.message;
        document.querySelector('#pop-up').style.display = 'block';
    }
};

async function recordClockOutTime () {
    const response = await fetch('/api/time_registry', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    });

    const res = await response.json()
    if (response.ok) {
        document.querySelector(".message").innerHTML = `You have clocked out. See you.`
    } else {
        document.querySelector('#alert-message').textContent = res.message;
        document.querySelector('#pop-up').style.display = 'block';
    }
};

document.querySelector(".clockin-button").onclick = function () {
    startTimer();
    recordClockInTime();
};

document.querySelector(".clockout-button").onclick = function () {
    stopTimer();
    recordClockOutTime()
};

// displayPage();
displayDate();
displayTime();
displayButtonsAndStopwatch();
setInterval(displayTime, 1000);
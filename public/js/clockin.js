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

const displayButtonsAndStopwatch = (data) => {
    const stopWatchEl = document.querySelector(".working-stopwatch");
    console.log(data);
    if (!data) {
        document.querySelector(".clockin-button").style.display = "block";
        stopWatchEl.innerHTML = `00:00:00`;
    } else if (data.time_out) {
        document.querySelector(".clockin-button").style.display = "none";
        document.querySelector(".clockout-button").style.display = "none";
        document.querySelector(".message").innerHTML = `You have finished your shift today. See you!`;
    } else {
        document.querySelector(".clockout-button").style.display = "block";
        sec = dayjs().diff(dayjs(data.time_in), "second");
        console.log(sec)
        hr = Math.floor(sec / (60 * 60));
        sec = sec - (hr * 60 * 60);
        min = Math.floor(sec / 60);
        sec = sec - (min * 60);
        stopWatchEl.innerHTML = `${hr}:${min}:${sec}`;
        document.querySelector(".message").innerHTML = `You have clocked in. Have a great day!`;
        startTimer();
    }
} 

async function displayPage() {
    displayDate();
    displayTime();
    setInterval(displayTime, 1000);
    const id = document.querySelector('.clockin-container').getAttribute('id');
    const response = await fetch('/api/timesheet/check')
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
    const response = await fetch('/api/timesheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        const res = await response.json();
        document.querySelector(".message").innerHTML = `You have clocked in. Have a great day!`
    } else {
        document.querySelector('#alert-message').textContent = res.message;
        document.querySelector('#pop-up').style.display = 'block';
    }
};

async function recordClockOutTime () {
    const response = await fetch('/api/timesheet/clockout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    });

    const res = await response.json()
    if (response.ok) {
        document.querySelector(".message").innerHTML = "You have clocked out. See you."
        document.querySelector(".clockin-button").style.display = "none";
        document.querySelector(".clockout-button").style.display = "none";
    } else {
        document.querySelector('#alert-message').textContent = res.message;
        document.querySelector('#pop-up').style.display = 'block';
    }
};

document.querySelector(".clockin-button").onclick = function () {
    document.querySelector(".clockout-button").style.display = "block";
    document.querySelector(".clockin-button").style.display = "none";
    startTimer();
    recordClockInTime();
};

document.querySelector(".clockout-button").onclick = function () {
    stopTimer();
    recordClockOutTime()
};

displayPage();


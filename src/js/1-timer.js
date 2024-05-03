import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const btnStart = document.querySelector(`[data-start]`);
const inputId = document.querySelector('#datetime-picker');
const dataDays = document.querySelector(`[data-days]`);
const dataHours = document.querySelector(`[data-hours]`);
const dataMinutes = document.querySelector(`[data-minutes]`);
const dataSeconds = document.querySelector(`[data-seconds]`);
let userSelectedDate;
let timerInterval;

btnStart.disabled = true;

const initializeDateTimePicker = () => {
  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      if (selectedDate < new Date()) {
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
        });
      } else {
        userSelectedDate = selectedDate;
        localStorage.setItem(
          'userSelectedDate',
          userSelectedDate.toISOString()
        );
      }
      btnStart.disabled = selectedDate < new Date();
    },
  };

  flatpickr(inputId, options);

  const savedDate = localStorage.getItem('userSelectedDate');
  if (savedDate) {
    userSelectedDate = new Date(savedDate);
    inputId._flatpickr.setDate(userSelectedDate);
  }
};

initializeDateTimePicker();

const dateIsOk = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        userSelectedDate &&
        userSelectedDate.getTime() > new Date().getTime()
      ) {
        resolve();
      } else {
        reject();
      }
    }, 0);
  });
};

btnStart.addEventListener('click', () => {
  dateIsOk()
    .then(() => {
      btnStart.disabled = true;
      inputId.disabled = true;
      localStorage.setItem('timerRunning', true);

      timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const deltaTime = userSelectedDate - currentTime;
        if (deltaTime <= 0) {
          clearInterval(timerInterval);
          updateClockface({ days: '00', hours: '00', mins: '00', secs: '00' });
        } else {
          const time = getTimeComponents(deltaTime);
          updateClockface(time);
        }
      }, 1000);
    })
    .catch(() => {
      btnStart.disabled = true;
    });
});

const timerRunning = localStorage.getItem('timerRunning');
if (timerRunning) {
  btnStart.disabled = true;
  inputId.disabled = true;
  timerInterval = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = userSelectedDate - currentTime;
    if (deltaTime <= 0) {
      clearInterval(timerInterval);
      updateClockface({ days: '00', hours: '00', mins: '00', secs: '00' });
    } else {
      const time = getTimeComponents(deltaTime);
      updateClockface(time);
    }
  }, 1000);
}

function getTimeComponents(time) {
  const days = pad(Math.max(0, Math.floor(time / (1000 * 60 * 60 * 24))));
  const hours = pad(
    Math.max(0, Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
  );
  const mins = pad(
    Math.max(0, Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)))
  );
  const secs = pad(Math.max(0, Math.floor((time % (1000 * 60)) / 1000)));

  return { days, hours, mins, secs };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function updateClockface({ days, hours, mins, secs }) {
  dataDays.textContent = `${days}`;
  dataHours.textContent = `${hours}`;
  dataMinutes.textContent = `${mins}`;
  dataSeconds.textContent = `${secs}`;
}

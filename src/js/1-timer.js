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

const convertMs = ms => {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const mins = Math.floor(((ms % day) % hour) / minute);
  const secs = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, mins, secs };
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

      // Запуск таймера
      timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const deltaTime = userSelectedDate - currentTime;
        if (deltaTime <= 0) {
          clearInterval(timerInterval);
          updateClockface({ days: '00', hours: '00', mins: '00', secs: '00' });
        } else {
          const time = convertMs(deltaTime);
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
      const time = convertMs(deltaTime);
      updateClockface(time);
    }
  }, 0);
}

function updateClockface({ days, hours, mins, secs }) {
  dataDays.textContent = pad(days);
  dataHours.textContent = pad(hours);
  dataMinutes.textContent = pad(mins);
  dataSeconds.textContent = pad(secs);
}

function pad(value) {
  return String(value).padStart(2, '0');
}

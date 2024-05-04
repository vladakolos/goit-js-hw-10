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
      }
      btnStart.disabled = selectedDate < new Date();
    },
  };

  flatpickr(inputId, options);
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

      const timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const deltaTime = userSelectedDate - currentTime;
        if (deltaTime <= 0) {
          clearInterval(timerInterval);
          updateClockface({
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00',
          });
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

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateClockface({ days, hours, minutes, seconds }) {
  dataDays.textContent = pad(days);
  dataHours.textContent = pad(hours);
  dataMinutes.textContent = pad(minutes);
  dataSeconds.textContent = pad(seconds);
}

function pad(value) {
  return String(value).padStart(2, '0');
}

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const delayInput = document.querySelector('input[name="delay"]');
const fulfilledBtn = document.querySelector(
  'input[name="state"][value="fulfilled"]'
);
const rejectedBtn = document.querySelector(
  'input[name="state"][value="rejected"]'
);
const submitBtn = document.querySelector('button[type="submit"]');

const getFulfilledPromise = delay => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(delay);
    }, delay);
  });
};

const getRejectedPromise = delay => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(delay);
    }, delay);
  });
};

submitBtn.addEventListener('click', event => {
  event.preventDefault();
  const delay = parseInt(delayInput.value);

  if (fulfilledBtn.checked) {
    getFulfilledPromise(delay)
      .then(delay => {
        iziToast.success({
          title: `✅`,
          message: `Fulfilled promise in ${delay} ms`,
        });
      })
      .catch(delay => {
        iziToast.error({
          title: `❌`,
          message: `Rejected promise in ${delay} ms`,
        });
      });
  } else if (rejectedBtn.checked) {
    getRejectedPromise(delay)
      .then(delay => {
        iziToast.success({
          title: `✅`,
          message: `Fulfilled promise in ${delay} ms`,
        });
      })
      .catch(delay => {
        iziToast.error({
          title: `❌`,
          message: `Rejected promise in ${delay} ms`,
        });
      });
  }
});

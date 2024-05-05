import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const delayInput = document.querySelector('input[name="delay"]');

form.addEventListener('submit', event => {
  event.preventDefault();

  const delay = parseInt(delayInput.value);
  const radioBtns = form.elements.state.value;

  const getPromise = delay => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (radioBtns === 'fulfilled') {
          resolve(`Fulfilled promise in ${delay}ms`);
        } else {
          reject(` Rejected promise in ${delay}ms`);
        }
      }, delay);
    });
  };

  getPromise(delay)
    .then(value => {
      iziToast.success({
        title: `✅`,
        message: value,
      });
    })
    .catch(error => {
      iziToast.error({
        title: `❌`,
        message: error,
      });
    });
});

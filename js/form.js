import axios from 'axios';

const formNode = document.getElementById('contact-form');
const nameNode = document.getElementById('name');
const phoneNode = document.getElementById('phone');
const emailNode = document.getElementById('email');
const commentNode = document.getElementById('comment');
const messageNode = document.getElementById('message');

formNode.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {
    name: nameNode.value,
    phone: phoneNode.value,
    email: emailNode.value,
    comment: commentNode.value,
  };
  const positiveClassName = 'message--positive';
  const negativeClassName = 'message--negative';

  axios.post('/order.php', formData).then((result) => {
    const { success } = result.data;

    const message = success ? 'Успешно отправили!' : 'Ой, ошибка! Напишите нам на почту или позвоните';
    const messageClassName = success ? positiveClassName : negativeClassName;

    messageNode.textContent = message;
    messageNode.classList.add(messageClassName);

    setTimeout(() => {
      nameNode.value = '';
      phoneNode.value = '';
      emailNode.value = '';
      commentNode.value = '';
      messageNode.textContent = '';
      messageNode.classList.remove(positiveClassName);
      messageNode.classList.remove(negativeClassName);
    }, 3000);
  });
});

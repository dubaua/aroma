import animate from './animate.js';
import { easeInOutSin } from './easings.js';

const shift = 7;
const rotorWidth = 44;
const stropeWidth = 211;
const radius = 132;

const pumpjackNodeList = document.querySelectorAll('[data-pumpjack]');

for (let i = 0; i < pumpjackNodeList.length; i++) {
  const pumpjackNode = pumpjackNodeList[i];
  const startRad = parseFloat(pumpjackNode.dataset.pumpjackStart);

  const wheelNode = pumpjackNode.querySelector('[data-pumpjack-wheel]');
  const rotorNode = pumpjackNode.querySelector('[data-pumpjack-rotor]');
  const jackNode = pumpjackNode.querySelector('[data-pumpjack-jack]');
  const stropeNode = pumpjackNode.querySelector('[data-pumpjack-strope]');
  const pumpNode = pumpjackNode.querySelector('[data-pumpjack-pump]');

  const wheelAnimation = spin(wheelNode, 1250);
  const pumpAnimation = pump(startRad, rotorNode, jackNode, stropeNode, pumpNode, 5000);
}

function spin(node, duration) {
  return animate({
    duration: duration,
    easing: t => t,
    draw(p) {
      node.style.transform = `rotate(${p * -360}deg)`;
    },
    onComplete() {
      spin(node, duration);
    },
  });
}

function pump(startRad, rotorNode, jackNode, stropeNode, pumpNode, duration) {
  return animate({
    duration: duration,
    easing: t => t,
    draw(progress) {
      const k = rotorWidth / stropeWidth;
      const alpha = progress * -Math.PI * 2 + startRad;
      const beta = Math.asin(Math.sin(alpha) * k);
      const gamma = beta - alpha;

      rotorNode.style.transform = `rotate(${alpha}rad)`;

      const translateYprogress = Math.sin(alpha);
      const translateY = translateYprogress * shift;
      stropeNode.style.transform = `translateY(${translateY}px) rotate(${gamma}rad)`;

      const rw = (rotorWidth - translateY) * Math.sin(alpha);
      const rh = (rotorWidth + translateY) * Math.cos(alpha);

      const sw = stropeWidth * Math.sin(beta);
      const sh = stropeWidth * Math.cos(beta);

      const px = -radius + shift + rw - sw - 1;
      const py = stropeWidth - sh + rh;

      const delta = Math.atan(py / px);
      
      jackNode.style.transform = `rotate(${delta}rad)`;
      pumpNode.style.transform = `translate(0, ${delta * 200}%)`;


    },
    onComplete() {
      pump(startRad, rotorNode, jackNode, stropeNode, pumpNode, duration);
    },
  });
}

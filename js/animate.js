import createObservable from 'create-observable';

function animate({ duration, delay, easing, draw, onComplete, onCancel }) {
  if (typeof duration !== 'number' || duration <= 0) {
    throw new TypeError(`animate: duration is required positive number in ms, got ${typeof duration} ${duration}`);
  }

  if (delay && (typeof delay !== 'number' || delay < 0)) {
    throw new TypeError(`animate: delay should non negative number in ms, got ${typeof delay} ${delay}`);
  }

  if (typeof easing !== 'function') {
    throw new TypeError(`animate: easing is required function, got ${typeof easing} ${easing}`);
  }

  if (typeof draw !== 'function') {
    throw new TypeError(`animate: draw is required function, got ${typeof draw} ${draw}`);
  }

  let lastTimestamp = performance.now();
  let progress = 0;
  let fraction = 0;
  let delayBuffer = 0;
  let requestId = null;
  const isRunning = createObservable({ initial: false, onChange: onIsRunningChange });
  isRunning.value = true;

  function tick(timestamp) {
    const timedelta = timestamp - lastTimestamp;
    const frametick = timedelta / duration;

    if (delayBuffer < delay) {
      delayBuffer += timedelta;
    } else {
      fraction = Math.min(1, Math.max(0, fraction + frametick));
      progress = easing(fraction);
      draw(progress);
    }

    if (fraction === 1) {
      isRunning.value = false;
      if (typeof onComplete === 'function') {
        onComplete();
      }
    } else {
      lastTimestamp = timestamp;
      requestId = window.requestAnimationFrame(tick);
    }
  }

  function onIsRunningChange(nextState) {
    if (nextState) {
      lastTimestamp = performance.now();
      requestId = window.requestAnimationFrame(tick);
    } else {
      if (typeof onCancel === 'function' && progress !== 1 && progress !== 0) {
        onCancel({ progress, fraction });
      }
      window.cancelAnimationFrame(requestId);
    }
  }

  function togglePause(force) {
    isRunning.value = force === undefined ? !isRunning.value : force;
  }

  return { togglePause };
}

export default animate;

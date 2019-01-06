(function () {
  'use strict';

  const vendors = [
    'webkit',
    'moz',
  ];
  for (let i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    const vp = vendors[i];
    window.requestAnimationFrame = window[`${vp}RequestAnimationFrame`];
    window.cancelAnimationFrame = (window[`${vp}CancelAnimationFrame`] ||
      window[`${vp}CancelRequestAnimationFrame`]);
  }
  // iOS6 is buggy
  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) ||
    !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    let lastTime = 0;
    window.requestAnimationFrame = function (callback) {
      const now = new Date().getTime();
      const nextTime = Math.max(lastTime + 16, now);
      return setTimeout(function () {
        callback(lastTime = nextTime);
      }, nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
  }
}());

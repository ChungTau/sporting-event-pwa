// animationWorker.js
self.onmessage = function (event) {
    const frameIds = event.data;
    frameIds.forEach(id => cancelAnimationFrame(id));
    self.postMessage('All animations cancelled');
};
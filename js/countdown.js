(function () {
  var deadline = new Date('2026-08-19T23:59:59+01:00');

  var countdownBlocks = document.querySelectorAll('[data-countdown]');
  var expiredBlocks = document.querySelectorAll('[data-countdown-expired]');
  var sentinel = document.getElementById('countdown-sentinel');
  var stickyBar = document.getElementById('countdown-sticky');

  if (!countdownBlocks.length) return;

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function tick() {
    var now = Date.now();
    var diff = deadline - now;
    var expired = diff <= 0;

    countdownBlocks.forEach(function (block) {
      block.hidden = expired;
    });

    expiredBlocks.forEach(function (block) {
      block.hidden = !expired;
    });

    if (expired) return;

    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var secs = Math.floor((diff % 60000) / 1000);

    document.querySelectorAll('.js-cd-days').forEach(function (el) {
      el.textContent = days;
    });
    document.querySelectorAll('.js-cd-hours').forEach(function (el) {
      el.textContent = pad(hours);
    });
    document.querySelectorAll('.js-cd-mins').forEach(function (el) {
      el.textContent = pad(mins);
    });
    document.querySelectorAll('.js-cd-secs').forEach(function (el) {
      el.textContent = pad(secs);
    });
  }

  tick();
  setInterval(tick, 1000);

  if (sentinel && stickyBar && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        var visible = entries[0].isIntersecting;
        stickyBar.hidden = visible;
        stickyBar.setAttribute('aria-hidden', visible ? 'true' : 'false');
        document.body.classList.toggle('countdown-sticky-active', !visible);
      },
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
    );

    observer.observe(sentinel);
  }
})();

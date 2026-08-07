(function () {
  // 11:59pm UK time (BST), Wednesday 19 August 2026
  var deadline = new Date('2026-08-19T23:59:59+01:00');

  var countdown = document.getElementById('countdown');
  var expired = document.getElementById('countdown-expired');
  var daysEl = document.getElementById('cd-days');
  var hoursEl = document.getElementById('cd-hours');
  var minsEl = document.getElementById('cd-mins');
  var secsEl = document.getElementById('cd-secs');

  if (!countdown) return;

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function tick() {
    var now = Date.now();
    var diff = deadline - now;

    if (diff <= 0) {
      countdown.hidden = true;
      expired.hidden = false;
      return;
    }

    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var secs = Math.floor((diff % 60000) / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = pad(hours);
    minsEl.textContent = pad(mins);
    secsEl.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

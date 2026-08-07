(function () {
  var form = document.getElementById('petition-form');
  var formWrap = document.getElementById('petition-form-wrap');
  var success = document.getElementById('petition-success');
  var countEl = document.getElementById('petition-count-value');
  var submitBtn = form ? form.querySelector('[type="submit"]') : null;

  function setCount(value) {
    if (!countEl || value === null || value === undefined) return;
    countEl.textContent = Number(value).toLocaleString('en-GB');
  }

  function bumpCount() {
    if (!countEl) return;
    var current = parseInt(countEl.textContent.replace(/,/g, ''), 10);
    setCount(Number.isFinite(current) ? current + 1 : 1);
  }

  function loadCount() {
    fetch('/api/petition-count')
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data && typeof data.count === 'number') {
          setCount(data.count);
        }
      })
      .catch(function () {
        /* keep placeholder */
      });
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting…';
      }

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Submit failed');

          if (formWrap) formWrap.hidden = true;
          if (success) success.hidden = false;

          bumpCount();

          if (success) {
            success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit petition';
          }
          alert('Something went wrong. Please try again.');
        });
    });
  }

  loadCount();
})();

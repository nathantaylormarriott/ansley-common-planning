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

  function encodeForm(formEl) {
    return new URLSearchParams(new FormData(formEl)).toString();
  }

  function submitToNetlifyForms(body) {
    return fetch('/petition-form.html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    }).catch(function () {
      return null;
    });
  }

  function submitToApi(body) {
    return fetch('/api/submit-petition', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok || !data.ok) {
          throw new Error(data.error || 'Submit failed');
        }
        return data;
      });
    });
  }

  function showSuccess() {
    if (formWrap) formWrap.hidden = true;
    if (success) success.hidden = false;
    if (success) {
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
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
        /* keep current value */
      });
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting…';
      }

      var body = encodeForm(form);

      submitToApi(body)
        .then(function (data) {
          if (typeof data.count === 'number') {
            setCount(data.count);
          }
          submitToNetlifyForms(body);
          showSuccess();
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

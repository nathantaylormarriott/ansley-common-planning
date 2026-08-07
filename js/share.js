(function () {
  var siteUrl = 'https://ansleycommonplanning.netlify.app';

  var shareMessage =
    'Stop H9 & H10 — protect Ansley Common! Up to 850 new homes proposed on our doorstep. ' +
    'Object to North Warwickshire\'s Draft Local Plan before 19 Aug 2026. Sign the petition: ' +
    siteUrl;

  function wireLink(id, href) {
    var el = document.getElementById(id);
    if (el) el.href = href;
  }

  function wireCopy(buttonId, feedbackId, text) {
    var btn = document.getElementById(buttonId);
    var feedback = document.getElementById(feedbackId);

    if (!btn) return;

    btn.addEventListener('click', function () {
      var done = function () {
        if (feedback) {
          feedback.hidden = false;
          setTimeout(function () {
            feedback.hidden = true;
          }, 3000);
        }
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        done();
      }
    });
  }

  wireLink('share-whatsapp', 'https://wa.me/?text=' + encodeURIComponent(shareMessage));
  wireLink('share-sms', 'sms:?&body=' + encodeURIComponent(shareMessage));

  wireCopy('share-copy', 'share-feedback', shareMessage);
})();

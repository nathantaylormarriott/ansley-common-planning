(function () {
  var siteUrl = 'https://ansleycommonplanning.netlify.app';

  var shareMessage =
    'Stop H9 & H10 — protect Ansley Common! Up to 850 new homes proposed on our doorstep. ' +
    'Object to North Warwickshire\'s Draft Local Plan before 19 Aug 2026. Sign the petition: ' +
    siteUrl;

  var whatsappBtn = document.getElementById('share-whatsapp');
  var smsBtn = document.getElementById('share-sms');
  var copyBtn = document.getElementById('share-copy');
  var feedback = document.getElementById('share-feedback');

  if (whatsappBtn) {
    whatsappBtn.href =
      'https://wa.me/?text=' + encodeURIComponent(shareMessage);
  }

  if (smsBtn) {
    smsBtn.href = 'sms:?&body=' + encodeURIComponent(shareMessage);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var done = function () {
        if (feedback) {
          feedback.hidden = false;
          setTimeout(function () {
            feedback.hidden = true;
          }, 3000);
        }
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareMessage).then(done);
      } else {
        var textarea = document.createElement('textarea');
        textarea.value = shareMessage;
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
})();

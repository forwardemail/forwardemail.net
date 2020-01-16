const $ = require('jquery');
const Clipboard = require('clipboard');

// all <code> blocks should have a toggle tooltip and clipboard
function errorHandler(ev) {
  ev.clearSelection();
  $(ev.trigger)
    .tooltip('dispose')
    .tooltip({
      title: 'Please manually copy to clipboard',
      html: true,
      placement: 'bottom'
    })
    .tooltip('show');
  $(ev.trigger).on('hidden.bs.tooltip', () => $(ev.trigger).tooltip('dispose'));
}

function successHandler(ev) {
  ev.clearSelection();
  $(ev.trigger)
    .tooltip('dispose')
    .tooltip({
      title: 'Copied!',
      placement: 'bottom'
    })
    .tooltip('show');
  $(ev.trigger).on('hidden.bs.tooltip', () => {
    $(ev.trigger).tooltip('dispose');
  });
}

if (Clipboard.isSupported()) {
  $('body').on('mouseenter', 'code', function() {
    $(this)
      .css('cursor', 'pointer')
      .tooltip({
        title: 'Click to copy',
        placement: 'bottom',
        trigger: 'manual'
      })
      .tooltip('show');
  });
  $('body').on('mouseleave', 'code', function() {
    $(this)
      .tooltip('dispose')
      .css('cursor', 'initial');
  });
  const clipboard = new Clipboard('code', {
    text(trigger) {
      return trigger.innerHTML;
    },
    target(trigger) {
      return trigger;
    }
  });
  clipboard.on('success', successHandler);
  clipboard.on('error', errorHandler);
}

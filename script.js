(function () {
  var STORAGE_KEY = 'a11ySettings';
  var defaults = { font: 0, color: 0, images: 1, fontfamily: 0, spacing: 0, lineheight: 0, panelOpen: 0, extraOpen: 0 };

  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      var merged = {};
      for (var key in defaults) merged[key] = (saved && saved[key] !== undefined) ? saved[key] : defaults[key];
      return merged;
    } catch (e) {
      var copy = {};
      for (var k in defaults) copy[k] = defaults[k];
      return copy;
    }
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch (e) {}
  }

  var settings = load();

  function apply() {
    var html = document.documentElement;
    var classes = Array.prototype.slice.call(html.classList);
    classes.forEach(function (c) {
      if (c.indexOf('a11y-') === 0) html.classList.remove(c);
    });

    if (settings.font) html.classList.add('a11y-font-' + settings.font);
    if (settings.color) html.classList.add('a11y-color-' + settings.color);
    if (settings.fontfamily) html.classList.add('a11y-fontfamily-' + settings.fontfamily);
    if (settings.spacing) html.classList.add('a11y-spacing-' + settings.spacing);
    if (settings.lineheight) html.classList.add('a11y-lineheight-' + settings.lineheight);
    if (!settings.images) html.classList.add('a11y-no-images');
    html.classList.toggle('a11y-panel-open', !!settings.panelOpen);

    var bar = document.getElementById('a11y-bar');
    if (bar) {
      var extra = document.getElementById('a11y-extra');
      var extraToggle = document.getElementById('a11y-extra-toggle');
      if (extra) extra.style.display = settings.extraOpen ? 'block' : 'none';
      if (extraToggle) extraToggle.setAttribute('aria-expanded', settings.extraOpen ? 'true' : 'false');

      var groupButtons = bar.querySelectorAll('.a11y-btn[data-group]');
      for (var i = 0; i < groupButtons.length; i++) {
        var btn = groupButtons[i];
        var group = btn.getAttribute('data-group');
        var value = btn.getAttribute('data-value');
        var isActive = String(settings[group] || 0) === value;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      }

      var imagesBtn = document.getElementById('a11y-images-toggle');
      if (imagesBtn) {
        imagesBtn.classList.toggle('active', !settings.images);
        imagesBtn.setAttribute('aria-pressed', settings.images ? 'false' : 'true');
      }
    }

    var toggleBtn = document.getElementById('visionToggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = settings.panelOpen
        ? '<i class="fas fa-eye-slash"></i> <span>Закрыть панель</span>'
        : '<i class="fas fa-eye"></i> <span>Версия для слабовидящих</span>';
      toggleBtn.setAttribute('aria-expanded', settings.panelOpen ? 'true' : 'false');
    }
  }

  function setGroup(group, value) {
    settings[group] = (settings[group] === value) ? 0 : value;
    save();
    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    apply();

    var toggleBtn = document.getElementById('visionToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        settings.panelOpen = settings.panelOpen ? 0 : 1;
        save();
        apply();
      });
    }

    var bar = document.getElementById('a11y-bar');
    if (!bar) return;

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.a11y-btn');
      if (!btn) return;

      var group = btn.getAttribute('data-group');
      if (group) {
        setGroup(group, parseInt(btn.getAttribute('data-value'), 10));
        return;
      }

      switch (btn.id) {
        case 'a11y-images-toggle':
          settings.images = settings.images ? 0 : 1;
          save();
          apply();
          break;
        case 'a11y-extra-toggle':
          settings.extraOpen = settings.extraOpen ? 0 : 1;
          save();
          apply();
          break;
        case 'a11y-reset':
          settings = { font: 0, color: 0, images: 1, fontfamily: 0, spacing: 0, lineheight: 0, panelOpen: 1, extraOpen: 0 };
          save();
          apply();
          break;
        case 'a11y-close':
          settings.panelOpen = 0;
          save();
          apply();
          break;
      }
    });
  });
})();

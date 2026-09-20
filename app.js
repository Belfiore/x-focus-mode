(() => {
  'use strict';
  const preview = document.querySelector('#reader-preview');
  const toggle = document.querySelector('#reader-toggle');
  const post = document.querySelector('.preview-post');
  const samples = [
    { name: 'Mara Ellis', handle: '@maraellis', text: 'The best things we make give us more room to think. A quieter page. An open window. A slower Sunday.' },
    { name: 'Iris Park', handle: '@irispark', text: 'Not every thought needs an audience. Some just need a little time, an open notebook, and a walk home.' },
    { name: 'Theo North', handle: '@theonorth', text: 'A good interface knows when to disappear. More space for the sentence you want to finish. Less of everything else.' }
  ];
  let feed = 'home';
  let index = 0;
  let timer;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const currentSamples = () => feed === 'bookmarks' ? [samples[2], samples[0]] : samples;
  function renderPost() {
    clearTimeout(timer);
    post.classList.add('changing');
    timer = setTimeout(() => {
      const items = currentSamples();
      const item = items[index];
      document.querySelector('#author').textContent = item.name;
      document.querySelector('#handle').textContent = item.handle;
      document.querySelector('#post-copy').textContent = item.text;
      document.querySelector('#post-position').textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
      post.classList.remove('changing');
    }, reducedMotion.matches ? 0 : 160);
  }
  function changeReader() {
    const enabled = toggle.getAttribute('aria-checked') !== 'true';
    toggle.setAttribute('aria-checked', String(enabled));
    preview.dataset.reader = String(enabled);
  }
  toggle.addEventListener('click', changeReader);
  document.querySelector('#next-post').addEventListener('click', () => { index = (index + 1) % currentSamples().length; renderPost(); });
  document.querySelectorAll('[data-feed]').forEach(button => button.addEventListener('click', () => {
    if (feed === button.dataset.feed) return;
    feed = button.dataset.feed; index = 0;
    document.querySelectorAll('[data-feed]').forEach(item => {
      const active = item === button;
      item.classList.toggle('selected', active);
      if (active) item.setAttribute('aria-current', 'page'); else item.removeAttribute('aria-current');
    });
    renderPost();
  }));
  document.querySelectorAll('.appearance').forEach(button => button.addEventListener('click', () => {
    preview.dataset.theme = button.dataset.theme;
    document.querySelectorAll('.appearance').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  }));
  document.addEventListener('keydown', event => {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input,textarea,[contenteditable="true"]')) return;
    if (event.key.toLowerCase() === 'f') { event.preventDefault(); changeReader(); }
    // Preserve normal page scrolling unless the visitor is using the demo.
    if (event.key === 'ArrowDown' && preview.contains(document.activeElement)) { event.preventDefault(); index = (index + 1) % currentSamples().length; renderPost(); }
  });
  document.querySelector('.zip-download').addEventListener('click', () => {
    document.querySelector('.download-status').textContent = 'Your ZIP download is starting.';
  });
})();

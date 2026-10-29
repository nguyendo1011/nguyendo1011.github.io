// CV chat: talks to the Worker at /api/chat. Answers rendered as text only (never HTML).
(() => {
  const fab = document.getElementById('chatFab');
  const panel = document.getElementById('chatPanel');
  const log = document.getElementById('chatLog');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const send = form.querySelector('button');
  const suggest = document.getElementById('chatSuggest');
  const history = [];
  // One id per browser tab session, so a visitor's questions group together in the log
  let sessionId;
  try { sessionId = sessionStorage.getItem('chatSession') || crypto.randomUUID(); sessionStorage.setItem('chatSession', sessionId); }
  catch { sessionId = crypto.randomUUID(); }

  // Touch devices: don't autofocus the input (it pops the keyboard and shifts the page)
  const canFocus = matchMedia('(hover: hover)').matches;
  const open = state => {
    panel.hidden = !state;
    fab.setAttribute('aria-expanded', String(state));
    document.documentElement.classList.toggle('chat-open', state); // scroll lock (mobile, see CSS)
    if (state ? canFocus : true) (state ? input : fab).focus();
  };
  fab.addEventListener('click', () => open(true));
  document.getElementById('chatClose').addEventListener('click', () => open(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) open(false); });

  const add = (cls, text) => {
    const p = document.createElement('div');
    p.className = 'msg ' + cls;
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    return p;
  };

  // Tiny safe renderer: "**bold**" + "- " bullet lines -> DOM nodes. Never uses innerHTML.
  // Constant, trusted icon markup (never built from model or visitor text)
  const COPY_ICON = '<svg class="i-copy" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg><svg class="i-check" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
  const EMAIL = /([\w.+-]+@[\w-]+\.[\w.-]*\w)/g;
  // Text -> text nodes, with each email turned into a Gmail compose link + copy button
  const withEmails = (el, text) => text.split(EMAIL).forEach((part, i) => {
    if (!part) return;
    if (i % 2 === 0) { el.appendChild(document.createTextNode(part)); return; }
    const a = document.createElement('a');
    a.className = 'mail-link';
    a.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(part);
    a.target = '_blank'; a.rel = 'noopener';
    a.textContent = part;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'copy-ico'; b.dataset.copy = part;
    b.title = 'Copy email'; b.setAttribute('aria-label', 'Copy ' + part);
    b.innerHTML = COPY_ICON;
    el.append(a, b);
  });
  const inline = (el, text) => text.split(/\*\*(.+?)\*\*/g).forEach((part, i) => {
    if (!part) return;
    if (i % 2) { const b = document.createElement('strong'); withEmails(b, part); el.appendChild(b); }
    else withEmails(el, part);
  });
  const render = (el, text) => {
    el.textContent = '';
    let list = null;
    text.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
      const item = line.match(/^(?:[-*\u2022]|\d+[.)])\s+(.*)/);
      if (item) {
        if (!list) { list = document.createElement('ul'); list.className = 'check'; el.appendChild(list); }
        const li = document.createElement('li'); inline(li, item[1]); list.appendChild(li);
      } else {
        list = null;
        const p = document.createElement('p'); inline(p, line); el.appendChild(p);
      }
    });
  };

  async function ask(q) {
    q = q.trim();
    if (!q || send.disabled) return;
    suggest.remove();
    log.querySelector('.chat-label')?.remove();
    add('user', q);
    history.push({ role: 'user', content: q });
    input.value = '';
    send.disabled = true;
    const wait = add('bot wait', '');
    wait.setAttribute('aria-label', 'Thinking');
    wait.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId, messages: history }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) throw new Error(data.error || 'Something went wrong. Please try again.');
      wait.className = 'msg bot';
      render(wait, data.reply);
      history.push({ role: 'assistant', content: data.reply });
      log.scrollTop = wait.offsetTop - log.offsetTop - 12; // show the start of a long answer
    } catch (e) {
      history.pop(); // let the visitor retry the same question
      wait.className = 'msg bot err';
      wait.textContent = e.message;
    } finally {
      send.disabled = false;
      if (canFocus) input.focus();
    }
  }

  form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); });
  suggest.addEventListener('click', e => { if (e.target.tagName === 'BUTTON') ask(e.target.textContent); });
})();

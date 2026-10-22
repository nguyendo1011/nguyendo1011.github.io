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

  const open = state => {
    panel.hidden = !state;
    fab.setAttribute('aria-expanded', String(state));
    (state ? input : fab).focus();
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
  const inline = (el, text) => text.split(/\*\*(.+?)\*\*/g).forEach((part, i) => {
    if (!part) return;
    if (i % 2) { const b = document.createElement('strong'); b.textContent = part; el.appendChild(b); }
    else el.appendChild(document.createTextNode(part));
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
    const wait = add('bot wait', 'Thinking');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history }),
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
      input.focus();
    }
  }

  form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); });
  suggest.addEventListener('click', e => { if (e.target.tagName === 'BUTTON') ask(e.target.textContent); });
})();

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
    const p = document.createElement('p');
    p.className = 'msg ' + cls;
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    return p;
  };

  async function ask(q) {
    q = q.trim();
    if (!q || send.disabled) return;
    suggest.remove();
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
      const reply = data.reply.replace(/\*\*/g, '');
      wait.className = 'msg bot';
      wait.textContent = reply;
      history.push({ role: 'assistant', content: reply });
    } catch (e) {
      history.pop(); // let the visitor retry the same question
      wait.className = 'msg bot err';
      wait.textContent = e.message;
    } finally {
      send.disabled = false;
      input.focus();
      log.scrollTop = log.scrollHeight;
    }
  }

  form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); });
  suggest.addEventListener('click', e => { if (e.target.tagName === 'BUTTON') ask(e.target.textContent); });
})();

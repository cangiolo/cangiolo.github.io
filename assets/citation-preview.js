(() => {
  const script = document.currentScript;
  const dataURL = new URL('gene-sequence-citations.json', script.src);
  fetch(dataURL).then(r => {
    if (!r.ok) throw new Error('Citation data unavailable');
    return r.json();
  }).then(data => {
    const card = document.createElement('aside');
    card.className = 'citation-preview';
    card.id = 'citation-preview';
    card.setAttribute('aria-label', '引用来源预览');
    card.hidden = true;
    document.body.append(card);
    let active, trigger, timer;
    const keep = () => clearTimeout(timer);
    const close = () => {
      keep();
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      card.hidden = true;
      active = trigger = null;
    };
    const later = () => { keep(); timer = setTimeout(close, 250); };
    const element = (tag, cls, text) => {
      const el = document.createElement(tag);
      el.className = cls;
      if (text) el.textContent = text;
      return el;
    };
    const position = () => {
      if (!active || card.hidden) return;
      card.style.width = Math.min(640, window.innerWidth - 24) + 'px';
      card.style.maxHeight = (window.innerHeight - 24) + 'px';
      const pre = card.querySelector('pre');
      if (pre) pre.style.maxHeight = Math.round(window.innerHeight * 0.44) + 'px';
      const rect = active.getBoundingClientRect();
      const width = card.offsetWidth, height = card.offsetHeight;
      card.style.left = Math.max(12, Math.min(rect.left, innerWidth - width - 12)) + 'px';
      const below = rect.bottom + 10;
      card.style.top = Math.max(12, Math.min(below + height <= innerHeight - 12 ? below : rect.top - height - 10, innerHeight - height - 12)) + 'px';
    };
    const show = (link, button) => {
      keep();
      if (active === link && !card.hidden) return;
      close();
      active = link;
      trigger = button;
      button.setAttribute('aria-expanded', 'true');
      const d = data[link.href];
      card.replaceChildren();
      const head = element('a', 'citation-head', d.title);
      head.href = link.href; head.target = '_blank'; head.rel = 'noopener';
      const dismiss = element('button', 'citation-dismiss', '×');
      dismiss.type = 'button'; dismiss.setAttribute('aria-label', '关闭预览');
      dismiss.onclick = () => { button.focus(); close(); };
      card.append(head, dismiss);
      const meta = d.repository ? `${d.repository} · ${d.revision.slice(0, 12)}` : d.host;
      card.append(element('div', 'citation-meta', meta + (d.start ? ` · L${d.start}–L${d.end}` : '')));
      if (d.lines) {
        const pre = element('pre', 'citation-code');
        pre.tabIndex = 0;
        pre.setAttribute('aria-label', `引用代码，第 ${d.start} 至 ${d.end} 行`);
        const code = document.createElement('code');
        d.lines.forEach((line, i) => {
          const row = element('span', 'citation-row');
          const number = element('span', 'citation-number', String(d.start + i));
          number.setAttribute('aria-hidden', 'true');
          row.append(number, document.createTextNode(line + '\n'));
          code.append(row);
        });
        pre.append(code); card.append(pre);
      } else {
        card.append(element('p', 'citation-note', d.error || (d.repository ? '此链接未指定代码行范围，可打开原文件查看。' : '打开原网页查看引用来源。')));
      }
      const foot = element('a', 'citation-foot', d.host + ' · 查看原文 ↗');
      foot.href = link.href; foot.target = '_blank'; foot.rel = 'noopener';
      card.append(foot);
      card.hidden = false;
      position();
    };
    document.querySelectorAll('.gene-sequence .prose a[href^="http"]').forEach(link => {
      if (!data[link.href]) return;
      const button = element('button', 'citation-trigger', '⌕');
      button.type = 'button';
      button.setAttribute('aria-label', '预览引用：' + link.textContent);
      button.setAttribute('aria-controls', card.id);
      button.setAttribute('aria-expanded', 'false');
      link.after(button);
      link.addEventListener('mouseenter', () => show(link, button));
      link.addEventListener('mouseleave', later);
      link.addEventListener('focus', () => show(link, button));
      link.addEventListener('blur', later);
      button.addEventListener('mouseenter', keep);
      button.addEventListener('mouseleave', later);
      button.addEventListener('click', () => active === link && !card.hidden ? close() : show(link, button));
      button.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { show(link, button); card.querySelector('a').focus(); e.preventDefault(); }
      });
    });
    card.addEventListener('mouseenter', keep);
    card.addEventListener('mouseleave', later);
    card.addEventListener('focusin', keep);
    card.addEventListener('focusout', later);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !card.hidden) { const button = trigger; button?.focus(); close(); }
    });
    document.addEventListener('pointerdown', e => {
      if (!card.hidden && !card.contains(e.target) && e.target !== trigger && !active?.contains(e.target)) close();
    });
    window.addEventListener('resize', close);
    window.addEventListener('scroll', position);
  }).catch(error => console.warn(error.message));
})();

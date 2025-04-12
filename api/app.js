export default async function handler(req, res) {
  const user = req.query.u || 'kode-cat';
  const repo = req.query.r || 'ghost';
  const path = req.query.p || 'index.html';
  const rtn = req.query.rtn || 'pg';
  const mode = req.query.m || '0';

  const cdn = `https://cdn.jsdelivr.net/gh/${user}/${repo}@latest/${path}`;
  const ghUrl = `https://github.com/${user}/${repo}/blob/main/${path}`;
  const ghPages = `https://${user}.github.io/${repo}/${path}`;
  const stackblitz = `https://stackblitz.com/github/${user}/${repo}`;
  const viewSource = `view-source:${cdn}`;

  // Utility for error display
  const showError = (msg) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(400).send(`
      <details style="border:2px solid red;padding:1em;font-family:monospace;">
        <summary style="color:red;font-weight:bold;">SHDP Error</summary>
        <pre style="overflow:auto;">${msg}</pre>
      </details>
    `);
  };

  try {
    if (rtn === 'pg') {
      const html = await fetch(cdn).then(r => r.text());
      if (mode === '1') return res.send(html);

      const rewritten = html.replace(/<(script|link|img)[^>]+(src|href)=["']([^"']+)["']/gi, (match, tag, attr, url) => {
        if (url.startsWith('http')) return match;
        return `<${tag} ${attr}="https://cdn.jsdelivr.net/gh/${user}/${repo}@latest/${url}"`;
      });

      res.send(rewritten);
    }

    else if (rtn === 'raw') {
      const raw = await fetch(cdn).then(r => r.text());
      res.setHeader('Content-Type', 'text/plain');
      res.send(raw);
    }

    else if (rtn === 'scd') {
      const code = await fetch(cdn).then(r => r.text());
      res.setHeader('Content-Type', 'text/html');
      res.send(`
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
        <pre><code class="hljs">${escapeHtml(code)}</code></pre>
        <script>hljs.highlightAll();</script>
      `);
    }

    else if (rtn === 'ghr') {
      res.redirect(ghUrl);
    }

    else if (rtn === 'ghs') {
      res.redirect(ghPages);
    }

    else if (rtn === 'stz') {
      res.redirect(stackblitz);
    }

    else if (rtn === 'vsg') {
      res.redirect(viewSource);
    }

    else {
      showError('Invalid `rtn` value.');
    }
  } catch (e) {
    showError(e.message);
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]
  ));
}

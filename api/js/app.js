// shdp js
function print(...args) {
  console.log(...args);
}

function write(text) {
  document.documentElement.innerHTML = text;
}

function redirectTo(newUrl) {
  window.location = newUrl;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getFileExtension(filename, defaultVal) {
  if (!filename || typeof filename !== 'string') {
    return ""; // Handle cases with no filename or non-string input
  }
  const parts = filename.split('.');
  if (parts.length > 1) {
    return parts.pop()
  } else {
    return `${defaultVal}`; // No extension found
  }
}

async function getFileFromJsdelivr(u, r, v = "latest", file) {
  const baseCDN = `https://cdn.jsdelivr.net/gh/${u}/${r}@${v}`;
  const response = await fetch(`${baseCDN}/${file}`);
  if (!response.ok) throw new Error(`Failed to fetch ${file}`);
  return await response.text();
}

function getSearchParam(param) {
  const url = new URLSearchParams(location.search);
  return url.get(param);
}

const rtn_funcs = new Object();
rtn_funcs.pg = async function(user, repo, rfnc, file, rwrt) {
  const baseCDN = `https://cdn.jsdelivr.net/gh/${user}/${repo}@${rfnc}`;
  html = await getFileFromJsdelivr(user, repo, rfnc, file);
  if (rwrt == false) { //return nothing to avoid execution of rewriting process if rewrite mode is false
    write(html);
  } else {
    write(rewriteRelativeUrls(html, baseCDN));
    loadExternals(baseCDN);
  }
}
rtn_funcs.raw = function(user, repo, rfnc, file, rwrt) {
  redirectTo(`https://cdn.jsdelivr.net/gh/${user}/${repo}@${rfnc}/${file}`)
}
rtn_funcs.scd = async function(user, repo, rfnc, file, rwrt) {
  try {
    const baseCDN = `https://cdn.jsdelivr.net/gh/${user}/${repo}@${rfnc}`;
    const fileContent = await getFileFromJsdelivr(user, repo, rfnc, file);
    const escapedContent = escapeHtml(fileContent);
    const file_extension = getFileExtension(file)
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>'${escapeHtml(file.split("/").pop())}' — SHDP Beautiful SCD</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css">
    <style>
        body { margin: 0; background: #181c20; color: #d7dbe0; font-family: \'Inter\', \'Segoe UI\', Arial, sans-serif; min-height: 100vh; display: flex; flex-direction: column; }
        header { background: #23272e; padding: 1rem 2rem; display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid #222; }
        header h1 { font-size: 1.1rem; margin: 0; font-weight: 600; letter-spacing: 0.03em; flex: 1; color: #ffe97a; }
        .badge { background: #32363e; color: #ffe97a; font-size: .85em; padding: 0.2em 0.7em; border-radius: 0.8em; margin-left: .5em; }
        .copy-btn { background: #ffd400; color: #181c20; border: none; border-radius: 0.5em; padding: 0.5em 1em; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .copy-btn:hover { background: #ffe97a ; }
        .gh-link { color: #ffe97a; margin-left: 1em; text-decoration: none; font-size: 1em; }
        main { flex: 1; width: 100vw; max-width: 100%; overflow-x: auto; padding: 1.5rem 0.5rem 2.5rem 0.5rem; box-sizing: border-box; display: flex; justify-content: center; }
        pre { background: #23272e; border-radius: 1em; box-shadow: 0 2px 24px #000a; font-size: 1em; margin: 0; overflow-x: auto; padding: 1.5em 1.5em 1.5em 0.9em; min-width: 0; width: 100%; max-width: 900px; }
        code.hljs { background: none; color: inherit; font-size: 1em; font-family: \'Fira Mono\', \'Consolas\', \'Menlo\', monospace; }
        @media (max-width: 700px) {
            main { padding: 0.8rem 0.2rem 2.5rem 0.2rem; }
            pre { font-size: 0.96em; padding: 1em 0.3em 1em 0.4em; }
            header { padding: .7rem 0.6rem; flex-direction: column; gap:0.5em;}
        }
    </style>
</head>
<body>
<header>
    <h1>${escapeHtml(file.split("/").pop())}<span class="badge">${getFileExtension(file, file)}</span></h1>
    <button class="copy-btn" onclick="copyCode()">Copy</button>
    <a class="gh-link" href="' . ${`https://github.com/${user}/${repo}/blob/${rfnc}/${file}`} . '" target="_blank" title="View on GitHub">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path fill="#ffe97a" d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.6.11.82-.26.82-.577
            0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.084-.729.084-.729
            1.205.085 1.84 1.238 1.84 1.238 1.07 1.832 2.807 1.303 3.492.997.108-.776.42-1.303.763-1.603-2.665-.304-5.466-1.335-5.466-5.934
            0-1.312.469-2.383 1.236-3.223-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.005-.404c1.02.005
            2.045.138 3.004.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.223
            0 4.61-2.805 5.628-5.475 5.927.43.372.814 1.103.814 2.222 0 1.606-.014 2.899-.014 3.293 0 .32.218.694.825.576
            C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12Z"/>
        </svg>
    </a>
</header>
<main>
    <pre><code id="code-block" class="hljs-${getFileExtension(file, 'auto')}">${escapeHtml(fileContent)}</code></pre>
</main>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
<script>
    hljs.highlightAll();
    function copyCode() {
        const code = document.getElementById("code-block").innerText;
        navigator.clipboard.writeText(code);
        const btn = document.querySelector(".copy-btn");
        btn.textContent = "Copied!";
        setTimeout(()=>{ btn.textContent = "Copy"; }, 1700);
    }
</script>
</body>
</html>
`;
    write(html);
    // Removed: rewriteRelativeUrls(baseCDN);
    loadExternals(baseCDN);
  } catch (error) {
    write(`<h1>Error loading file:</h1><pre>${error.message}</pre>`);
  }
}
rtn_funcs.ghr = function(user, repo, rfnc, file, rwrt) {
  redirectTo(`https://github.com/${user}/${repo}/blob/${rfnc}/${file}`)
}
rtn_funcs.ghs = function(user, repo, rfnc, file, rwrt) {
  redirectTo(`https://github.com/codespaces/new?repo=${user}/${repo}`)
}
rtn_funcs.stz = function(user, repo, rfnc, file, rwrt) {
  redirectTo(`https://stackblitz.com/github/${user}/${repo}`)
}
rtn_funcs.test = function(user, repo, rfnc, file, rwrt) {
  //Test Function
}

//some more helper functions

function loadExternals(baseCDN) {
  // Load <link> and <style> from head
  for (const el of document.head.querySelectorAll("link[rel='stylesheet'], style")) {
    document.head.appendChild(el.cloneNode(true));
  }
  
  // Load scripts (src or inline)
  for (const s of document.querySelectorAll("script")) {
    const newScript = document.createElement("script");
    if (s.src) {
      newScript.src = s.src;
    } else {
      newScript.textContent = s.textContent;
    }
    if (s.type) newScript.type = s.type;
    document.body.appendChild(newScript);
  }
}

function rewriteRelativeUrls(html, cdnRoot) {
  // 1. Rewrite src/href in <script>, <link>, <img>, <a>
  html = html.replace(
    /<(script|link|img|a)\b([^>]*)\b(src|href)=["']([^"']+)["']/gi,
    function (m, tag, attrs, attr, assetPath) {
      // Leave untouched if starts with http(s):, //, data:, mailto:, javascript:, tel:, or #
      if (/^(https?:|\/\/|data:|mailto:|javascript:|tel:|#)/i.test(assetPath)) return m;
      // For <a>, don't rewrite if just a hash
      if (tag.toLowerCase() === 'a' && /^#/.test(assetPath)) return m;
      // Normalize path: strip leading ./ and /
      let cleanPath = assetPath.replace(/^\.?\/*/, '');
      return `<${tag}${attrs} ${attr}="${cdnRoot.replace(/\/+$/, '')}/${cleanPath}"`;
    }
  );

  // 2. Rewrite CSS url(...) in <style> and inline style=
  html = html.replace(
    /url\((["']?)([^"')]+)\1\)/gi,
    function (m, quote, url) {
      if (/^(https?:|\/\/|data:|#)/i.test(url)) return m;
      let cleanUrl = url.replace(/^\.?\/*/, '');
      return `url("${cdnRoot.replace(/\/+$/, '')}/${cleanUrl}")`;
    }
  );

  return html;
}



(async () => {
  try {
    const user = getSearchParam("user"); //any github username
    const repo = getSearchParam("repo"); //any github repository
    const rfnc = getSearchParam("rfnc") || "latest"; //any git reference
    const file = getSearchParam("path") || "index.html"; //path to file
    const rwrt = getSearchParam("rwrt") || "true"; //rewrite base url? true or false
    const rtn = getSearchParam("rtn") || "pg"; //return type
    rtn_funcs[rtn](user, repo, rfnc, file, rwrt); //call appropriate function
  } catch (e) {
    print("❌ Error:", e.message);
  }
})();

//end

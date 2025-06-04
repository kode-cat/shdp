<?php
// SHDP: Shadow Deploy PHP API (Robust, Responsive, Modular)
// Author: kode-cat
// GitHub: https://github.com/kode-cat/shdp

// --- Parameter parsing ---
$username = $_GET['user'] ?? 'kode-cat';
$repo     = $_GET['repo'] ?? 'shdp';
$path     = $_GET['path'] ?? null;
$rfnc     = $_GET['rfnc'] ?? 'latest';
$rwrt     = $_GET['rwrt'] ?? null;
$rtn      = $_GET['rtn'] ?? null;

if (!$path && isset($_GET['pg'])) $path = $_GET['pg'];
if (!$path) $path = 'index.html';

$cdnRoot = "https://cdn.jsdelivr.net/gh/$username/$repo@$rfnc";
$fileUrl = "$cdnRoot/$path";
$ghUrl   = "https://github.com/$username/$repo/blob/$rfnc/$path";

// --- SCD HTML function (string concatenation style) ---
function echoSCDHtml($filename, $ext, $ghUrl, $code, $hljsLang = '') {
    $html = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>' . htmlspecialchars($filename) . ' — SHDP Beautiful SCD</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css">
    <style>
        body { margin: 0; background: #181c20; color: #d7dbe0; font-family: \'Inter\', \'Segoe UI\', Arial, sans-serif; min-height: 100vh; display: flex; flex-direction: column; }
        header { background: #23272e; padding: 1rem 2rem; display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid #222; }
        header h1 { font-size: 1.1rem; margin: 0; font-weight: 600; letter-spacing: 0.03em; flex: 1; color: #ffe97a; }
        .badge { background: #32363e; color: #ffe97a; font-size: .85em; padding: 0.2em 0.7em; border-radius: 0.8em; margin-left: .5em; }
        .copy-btn { background: #ffe97a; color: #181c20; border: none; border-radius: 0.5em; padding: 0.5em 1em; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .copy-btn:hover { background: #ffd400; }
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
    <h1>' . htmlspecialchars($filename) . ' <span class="badge">' . strtoupper($ext ?: 'TXT') . '</span></h1>
    <button class="copy-btn" onclick="copyCode()">Copy</button>
    <a class="gh-link" href="' . htmlspecialchars($ghUrl) . '" target="_blank" title="View on GitHub">
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
    <pre><code id="code-block" class="hljs ' . htmlspecialchars($hljsLang) . '">' . htmlspecialchars($code) . '</code></pre>
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
';
    echo $html;
}

// --- Return mode switch ---
switch ($rtn) {
    case 'raw':
        header("Location: $fileUrl");
        exit;

    case 'ghr':
        header("Location: $ghUrl");
        exit;

    case 'ghs':
        // Redirect to GitHub Dev (github.dev) for online editor
        // GitHub dev works with format: https://github.dev/user/repo/blob/ref/path
        $ghDevUrl = "https://github.dev/$username/$repo/blob/$rfnc/$path";
        header("Location: $ghDevUrl");
        exit;

    case 'stz':
        header("Location: https://stackblitz.com/github/$username/$repo");
        exit;

    case 'scd':
        $code = @file_get_contents($fileUrl);
        if ($code === false) {
            http_response_code(404);
            echo "<h1>Not Found</h1><p>Failed to fetch $path from $fileUrl</p>";
            exit;
        }
        $filename = basename($path);
        $ext = pathinfo($filename, PATHINFO_EXTENSION);
        $langMap = [
            'php'=>'php','js'=>'javascript','ts'=>'typescript','py'=>'python','css'=>'css','html'=>'xml','json'=>'json','md'=>'markdown',
            'sh'=>'bash','c'=>'c','cpp'=>'cpp','h'=>'cpp','java'=>'java','go'=>'go','rs'=>'rust','dart'=>'dart','cs'=>'csharp','rb'=>'ruby'
        ];
        $hljsLang = $langMap[strtolower($ext)] ?? '';
        header("Content-Type: text/html; charset=UTF-8");
        echoSCDHtml($filename, $ext, $ghUrl, $code, $hljsLang);
        exit;
}

// Fallback: normal HTML serving (pg or default)
$html = @file_get_contents($fileUrl);
if ($html === false) {
    http_response_code(500);
    echo "Failed to fetch $path from $fileUrl";
    exit;
}

// Only rewrite if likely HTML
$isHtml = false;
if (preg_match('/\.html?$/i', $path) || preg_match('/^\s*<(!doctype|html|head|body|meta|title|link|script|style|div|span|h1|h2|h3|p|a|img|form)\b/i', $html)) {
    $isHtml = true;
}

$doRewrite = true;
if ($rwrt === 'false' || $rwrt === '0') $doRewrite = false;

if ($doRewrite && $isHtml) {
    // Rewrite src/href in script, link, img, a
    $html = preg_replace_callback(
        '/<(script|link|img|a)\b([^>]*)\b(src|href)=["\']([^"\']+)["\']/i',
        function ($m) use ($cdnRoot) {
            $tag = $m[1];
            $attrs = $m[2];
            $attr = $m[3];
            $assetPath = $m[4];
            // Edge cases: leave untouched if:
            // - starts with http(s):, //, data:, mailto:, javascript:, tel:, or #
            if (preg_match('/^(https?:|\/\/|data:|mailto:|javascript:|tel:|#)/i', $assetPath)) return $m[0];
            // For anchor tags, only rewrite if not a pure hash or hash+query (e.g. "#foo" or "?x=1#y")
            if ($tag === 'a') {
                // If it's just a hash or starts with hash, don't rewrite (edge case)
                if (preg_match('/^#/', $assetPath)) return $m[0];
            }
            return "<$tag$attrs $attr=\"" . rtrim($cdnRoot, '/') . '/' . ltrim($assetPath, './') . '"';
        }, $html);

    // Rewrite CSS url(...) in <style> blocks and inline style attributes
    $html = preg_replace_callback(
        '/url\((["\']?)([^"\')]+)\1\)/i',
        function ($m) use ($cdnRoot) {
            $url = $m[2];
            // Don't rewrite if url is absolute, data, or hash
            if (preg_match('/^(https?:|data:|\/\/|#)/i', $url)) return $m[0];
            return 'url("' . rtrim($cdnRoot, '/') . '/' . ltrim($url, './') . '")';
        }, $html);
}

header("Content-Type: text/html; charset=UTF-8");
echo $html;

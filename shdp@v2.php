<?php
// SHDP: Shadow Deploy PHP API
// Author: kode-cat
// GitHub: https://github.com/kode-cat/shdp
// Description: A fast GitHub content loader API with return mode support and gzip optimization

header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=UTF-8");
ob_start("ob_gzhandler");

// 1. Parse GET parameters
$user   = $_GET['user'] ?? 'kode-cat';
$repo   = $_GET['repo'] ?? 'shdp';
$path   = $_GET['path'] ?? 'index.html';
$return = $_GET['rtn'] ?? 'pg'; // pg, raw, scd, ghr, ghs, stz, vsg
$mode   = $_GET['rwrt'] ?? '1';    // m=1 means only HTML, no scripts/css

// 2. Static tag or latest commit
$latest = 'latest';

// 3. Construct base URLs
$baseURL    = "https://cdn.jsdelivr.net/gh/$user/$repo@$latest/$path";
$ghUrl      = "https://github.com/$user/$repo/blob/main/$path";

// 4. Route by return type
switch ($return) {
    case 'pg': // Full page
        $html = @file_get_contents($baseURL);
        if (!$html) {
            showError("Failed to fetch: $baseURL");
            exit;
        }

        // Raw HTML mode
        if ($mode == '0') {
            echo $html;
            exit;
        }

        // Rewrite relative resources to CDN
        $html = preg_replace_callback('/<(script|link|img)[^>]+(src|href)=["\']([^"\']+)["\']/i', function ($matches) use ($user, $repo) {
            $tag = $matches[1];
            $attr = $matches[2];
            $assetPath = $matches[3];
            if (preg_match('/^https?:\/\//', $assetPath)) return $matches[0];
            return "<$tag $attr=\"https://cdn.jsdelivr.net/gh/$user/$repo@latest/$assetPath\"";
        }, $html);

        echo $html;
        break;

    case 'raw': // Raw file content
        header("Content-Type: text/plain");
        readfile($baseURL);
        break;

    case 'scd': // Syntax-highlighted code
        $code = @file_get_contents($baseURL);
        if (!$code) {
            showError("Code not found: $baseURL");
            exit;
        }
        highlightCode($code, $path);
        break;

    case 'ghr': // GitHub redirect to file
        header("Location: $ghUrl");
        exit;

    case 'ghs': // GitHub Pages
        header("Location: https://$user.github.io/$repo/$path");
        exit;

    case 'stz': // StackBlitz URL
        header("Location: https://stackblitz.com/github/$user/$repo");
        exit;

    case 'vsg': // view-source on Google
        header("Location: view-source:$baseURL");
        exit;

    default:
        showError("Invalid rtn value: $return");
        break;
}

// Show styled error
function showError($msg) {
    echo "<details style='border:2px solid red;padding:1em;margin:2em;font-family:monospace;background:#ffe6e6'>";
    echo "<summary style='color:red;font-weight:bold;font-size:1.1em;'>SHDP Error</summary>";
    echo "<pre style='overflow:auto;'>$msg</pre>";
    echo "</details>";
}

// Syntax highlighter using highlight.js
function highlightCode($code, $filename) {
    echo "<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css'>";
    echo "<script src='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js'></script>";
    echo "<pre><code class='hljs'>" . htmlspecialchars($code) . "</code></pre>";
    echo "<script>hljs.highlightAll();</script>";
}
?>

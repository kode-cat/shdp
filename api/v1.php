<?php
// Config: GitHub username and repo
$username = $_GET['user'] ?? 'kode-cat';
$repo     = $_GET['repo'] ?? 'shdp';
$cdnRoot  = "https://cdn.jsdelivr.net/gh/$username/$repo@latest";

// Fetch index.html
$indexUrl = "$cdnRoot/index.html";
$html = @file_get_contents($indexUrl);
if (!$html) {
    http_response_code(500);
    echo "Failed to fetch index.html from $indexUrl";
    exit;
}

// Rewrite relative paths in HTML
function rewritePaths($html, $cdnRoot) {
    // Rewrite <script src="">
    $html = preg_replace_callback('/<script\s[^>]*src=["\']([^"\']+)["\']/i', function ($m) use ($cdnRoot) {
        $url = resolvePath($cdnRoot, $m[1]);
        return str_replace($m[1], $url, $m[0]);
    }, $html);

    // Rewrite <link href="">
    $html = preg_replace_callback('/<link\s[^>]*href=["\']([^"\']+)["\']/i', function ($m) use ($cdnRoot) {
        $url = resolvePath($cdnRoot, $m[1]);
        return str_replace($m[1], $url, $m[0]);
    }, $html);

    // Rewrite <img src="">
    $html = preg_replace_callback('/<img\s[^>]*src=["\']([^"\']+)["\']/i', function ($m) use ($cdnRoot) {
        $url = resolvePath($cdnRoot, $m[1]);
        return str_replace($m[1], $url, $m[0]);
    }, $html);

    return $html;
}

// Handle relative paths
function resolvePath($base, $path) {
    if (preg_match('/^(https?:)?\/\//', $path) || strpos($path, 'data:') === 0) {
        return $path; // Absolute path or data URI
    }
    return rtrim($base, '/') . '/' . ltrim($path, './');
}

// Output final HTML
header("Content-Type: text/html");
echo rewritePaths($html, $cdnRoot);

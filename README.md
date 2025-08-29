# **SHDP**

**SHDP** (Static HTML Deploy Preview) is a lightweight tool for quickly viewing changes made to static HTML websites hosted on GitHub. It works by scraping and previewing files from any public GitHub repository, letting you see how a site looks at any commit, branch, or PR—instantly.

[![Try it out](https://img.shields.io/badge/Try%20it%20out-CF96FD?style=for-the-badge)](https://shdp.vercel.app)

---

### ⚠️ Heads Up: Web Scraper Tool

- **SHDP is a web scraper.** Only use it on websites or repositories you own or have permission to preview.
- **Don’t abuse it.** Scraping too much or targeting sites you don’t control can get you rate-limited or banned.
- **No guarantees.** This tool comes as-is—use at your own risk!

---

## What It Does

- Fetches and rewrites static HTML from GitHub repositories for instant preview.
- Lets you view any file (HTML, JS, CSS, etc.) from any branch or commit.
- Friendly web interface for quick, direct peeks at your site.
- Does **not** display a diff of changes—it's for visual preview only.

---

## Usage

You can use SHDP by constructing URLs to the `/api/index.php` endpoint with various parameters:

```
https://your-shdp-instance/api/index.php?user=USERNAME&repo=REPO&path=FILEPATH&rfnc=BRANCH_OR_COMMIT&rtn=MODE
```

**Parameters:**

- `user` — GitHub username/organization (defaults to `kode-cat`)
- `repo` — Repository name (defaults to `shdp`)
- `path` — File path to preview (defaults to `index.html`)
- `rfnc` — Branch name, tag, or commit SHA (defaults to `latest`)
- `rtn` — Return mode (see below)
- `rwrt` — Rewrite asset URLs for CDN preview (`1`/`0`, default: `1`)

**Return Modes (`rtn`):**
- `raw` - Redirect to the raw file on jsDelivr CDN
- `ghr` - Redirect to the file on GitHub
- `ghs` - Open in github.dev (online code editor)
- `stz` - Open in StackBlitz for live coding
- `scd` - Render as highlighted source code in a pretty viewer
- *(No rtn or unknown rtn)* - Render the file (HTML, CSS, JS, etc) for browser preview (with asset rewriting if enabled)

**Examples:**

- Preview `index.html` from the `main` branch:
  ```
  /api/index.php?user=octocat&repo=example-site&path=index.html&rfnc=main
  ```
- View the raw `style.css` from a specific commit:
  ```
  /api/index.php?user=octocat&repo=example-site&path=style.css&rfnc=abcdef123&rtn=raw
  ```
- Show a highlighted source code preview:
  ```
  /api/index.php?user=octocat&repo=example-site&path=script.js&rfnc=main&rtn=scd
  ```

---

## Tech Stack

- **PHP** (API backend)
- **JavaScript, HTML, CSS** (frontend rendering)

---

## API Files

The main API logic & other versions can be found in:
- `api/index.php` — Handles parameter parsing, fetching files, rewriting assets, and rendering previews or redirects.

---

## Contributing

Feel free to open issues or pull requests if you have ideas, spot bugs, or want to make SHDP better!

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Disclaimer

SHDP is for legit, educational, and personal use only. Always get permission before scraping someone else’s site or repo.

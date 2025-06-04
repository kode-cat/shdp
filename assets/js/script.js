document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const apiForm = document.getElementById('api-form');
    const usernameInput = document.getElementById('username');
    const repositoryInput = document.getElementById('repository');
    const pathInput = document.getElementById('path');
    const returnModeSelect = document.getElementById('return-mode');
    const displayModeSelect = document.getElementById('display-mode');
    const generateBtn = document.getElementById('generate-btn');
    const openBtn = document.getElementById('open-btn');
    const resultUrl = document.getElementById('result-url');
    const copyBtn = document.getElementById('copy-btn');
    const previewContainer = document.getElementById('preview-container');
    const tryButtons = document.querySelectorAll('.try-btn');

    // Generate API URL based on form values
    function generateApiUrl() {
        const username = usernameInput.value.trim() || 'kode-cat';
        const repository = repositoryInput.value.trim() || 'shdp';
        const path = pathInput.value.trim() || 'index.html';
        const returnMode = returnModeSelect.value;
        const displayMode = displayModeSelect.value;
        const version = document.getElementById('version')?.value.trim() || 'latest';
        //const cacheTime = document.getElementById('cache-time')?.value || '24';
        //const noCache = document.getElementById('no-cache')?.checked || false;

        // Construct the URL
        const url = new URL('/api', window.location.origin);
        url.searchParams.append('user', username);
        url.searchParams.append('repo', repository);
        url.searchParams.append('rfnc', version);
        url.searchParams.append('path', path);
        url.searchParams.append('rwrt', displayMode);
        url.searchParams.append('rtn', returnMode);

        return url.toString();
    }

    // Update preview content
    function updatePreview(url) {
        // Clear current preview
        previewContainer.innerHTML = '';

        try {
            // Add error handling for markdown
            if (url.toLowerCase().endsWith('.md') && !window.marked) {
                throw new Error('Markdown parser not loaded');
            }
        } catch (error) {
            console.error("Error updating preview:", error);
            previewContainer.innerHTML = `<p>Error: ${error.message}</p>`;
            return;
        }


        // Check return mode to determine preview method
        const returnMode = returnModeSelect.value;

        if (['ghr', 'ghs', 'stz'].includes(returnMode)) {
            // For redirect modes, just show a message
            previewContainer.innerHTML = `
                <div class="placeholder">
                    <p>This return mode will redirect to an external URL.</p>
                    <p>Use the "Open in New Tab" button to test it.</p>
                </div>
            `;
        } else {
            // For content modes, use an iframe
            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.title = 'SHDP Preview';
            iframe.setAttribute('loading', 'lazy');
            previewContainer.appendChild(iframe);
        }
    }

    // Form submission handler
    apiForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const url = generateApiUrl();
        resultUrl.textContent = url;
        updatePreview(url);
    });

    // Open in new tab button
    openBtn.addEventListener('click', function() {
        const url = generateApiUrl();
        window.open(url, '_blank');
    });

    // Copy URL button
    copyBtn.addEventListener('click', function() {
        const urlText = resultUrl.textContent;
        if (urlText) {
            navigator.clipboard.writeText(urlText)
                .then(() => {
                    // Visual feedback for copy success
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                    alert('Failed to copy the URL');
                });
        }
    });

    // Example "Try it" buttons
    tryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get data attributes
            const username = this.getAttribute('data-u');
            const repository = this.getAttribute('data-r');
            const path = this.getAttribute('data-p');
            const returnMode = this.getAttribute('data-rtn');
            const displayMode = this.getAttribute('data-m');

            // Update form values
            usernameInput.value = username;
            repositoryInput.value = repository;
            pathInput.value = path;
            returnModeSelect.value = returnMode;
            displayModeSelect.value = displayMode;

            // Generate URL and update preview
            const url = generateApiUrl();
            resultUrl.textContent = url;
            updatePreview(url);

            // Scroll to the preview section
            document.querySelector('.demo').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Initial URL generation on page load
    generateBtn.click();
});

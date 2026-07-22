const form = document.getElementById('shorten-form');
const submitBtn = document.getElementById('submit-btn');
const errorBox = document.getElementById('error');
const resultBox = document.getElementById('result');
const shortLinkEl = document.getElementById('short-link');
const copyBtn = document.getElementById('copy-btn');
const expiryMeta = document.getElementById('expiry-meta');
const statsLink = document.getElementById('stats-link');

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.add('visible');
}

function clearError() {
    errorBox.textContent = '';
    errorBox.classList.remove('visible');
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();
    resultBox.classList.remove('visible');

    const longUrl = document.getElementById('longUrl').value.trim();
    const customAlias = document.getElementById('customAlias').value.trim();
    const expiresInDays = document.getElementById('expiresInDays').value;

    const payload = { longUrl };
    if (customAlias) payload.customAlias = customAlias;
    if (expiresInDays) payload.expiresInDays = Number(expiresInDays);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Shortening…';

    try {
      const res = await fetch('/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      shortLinkEl.textContent = data.shortUrl;
      expiryMeta.textContent = data.expiresAt
        ? `Expires ${new Date(data.expiresAt).toLocaleDateString()}`
        : 'Never expires';
      statsLink.href = `/api/urls/${data.shortCode}/stats`;
      resultBox.classList.add('visible');
      form.reset();
    } catch (err) {
      showError(err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Shorten';
    }
});

copyBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(shortLinkEl.textContent);
    copyBtn.textContent = 'Copied';
    setTimeout(() => (copyBtn.textContent = 'Copy'), 1500);
});
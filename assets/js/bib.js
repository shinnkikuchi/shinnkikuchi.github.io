(function () {
  function escapeHtml(str) {
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function toggleBib(e, boxId) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    const link = e && e.currentTarget ? e.currentTarget : null;
    const url = link ? link.getAttribute("href") : null;
    const box = document.getElementById(boxId);
    if (!url || !box) return false;

    if (box.dataset.loaded !== "1") {
      const resp = await fetch(url, { cache: "force-cache" });
      const text = await resp.text();

      box.innerHTML = `
        <div class="bib-actions">
          <a href="#" onclick="return window.copyBib('${boxId}');">[Copy]</a>
        </div>
        <pre><code>${escapeHtml(text)}</code></pre>
      `;
      box.dataset.loaded = "1";
    }

    box.classList.toggle("open");
    return false;
  }

  async function copyBib(boxId) {
    const box = document.getElementById(boxId);
    const code = box ? box.querySelector("code") : null;
    const text = code ? code.innerText : "";
    if (!text) return false;

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Fallback: select text for manual copy
      const range = document.createRange();
      range.selectNodeContents(code);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    return false;
  }

  // Expose for inline onclick handlers
  window.toggleBib = toggleBib;
  window.copyBib = copyBib;
})();

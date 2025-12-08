const articles = [
    {
        title: "THE THIRD LEAK",
        date: "09 DECEMBER 2025",
        file: "articles/third-leak.html",
        preview: "1,088,000 unaccompanied minors vanished from public records after being handed to private “sponsors” with no vetting. The real HHS spreadsheets, delivered straight from the contractor portal..."
    },
    {
        title: "THE SECOND LEAK",
        date: "08 DECEMBER 2025",
        file: "articles/second-leak.html",
        preview: "312,000 got-aways. 11,000 watchlist checkboxes quietly deleted. The raw CBP numbers before they scrubbed them..."
    },
    {
        title: "THE FIRST LEAK",
        date: "06 DECEMBER 2025",
        file: "articles/the-first-leak.html",
        preview: "The algorithm doesn’t just watch anymore. It owns the prison, the guards, and the electric fence..."
    }
];

const list = document.getElementById('article-list');
const searchInput = document.getElementById('search-box');

const fullTexts = {};

async function loadArticleText(file) {
    if (fullTexts[file]) return fullTexts[file];
    try {
        const res = await fetch(file);
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const text = (doc.querySelector('.full')?.textContent || '').toLowerCase();
        fullTexts[file] = text;
        return text;
    } catch {
        return '';
    }
}

function render(results = articles) {
    list.innerHTML = '';
    if (results.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#0a8;">No dispatches found.</p>';
        return;
    }
    results.forEach(article => {
        const li = document.createElement('li');
        li.className = 'article';
        li.innerHTML = `
            <h3><a href="${article.file}">${article.title}</a></h3>
            <div class="date">${article.date}</div>
            <p class="preview">${article.preview}</p>
            <a href="${article.file}">Read the dispatch →</a>
        `;
        list.appendChild(li);
    });
}

searchInput.addEventListener('input', async () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) { render(articles); return; }

    const matches = [];
    for (const article of articles) {
        if (article.title.toLowerCase().includes(query) || 
            article.preview.toLowerCase().includes(query) ||
            article.date.includes(query)) {
            matches.push(article); continue;
        }
        const body = await loadArticleText(article.file);
        if (body.includes(query)) matches.push(article);
    }
    render(matches);
});

render(articles);

const body = document.body;
const form = document.querySelector('#issue-form');
const issuesList = document.querySelector('#issues-list');
const clearButton = document.querySelector('#clear-history');
const themeToggle = document.querySelector('#theme-toggle');
const issueTemplate = document.querySelector('#issue-item-template');

const STORAGE_KEYS = {
  issues: 'residencial-issues',
  theme: 'residencial-theme',
};

const loadIssues = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.issues) || '[]');
const saveIssues = (issues) => localStorage.setItem(STORAGE_KEYS.issues, JSON.stringify(issues));

const renderIssues = () => {
  const issues = loadIssues();
  issuesList.innerHTML = '';

  if (!issues.length) {
    issuesList.innerHTML = '<li class="issue-item"><p class="issue-text">Todavía no hay incidencias registradas.</p></li>';
    return;
  }

  issues.forEach((item) => {
    const node = issueTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector('.issue-topline').textContent = `${item.name} · ID ${item.id} · Piso ${item.floor}`;
    node.querySelector('.issue-text').textContent = item.issue;
    issuesList.append(node);
  });
};

const applyTheme = (theme) => {
  const isLight = theme === 'light';
  body.dataset.theme = isLight ? 'light' : 'dark';
  themeToggle.textContent = isLight ? 'Cambiar a oscuro' : 'Cambiar a claro';
};

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const payload = {
    name: document.querySelector('#tenant-name').value.trim(),
    id: document.querySelector('#tenant-id').value.trim(),
    floor: document.querySelector('#tenant-floor').value.trim(),
    issue: document.querySelector('#tenant-issue').value.trim(),
  };

  const issues = loadIssues();
  issues.unshift(payload);
  saveIssues(issues.slice(0, 8));
  renderIssues();
  form.reset();
});

clearButton.addEventListener('click', () => {
  saveIssues([]);
  renderIssues();
});

themeToggle.addEventListener('click', () => {
  const nextTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
  applyTheme(nextTheme);
});

applyTheme(localStorage.getItem(STORAGE_KEYS.theme) || 'dark');
renderIssues();

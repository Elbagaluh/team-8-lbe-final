const navigation = document.querySelectorAll('[data-page]');
const pages = document.querySelectorAll('main > section');

function showPage() {
  const page = window.location.hash === '#projects' ? 'projects' : 'about';
  pages.forEach(section => { section.hidden = section.id !== page; });
  navigation.forEach(link => {
    if (link.dataset.page === page) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.title = `${page === 'projects' ? 'Projects' : 'Portfolio'} | Muhammad Fauzta Putra Kavie`;
}

window.addEventListener('hashchange', showPage);
document.getElementById('year').textContent = new Date().getFullYear();
showPage();

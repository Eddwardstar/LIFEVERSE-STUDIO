(() => {
  const valid = ['home','games','studios','downloads','updates','websites','about'];
  const pages = [...document.querySelectorAll('.page')];
  const nav = document.getElementById('mainNav');
  const menuButton = document.getElementById('menuToggle');
  const toast = document.getElementById('toast');
  let toastTimer;

  function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  // Navegação por hash: cada seção funciona como uma página e aceita links diretos.
  function navigate() {
    const requested = location.hash.slice(1) || 'home';
    const route = valid.includes(requested) ? requested : 'not-found';
    pages.forEach(page => page.classList.toggle('active', page.id === route));
    document.querySelectorAll('nav a').forEach(link =>
      link.classList.toggle('active', link.getAttribute('href') === '#' + route)
    );
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    window.scrollTo({top: 0, behavior: 'smooth'});
    document.title = (route === 'home' ? 'Portal Oficial' : route) + ' | LIFEVERSE STUDIOS';
  }

  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = anchor.getAttribute('href').slice(1);
    if (!target) return;
    event.preventDefault();
    if (location.hash !== '#' + target) history.pushState({}, '', '#' + target);
    navigate();
  });
  window.addEventListener('popstate', navigate);
  window.addEventListener('hashchange', navigate);

  // Menu mobile.
  menuButton.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(opened));
  });

  // Pesquisa e filtros dos jogos.
  const search = document.getElementById('gamesSearch');
  const cards = [...document.querySelectorAll('#gamesGrid .product')];
  const empty = document.getElementById('gamesEmpty');
  let filter = 'all';
  function updateGames() {
    const query = (search.value || '').toLocaleLowerCase('pt-BR').trim();
    let count = 0;
    cards.forEach(card => {
      const text = (card.dataset.search + ' ' + card.textContent).toLocaleLowerCase('pt-BR');
      const show = text.includes(query) && (filter === 'all' || card.dataset.status === filter);
      card.hidden = !show;
      if (show) count++;
    });
    empty.hidden = count !== 0;
  }
  search.addEventListener('input', updateGames);
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      filter = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('active', item === button));
      updateGames();
    });
  });

  // Mensagem reutilizável para recursos que ainda não foram publicados.
  document.querySelectorAll('[data-coming-soon]').forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      notify('Este recurso será disponibilizado em uma próxima atualização.');
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();
  navigate();
})();
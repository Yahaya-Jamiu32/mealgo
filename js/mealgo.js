(() => {
  const IMG = 'assets/images/projects/mealgo/';
  const PH = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#F8EFE4"/><text x="200" y="158" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#6B6058">MealGo</text></svg>');
  const restaurants = [
    { id: 'urban', name: 'Urban Bites', cuisine: 'Modern American', rating: 4.8, time: '25–35 min', price: '$$', cat: 'burgers', img: '02-MealGo-Restaurant-burger.jpg' },
    { id: 'spice', name: 'Spice House', cuisine: 'Asian Fusion', rating: 4.7, time: '30–40 min', price: '$$', cat: 'asian', img: '02-MealGo-Restaurant-sushi.jpg' },
    { id: 'green', name: 'Green Bowl', cuisine: 'Healthy', rating: 4.9, time: '20–30 min', price: '$', cat: 'healthy', img: '02-MealGo-Restaurant-healthy.jpg' },
    { id: 'lab', name: 'The Burger Lab', cuisine: 'Burgers', rating: 4.8, time: '25–35 min', price: '$$', cat: 'burgers', img: '01-MealGo-Hero.jpg' }
  ];
  const categories = [
    ['burgers', 'Burgers', '02-MealGo-Restaurant-burger.jpg'], ['pizza', 'Pizza', '02-MealGo-Restaurant-pizza.jpg'],
    ['asian', 'Asian', '02-MealGo-Restaurant-sushi.jpg'], ['healthy', 'Healthy', '02-MealGo-Restaurant-healthy.jpg'],
    ['desserts', 'Desserts', '02-MealGo-Restaurant-dessert.jpg'], ['drinks', 'Drinks', '02-MealGo-Drink.jpg']
  ];
  const meals = [
    { id: 'm1', name: 'Classic Smash Burger', desc: 'Double beef patty, cheddar, pickles and house sauce.', price: 11.5, rating: 4.8, cat: 'burgers', img: '02-MealGo-Restaurant-burger.jpg' },
    { id: 'm2', name: 'Truffle Mushroom Pizza', desc: 'Wood-fired crust, roasted mushrooms and truffle oil.', price: 14, rating: 4.7, cat: 'pizza', img: '02-MealGo-Restaurant-pizza.jpg' },
    { id: 'm3', name: 'Spicy Chicken Bowl', desc: 'Grilled chicken, rice, crisp greens and chili glaze.', price: 12.5, rating: 4.9, cat: 'healthy', img: '03b-MealGo-Rice-Bowl.jpg' },
    { id: 'm4', name: 'Creamy Pasta Alfredo', desc: 'Fettuccine in a parmesan cream sauce with herbs.', price: 13, rating: 4.6, cat: 'pizza', img: '03-MealGo-Featured-Meal.jpg' },
    { id: 'm5', name: 'Chocolate Lava Cake', desc: 'Warm dark chocolate cake with a molten centre.', price: 7.5, rating: 4.8, cat: 'desserts', img: '02-MealGo-Restaurant-dessert.jpg' },
    { id: 'm6', name: 'Fresh Mango Cooler', desc: 'Cold-pressed mango and lime over crushed ice.', price: 5, rating: 4.5, cat: 'drinks', img: '02-MealGo-Drink.jpg' }
  ];
  const $ = (s) => document.querySelector(s);
  const money = (n) => '$' + n.toFixed(2);
  const state = { cat: '', q: '' };
  const cart = new Map();
  const toast = (m) => { $('#toastMsg').textContent = m; bootstrap.Toast.getOrCreateInstance($('#toast'), { delay: 2500 }).show(); };
  const img = (f, alt, extra = '') => `<img src="${IMG + f}" alt="${alt}" ${extra} onerror="this.onerror=null;this.src='${PH}'">`;
  const match = (o, fields) => (!state.cat || o.cat === state.cat) && (!state.q || fields.some((f) => String(o[f]).toLowerCase().includes(state.q)));

  function renderCats() {
    $('#catGrid').innerHTML = categories.map(([id, n, f]) =>
      `<div class="col-4 col-md-2"><button class="cat" data-cat="${id}" aria-pressed="${state.cat === id}">${img(f, '', 'width="72" height="72" loading="lazy"')}${n}</button></div>`).join('');
  }
  function render() {
    const r = restaurants.filter((x) => match(x, ['name', 'cuisine', 'cat']));
    const m = meals.filter((x) => match(x, ['name', 'desc', 'cat']));
    $('#restGrid').innerHTML = r.map((x) => `<div class="col-sm-6 col-lg-3"><article class="mg-card item">${img(x.img, x.name + ' food', 'loading="lazy" width="560" height="392"')}
      <div class="body"><div class="d-flex justify-content-between align-items-start gap-2"><h3 class="m-0">${x.name}</h3><span class="badge-mg">${x.price}</span></div>
      <div class="meta"><span>${x.cuisine}</span></div><div class="meta"><span class="rate"><i class="bi bi-star-fill"></i> ${x.rating}</span><span><i class="bi bi-clock"></i> ${x.time}</span></div>
      <div class="foot"><button class="btn btn-mg-ghost btn-sm-mg w-100" data-menu="${x.cat}" data-name="${x.name}">View Menu</button></div></div></article></div>`).join('');
    $('#mealGrid').innerHTML = m.map((x) => `<div class="col-sm-6 col-lg-4"><article class="mg-card item">${img(x.img, x.name, 'loading="lazy" width="560" height="420"')}
      <div class="body"><div class="d-flex justify-content-between gap-2"><h3 class="m-0">${x.name}</h3><span class="rate"><i class="bi bi-star-fill"></i> ${x.rating}</span></div>
      <p>${x.desc}</p><div class="foot"><span class="price">${money(x.price)}</span><button class="btn btn-mg btn-sm-mg" data-add="${x.id}"><i class="bi bi-bag-plus me-2"></i>Add to Cart</button></div></div></article></div>`).join('');
    const label = [state.cat && categories.find((c) => c[0] === state.cat)[1], state.q && `“${state.q}”`].filter(Boolean).join(' · ');
    $('#filterNote').textContent = label ? `Showing results for ${label}.` : 'Showing all meals.';
    $('#clearFilter').classList.toggle('d-none', !label);
    const msg = 'Try another search or clear the filters.';
    $('#restEmpty').classList.toggle('d-none', !!r.length); $('#restEmpty').textContent = 'No restaurants match yet. ' + (m.length ? 'See matching meals below.' : msg);
    $('#mealEmpty').classList.toggle('d-none', !!m.length); $('#mealEmpty').textContent = 'No meals match. ' + msg;
    document.querySelectorAll('.cat').forEach((b) => b.setAttribute('aria-pressed', b.dataset.cat === state.cat));
    return { r, m };
  }
  const go = (id) => document.getElementById(id).scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });

  function renderCart() {
    let total = 0, count = 0;
    $('#cartList').innerHTML = [...cart].map(([id, q]) => {
      const m = meals.find((x) => x.id === id); total += m.price * q; count += q;
      return `<li class="cart-row">${img(m.img, '')}<div><strong>${m.name}</strong><div class="small text-muted">${money(m.price)} each</div>
        <div class="qty"><button data-dec="${id}" aria-label="Decrease ${m.name}">−</button><span aria-live="polite">${q}</span><button data-inc="${id}" aria-label="Increase ${m.name}">+</button></div></div>
        <div class="text-end"><div class="fw-bold">${money(m.price * q)}</div><button class="btn btn-link btn-sm text-danger p-0 min-h-0" data-rm="${id}" aria-label="Remove ${m.name}">Remove</button></div></li>`;
    }).join('') || '<li class="empty m-0">Your cart is empty. Add a meal to get started.</li>';
    $('#cartTotal').textContent = money(total); $('#cartCount').textContent = count; $('#checkout').disabled = !count;
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    const d = t.dataset;
    if (d.cat) { state.cat = state.cat === d.cat ? '' : d.cat; render(); if (state.cat) go('meals'); }
    else if (d.menu) { state.cat = d.menu; state.q = ''; $('#q').value = ''; render(); go('meals'); toast(`Showing the ${d.name} style menu`); }
    else if (d.add) { cart.set(d.add, (cart.get(d.add) || 0) + 1); renderCart(); toast('Added to cart'); }
    else if (d.inc) { cart.set(d.inc, cart.get(d.inc) + 1); renderCart(); }
    else if (d.dec) { const q = cart.get(d.dec) - 1; q ? cart.set(d.dec, q) : cart.delete(d.dec); renderCart(); }
    else if (d.rm) { cart.delete(d.rm); renderCart(); }
    else if (t.id === 'clearFilter') { state.cat = ''; state.q = ''; $('#q').value = ''; render(); }
    else if (t.id === 'checkout') { cart.clear(); renderCart(); $('#orderOk').classList.remove('d-none'); }
  });
  $('#cart').addEventListener('show.bs.offcanvas', () => $('#orderOk').classList.add('d-none'));
  document.querySelectorAll('#nav .nav-link,#nav .btn').forEach((a) => a.addEventListener('click', () => bootstrap.Collapse.getInstance($('#nav'))?.hide()));

  $('#searchForm').addEventListener('submit', (e) => {
    e.preventDefault(); state.q = $('#q').value.trim().toLowerCase(); state.cat = '';
    const { r } = render(); go(r.length ? 'restaurants' : 'meals');
  });

  const validate = (form, ok) => form.addEventListener('submit', (e) => {
    e.preventDefault(); form.classList.add('was-validated');
    if (form.checkValidity()) ok(form);
  });
  validate($('#contactForm'), (f) => { $('#contactOk').classList.remove('d-none'); f.reset(); f.classList.remove('was-validated'); });
  validate($('#loginForm'), (f) => {
    $('#loginOk').classList.remove('d-none');
    setTimeout(() => { bootstrap.Modal.getInstance($('#login')).hide(); f.reset(); f.classList.remove('was-validated'); $('#loginOk').classList.add('d-none'); toast('Logged in (demo)'); }, 900);
  });

  renderCats(); render(); renderCart();
})();

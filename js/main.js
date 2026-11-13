// Три товара учебного каталога. С сервера данные не загружаются.
const products = {
  'product-1': { name: 'Товар 1', price: 1000, badge: 'Новинка', badgeClass: 'bg-success' },
  'product-2': { name: 'Товар 2', price: 1500, badge: 'Хит', badgeClass: 'bg-warning text-dark' },
  'product-3': { name: 'Товар 3', price: 2000, badge: 'Скидка', badgeClass: 'bg-danger' }
};

// Поиск, фильтр по цене и сортировка работают вместе.
const filterForm = document.getElementById('catalog-filters');

if (filterForm) {
  const search = document.getElementById('catalog-search');
  const priceFilter = document.getElementById('catalog-price');
  const sort = document.getElementById('catalog-sort');
  const grid = document.getElementById('catalog-products');
  const cards = Array.from(grid.querySelectorAll('[data-catalog-product]'));

  function updateCatalog() {
    const query = search.value.trim().toLowerCase();
    let count = 0;

    cards.sort(function (a, b) {
      if (sort.value === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price);
      if (sort.value === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
      return Number(a.dataset.number) - Number(b.dataset.number);
    });

    cards.forEach(function (card) {
      const price = Number(card.dataset.price);
      const matchesName = card.dataset.name.toLowerCase().includes(query);
      const matchesPrice = priceFilter.value === 'all'
        || (priceFilter.value === 'budget' && price <= 1500)
        || (priceFilter.value === 'expensive' && price > 1500);
      const visible = matchesName && matchesPrice;

      card.classList.toggle('d-none', !visible);
      grid.append(card);
      if (visible) count++;
    });

    document.getElementById('catalog-count').textContent = 'Найдено товаров: ' + count;
    document.getElementById('catalog-empty').classList.toggle('d-none', count > 0);
  }

  filterForm.addEventListener('input', updateCatalog);
  filterForm.addEventListener('change', updateCatalog);
  filterForm.addEventListener('submit', function (event) { event.preventDefault(); });
  filterForm.addEventListener('reset', function () {
    // Событие reset вызывается до того, как браузер очистит поля.
    setTimeout(updateCatalog, 0);
  });
}

// Из URL принимается только идентификатор одного из известных товаров.
const params = new URLSearchParams(window.location.search);
const requestedProduct = params.get('product');
const selectedProduct = Object.hasOwn(products, requestedProduct) ? requestedProduct : 'product-1';
const product = products[selectedProduct];

if (document.getElementById('product-order-link')) {
  document.querySelectorAll('[data-product-name]').forEach(function (element) {
    element.textContent = product.name;
  });
  document.querySelectorAll('[data-product-price]').forEach(function (element) {
    element.textContent = product.price + ' руб.';
  });
  const badge = document.getElementById('product-badge');
  badge.textContent = product.badge;
  badge.className = 'badge mb-3 ' + product.badgeClass;
  document.getElementById('product-image').alt = 'Учебное изображение: ' + product.name;
  document.getElementById('product-order-link').href = 'order.html?product=' + selectedProduct;
  document.title = product.name + ' — Bootstrap Shop';
}

const orderProduct = document.getElementById('order-product');
if (orderProduct && Object.hasOwn(products, requestedProduct)) {
  orderProduct.value = requestedProduct;
  // Кнопка «Очистить» сохраняет товар, с которого открыли форму.
  orderProduct.querySelector('option[value="' + requestedProduct + '"]').defaultSelected = true;
}

const orderModal = document.getElementById('orderModal');
if (orderModal) {
  orderModal.addEventListener('show.bs.modal', function (event) {
    const id = event.relatedTarget?.dataset.product;
    if (Object.hasOwn(products, id)) {
      document.getElementById('modal-product').value = id;
    }
  });
}

// Используется встроенная проверка required, e-mail и pattern телефона.
// Персональные данные не сохраняются и не отправляются.
document.querySelectorAll('[data-order-form]').forEach(function (form) {
  const name = form.elements.namedItem('name');
  name.addEventListener('input', function () { name.setCustomValidity(''); });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!name.value.trim()) {
      name.setCustomValidity('Введите имя, а не только пробелы.');
      name.reportValidity();
      return;
    }

    const id = form.elements.namedItem('product').value;
    const selected = products[id];
    if (!selected) return;

    document.getElementById('order-toast-message').textContent = 'Заявка на «' + selected.name
      + '» заполнена корректно. Это учебная проверка: данные на сервер не отправлены.';
    form.reset();

    if (form.id === 'quick-order') {
      // Уведомление показываем после закрытия модального окна.
      orderModal.addEventListener('hidden.bs.modal', function () {
        bootstrap.Toast.getOrCreateInstance(document.getElementById('orderToast')).show();
      }, { once: true });
      bootstrap.Modal.getOrCreateInstance(orderModal).hide();
    } else {
      bootstrap.Toast.getOrCreateInstance(document.getElementById('orderToast')).show();
    }
  });

  form.addEventListener('reset', function () { name.setCustomValidity(''); });
});

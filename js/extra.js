// Самостоятельное дополнение к учебным формам из практики №10.
const toastElement = document.getElementById('orderToast');
const orderModal = document.getElementById('orderModal');

function showNotification() {
  bootstrap.Toast.getOrCreateInstance(toastElement).show();
}

function handleForm(event) {
  event.preventDefault();
  const form = event.target;
  form.reset();

  if (form.closest('.modal')) {
    // Сначала закрываем окно, затем показываем уведомление.
    orderModal.addEventListener('hidden.bs.modal', showNotification, { once: true });
    bootstrap.Modal.getOrCreateInstance(orderModal).hide();
  } else {
    showNotification();
  }
}

// Браузер сам проверяет required и type="email" до события submit.
const forms = document.querySelectorAll('form');
forms.forEach(function (form) {
  form.addEventListener('submit', handleForm);
});

// В образце кнопка находится вне form и имеет type="button".
// Подключаем её к форме, не меняя разметку образца.
if (orderModal) {
  orderModal.addEventListener('hide.bs.modal', function () {
    // Убираем фокус из окна перед его скрытием.
    if (orderModal.contains(document.activeElement)) {
      document.activeElement.blur();
    }
  });

  const sendButton = orderModal.querySelector('.modal-footer .btn-primary');
  sendButton.addEventListener('click', function () {
    orderModal.querySelector('form').requestSubmit();
  });
}

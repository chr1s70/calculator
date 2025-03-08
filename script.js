function calculatePrice() {
  // Получаем значения из формы
  const basePrice = parseInt(document.getElementById('type').value);
  const extraPictures = parseInt(document.getElementById('extraPictures').value);
  const extraCharacters = parseInt(document.getElementById('extraCharacters').value);
  const altVersion = parseInt(document.getElementById('altVersion').value);

  // Цены за дополнительные элементы в зависимости от типа
  let extraPicturePrice, extraCharacterPrice;
  if (basePrice === 50) {
    extraPicturePrice = 40;
    extraCharacterPrice = 30;
  } else if (basePrice === 100) {
    extraPicturePrice = 80;
    extraCharacterPrice = 75;
  } else {
    extraPicturePrice = 120;
    extraCharacterPrice = 110;
  }

  // Расчёт общей стоимости
  let total = basePrice;
  total += extraPictures * extraPicturePrice;
  total += extraCharacters * extraCharacterPrice;
  total += (basePrice * altVersion) / 100; // Альтернативная версия как процент от базы

  // Вывод результата
  document.getElementById('result').innerHTML = `Total: $${total.toFixed(2)}`;
}

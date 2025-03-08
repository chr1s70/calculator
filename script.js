function calculatePrice() {
  // Получаем значения из формы
  const basePrice = parseInt(document.getElementById('type').value);
  const extraPictures = parseInt(document.getElementById('extraPictures').value);
  const extraCharactersInput = document.getElementById('extraCharacters');
  const altVersion = parseInt(document.getElementById('altVersion').value);

  // Синхронизация количества персонажей с количеством картинок
  extraCharactersInput.value = extraPictures > 0 ? extraPictures : 0;

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
  // Дополнительные персонажи считаются для каждой картинки
  total += extraPictures * extraCharacterPrice; // Умножаем на количество картинок
  total += (basePrice * altVersion) / 100; // Процент только от базовой цены

  // Вывод результата с двумя знаками после запятой и $ после числа
  document.getElementById('result').innerHTML = `Total: ${total.toFixed(2)}$`;
}

// Обновление количества персонажей при изменении картинок
document.getElementById('extraPictures').addEventListener('input', function() {
  const extraPictures = parseInt(this.value);
  const extraCharactersInput = document.getElementById('extraCharacters');
  extraCharactersInput.value = extraPictures > 0 ? extraPictures : 0;
});

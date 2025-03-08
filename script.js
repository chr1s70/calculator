// Автоматический вызов функции при загрузке страницы
window.onload = calculatePrice;

function calculatePrice() {
  // Получаем значения из формы
  const basePrice = parseInt(document.getElementById('type').value);
  const extraPictures = parseInt(document.getElementById('extraPictures').value);
  const extraCharactersPerPicture = parseInt(document.getElementById('extraCharacters').value);
  const altVersion = parseInt(document.getElementById('altVersion').value);

  // Цены за дополнительные элементы в зависимости от типа
  let extraPicturePrice, extraCharacterPrice;
  if (basePrice === 50) { // Sketch
    extraPicturePrice = 40;
    extraCharacterPrice = 30;
  } else if (basePrice === 100) { // Render
    extraPicturePrice = 80;
    extraCharacterPrice = 75;
  } else { // Full
    extraPicturePrice = 120;
    extraCharacterPrice = 110;
  }

  // Расчёт общей стоимости
  let total = basePrice; // Базовая цена включает первую картинку

  // 1. Дополнительные картинки (первая картинка уже включена в базовую цену)
  const additionalPictures = extraPictures > 0 ? extraPictures - 1 : 0; // Учитываем только дополнительные картинки
  total += additionalPictures * extraPicturePrice;

  // 2. Дополнительные персонажи на каждой картинке
  // Считаем стоимость только если персонажей на картинке >= 2, и только за персонажей начиная со второго
  let totalCharacters = 0;
  if (extraCharactersPerPicture >= 2) {
    const chargeableCharactersPerPicture = extraCharactersPerPicture - 1; // Первый персонаж "бесплатный"
    totalCharacters = chargeableCharactersPerPicture * extraPictures; // Общее количество платных персонажей
  }
  total += totalCharacters * extraCharacterPrice;

  // 3. Дополнительные версии: каждая версия добавляет 30% от базовой цены
  const versionCost = (basePrice * 0.3) * altVersion; // 30% от базовой цены за каждую версию
  total += versionCost;

  // Вывод результата с двумя знаками после запятой и $ после числа
  document.getElementById('result').innerHTML = `Total: ${total.toFixed(2)}$`;
}

// Автоматический пересчёт при изменении значений
document.getElementById('extraPictures').addEventListener('input', calculatePrice);
document.getElementById('type').addEventListener('change', calculatePrice);
document.getElementById('extraCharacters').addEventListener('input', calculatePrice);
document.getElementById('altVersion').addEventListener('input', calculatePrice);
// Массив для хранения значений персонажей для каждой картинки
let characterValues = [];

// Автоматический вызов функции при загрузке страницы
window.onload = function() {
  updateCharacterInputs(); // Создаём начальные поля
  calculatePrice(); // Рассчитываем начальную цену
};

// Функция для обновления полей ввода персонажей
function updateCharacterInputs() {
  const extraPictures = parseInt(document.getElementById('extraPictures').value);
  const characterInputsDiv = document.getElementById('characterInputs');
  
  // Если массив characterValues пуст или его длина меньше количества картинок, инициализируем значения
  if (characterValues.length === 0 || characterValues.length < extraPictures) {
    while (characterValues.length < extraPictures) {
      characterValues.push(characterValues.length < 1 ? 1 : 1);
    }
  } else if (characterValues.length > extraPictures) {
    characterValues = characterValues.slice(0, extraPictures);
  }

  // Очищаем существующие поля
  characterInputsDiv.innerHTML = '';

  // Создаём поля для каждой картинки с сохранёнными значениями
  for (let i = 0; i < extraPictures; i++) {
    const div = document.createElement('div');
    div.className = 'character-input';
    div.innerHTML = `
      <label for="characters_${i}">Number of Characters (Picture ${i + 1}):</label>
      <input type="number" id="characters_${i}" min="1" value="${characterValues[i] || 1}">
    `;
    characterInputsDiv.appendChild(div);

    // Добавляем слушатель событий для обновления значения в массиве
    document.getElementById(`characters_${i}`).addEventListener('input', function() {
      characterValues[i] = parseInt(this.value);
      calculatePrice();
    });
  }

  // Вызываем расчёт цены после обновления полей
  calculatePrice();
}

// Функция для расчёта цены
function calculatePrice() {
  const basePrice = parseInt(document.getElementById('type').value);
  const extraPictures = parseInt(document.getElementById('extraPictures').value);
  const altVersion = parseInt(document.getElementById('altVersion').value);

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

  let total = basePrice;

  const additionalPictures = extraPictures > 0 ? extraPictures - 1 : 0;
  total += additionalPictures * extraPicturePrice;

  let totalChargeableCharacters = 0;
  for (let i = 0; i < extraPictures; i++) {
    const charactersForPicture = parseInt(document.getElementById(`characters_${i}`).value) || 1;
    if (charactersForPicture >= 2) {
      const chargeableCharacters = charactersForPicture - 1;
      totalChargeableCharacters += chargeableCharacters;
    }
  }
  total += totalChargeableCharacters * extraCharacterPrice;

  const versionCost = (basePrice * 0.3) * altVersion;
  total += versionCost;

  document.getElementById('result').innerHTML = `Total: ${total.toFixed(2)}$`;
}

// Функция для сброса формы
function resetForm() {
  document.getElementById('type').value = '50'; // Сброс на "Sketch"
  document.getElementById('extraPictures').value = '1';
  document.getElementById('altVersion').value = '0';
  characterValues = [1]; // Сброс значений персонажей
  updateCharacterInputs(); // Обновляем поля
}

// Автоматический пересчёт при изменении значений
document.getElementById('extraPictures').addEventListener('input', updateCharacterInputs);
document.getElementById('type').addEventListener('change', calculatePrice);
document.getElementById('altVersion').addEventListener('input', calculatePrice);
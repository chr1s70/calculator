// Встроенные данные о ценах
const prices = {
  art: [
    {
      type: "Sketch",
      basePrice: 75,
      pricing: {
        "Extra Picture": 60,
        "Extra Character": 35,
        "Alt Version": 15
      }
    },
    {
      type: "Render",
      basePrice: 100,
      pricing: {
        "Extra Picture": 80,
        "Extra Character": 75,
        "Alt Version": 25
      }
    },
    {
      type: "Full",
      basePrice: 150,
      pricing: {
        "Extra Picture": 120,
        "Extra Character": 110,
        "Alt Version": 40
      }
    }
  ],
  character: {
    basePrice: 0,
    pricing: {
      "Number of Views": 75,
      "Number of Close-up Views": 35,
      "Number of Alt Versions": 15
    }
  }
};

function initializeInterface() {
  createTypeSelect('art');
  createDynamicInputs('art');
  createDynamicInputs('character');
  updateTooltips('art');
  updateTooltips('character');
  calculatePrice('art');
  calculatePrice('character');
  addMobileTooltipSupport();
}

function createTypeSelect(tab) {
  if (tab !== 'art') return;
  const typeSelect = document.getElementById(`type-${tab}`);
  typeSelect.innerHTML = '';
  prices[tab].forEach(item => {
    const option = document.createElement('option');
    option.value = item.type;
    option.textContent = item.type;
    typeSelect.appendChild(option);
  });
  typeSelect.addEventListener('change', () => {
    createDynamicInputs(tab);
    updateTooltips(tab);
    calculatePrice(tab);
  });
}

function createDynamicInputs(tab) {
  const inputContainer = document.getElementById(`dynamicInputs-${tab}`);
  inputContainer.innerHTML = '';

  const typeData = tab === 'art' ? prices[tab].find(item => item.type === document.getElementById(`type-${tab}`).value) : prices[tab];
  if (!typeData) return;
  const pricing = typeData.pricing;

  Object.keys(pricing).forEach((key, index) => {
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    const label = document.createElement('label');
    label.className = 'tooltip';
    label.htmlFor = `input-${tab}-${index}`;
    label.innerText = `${key}: `;
    
    const tooltipSpan = document.createElement('span');
    tooltipSpan.className = 'tooltiptext';
    tooltipSpan.id = `tooltip-${tab}-${index}`;
    tooltipSpan.innerText = `+$${pricing[key]}`;
    label.appendChild(tooltipSpan);

    const input = document.createElement('input');
    input.type = 'number';
    input.id = `input-${tab}-${index}`;
    input.name = key;
    input.min = '0';
    input.max = '10';
    input.value = '0';
    input.addEventListener('input', () => {
      updateTooltips(tab);
      calculatePrice(tab);
    });

    inputGroup.appendChild(label);
    inputGroup.appendChild(input);
    inputContainer.appendChild(inputGroup);
  });
}

function updateTooltips(tab) {
  const typeData = tab === 'art' ? prices[tab].find(item => item.type === document.getElementById(`type-${tab}`).value) : prices[tab];
  const pricing = typeData.pricing;

  Object.keys(pricing).forEach((key, index) => {
    const tooltip = document.getElementById(`tooltip-${tab}-${index}`);
    if (tooltip) {
      tooltip.innerText = `+$${pricing[key]}`;
    }
  });
}

function calculatePrice(tab) {
  const typeData = tab === 'art' ? prices[tab].find(item => item.type === document.getElementById(`type-${tab}`).value) : prices[tab];
  const pricing = typeData.pricing;
  const basePrice = typeData.basePrice || 0;

  let total = tab === 'character' ? 0 : basePrice;
  let summaryText = `${tab === 'art' ? 'Art Commission' : 'Character Sheet'} summary\n`;
  if (tab === 'art') {
    summaryText += `Type: ${document.getElementById(`type-${tab}`).value}\n`;
  }

  Object.keys(pricing).forEach((key, index) => {
    const input = document.getElementById(`input-${tab}-${index}`);
    const quantity = parseInt(input.value) || 0;
    const price = pricing[key];
    total += price * quantity;
    if (quantity > 0 || tab === 'art') {
      summaryText += `${key}: ${quantity}\n`;
    }
  });

  const discountCheckbox = document.getElementById(`discount-${tab}`);
  const discountApplied = discountCheckbox.checked;
  let finalTotal = total;
  if (discountApplied) {
    finalTotal = total * 0.85;
    summaryText += `Discount: 15% (-${(total * 0.15).toFixed(2)}$)\n`;
  } else {
    summaryText += `Discount: None\n`;
  }

  document.getElementById(`result-${tab}`).innerHTML = `Total: ${finalTotal.toFixed(2)}$`;
  summaryText += `Total: ${finalTotal.toFixed(2)}$`;
  document.getElementById(`summary-${tab}`).innerText = summaryText;
}

function resetForm(tab) {
  const typeData = tab === 'art' ? prices[tab].find(item => item.type === document.getElementById(`type-${tab}`).value) : prices[tab];
  const pricing = typeData.pricing;

  Object.keys(pricing).forEach((key, index) => {
    const input = document.getElementById(`input-${tab}-${index}`);
    input.value = '0';
  });
  document.getElementById(`discount-${tab}`).checked = false;
  updateTooltips(tab);
  calculatePrice(tab);
}

function copySummary(tab) {
  const summaryText = document.getElementById(`summary-${tab}`).innerText;
  navigator.clipboard.writeText(summaryText)
    .then(() => alert('Summary copied to clipboard!'))
    .catch(err => console.error('Ошибка копирования:', err));
}

function openTab(tab) {
  const tabContents = document.querySelectorAll('.tab-content');
  const tabButtons = document.querySelectorAll('.tab-button');
  tabContents.forEach(content => content.classList.remove('active'));
  tabButtons.forEach(button => button.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
  document.querySelector(`.tab-button[onclick="openTab('${tab}')"]`).classList.add('active');
  calculatePrice(tab);
}

function toggleFAQ(tab) {
  const faqContent = document.getElementById(`faq-content-${tab}`);
  faqContent.classList.toggle('active');
}

function addMobileTooltipSupport() {
  const tooltips = document.querySelectorAll('.tooltip');
  let timeoutId = null;

  tooltips.forEach(tooltip => {
    tooltip.addEventListener('click', function(e) {
      e.stopPropagation();
      tooltips.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => this.classList.remove('active'), 3000);
    });
  });

  document.addEventListener('click', e => {
    tooltips.forEach(tooltip => {
      if (!tooltip.contains(e.target)) {
        tooltip.classList.remove('active');
        if (timeoutId) clearTimeout(timeoutId);
      }
    });
  });
}

window.onload = () => {
  initializeInterface();
};

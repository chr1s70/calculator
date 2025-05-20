// Встроенные данные о ценах
const prices = [
    {
        "type": "Sketch",
        "basePrice": 75,
        "pricing": {
            "Extra Picture": 60,
            "Extra Character": 35,
            "Alt Version": 15
        }
    },
    {
        "type": "Render",
        "basePrice": 100,
        "pricing": {
            "Extra Picture": 80,
            "Extra Character": 75,
            "Alt Version": 25
        }
    },
    {
        "type": "Full",
        "basePrice": 150,
        "pricing": {
            "Extra Picture": 120,
            "Extra Character": 110,
            "Alt Version": 40
        }
    }
];

function initializeInterface() {
    createTypeSelect();
    createDynamicInputs();
    updateTooltips();
    calculatePrice();
    addMobileTooltipSupport();
}

function createTypeSelect() {
    const typeSelect = document.getElementById('type');
    typeSelect.innerHTML = '';
    prices.forEach(item => {
        const option = document.createElement('option');
        option.value = item.type;
        option.textContent = item.type;
        typeSelect.appendChild(option);
    });
    typeSelect.addEventListener('change', () => {
        createDynamicInputs();
        updateTooltips();
        calculatePrice();
    });
}

function createDynamicInputs() {
    const inputContainer = document.getElementById('dynamicInputs');
    inputContainer.innerHTML = ''; // Очищаем предыдущие элементы

    const selectedType = document.getElementById('type').value;
    const typeData = prices.find(item => item.type === selectedType);
    if (!typeData) return;
    const pricing = typeData.pricing;

    Object.keys(pricing).forEach((key, index) => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';

        const label = document.createElement('label');
        label.className = 'tooltip';
        label.htmlFor = `input-${index}`;
        label.innerText = `${key}: `;
        
        const tooltipSpan = document.createElement('span');
        tooltipSpan.className = 'tooltiptext';
        tooltipSpan.id = `tooltip-${index}`;
        tooltipSpan.innerText = `+$${pricing[key]}`;
        label.appendChild(tooltipSpan);

        const input = document.createElement('input');
        input.type = 'number';
        input.id = `input-${index}`;
        input.name = key;
        input.min = '0';
        input.max = '10';
        input.value = '0';
        input.addEventListener('input', () => {
            updateTooltips();
            calculatePrice();
        });

        inputGroup.appendChild(label);
        inputGroup.appendChild(input);
        inputContainer.appendChild(inputGroup);
    });
}

function updateTooltips() {
    const selectedType = document.getElementById('type').value;
    const typeData = prices.find(item => item.type === selectedType);
    const pricing = typeData.pricing;

    Object.keys(pricing).forEach((key, index) => {
        const tooltip = document.getElementById(`tooltip-${index}`);
        if (tooltip) {
            tooltip.innerText = `+$${pricing[key]}`;
        }
    });
}

function calculatePrice() {
    const selectedType = document.getElementById('type').value;
    const typeData = prices.find(item => item.type === selectedType);
    const pricing = typeData.pricing;
    const basePrice = typeData.basePrice || 0;

    let total = basePrice; // Базовая цена добавляется автоматически
    let summaryText = "Commission summary\n";
    summaryText += `Type: ${selectedType}\n`;

    Object.keys(pricing).forEach((key, index) => {
        const input = document.getElementById(`input-${index}`);
        const quantity = parseInt(input.value) || 0;
        const price = pricing[key];
        total += price * quantity; // Умножаем цену на количество
        summaryText += `${key}: ${quantity}\n`;
    });

    // Применяем скидку 15%, если чекбокс включён
    const discountCheckbox = document.getElementById('discount');
    const discountApplied = discountCheckbox.checked;
    let finalTotal = total;
    if (discountApplied) {
        finalTotal = total * 0.85; // Скидка 15%
        summaryText += `Discount: 15% (-${(total * 0.15).toFixed(2)}$)\n`;
    } else {
        summaryText += `Discount: None\n`;
    }

    document.getElementById('result').innerHTML = `Total: ${finalTotal.toFixed(2)}$`;
    summaryText += `Total: ${finalTotal.toFixed(2)}$`;
    document.getElementById('summary').innerText = summaryText;
}

function resetForm() {
    const selectedType = document.getElementById('type').value;
    const typeData = prices.find(item => item.type === selectedType);
    const pricing = typeData.pricing;

    Object.keys(pricing).forEach((key, index) => {
        const input = document.getElementById(`input-${index}`);
        input.value = '0';
    });
    document.getElementById('discount').checked = false; // Сбрасываем чекбокс скидки
    updateTooltips();
    calculatePrice();
}

function copySummary() {
    const summaryText = document.getElementById('summary').innerText;
    navigator.clipboard.writeText(summaryText)
        .then(() => alert('Summary copied to clipboard!'))
        .catch(err => console.error('Ошибка копирования:', err));
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

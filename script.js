// Встроенные данные о ценах
const prices = [
    {
        "type": "Sketch",
        "basePrice": 50, // Базовая цена теперь фиксированная для типа
        "pricing": {
            "Extra Picture": 40,
            "Extra Character": 25,
            "Alt Version": 10
        }
    },
    {
        "type": "Render",
        "basePrice": 100, // Базовая цена теперь фиксированная для типа
        "pricing": {
            "Extra Picture": 80,
            "Extra Character": 75,
            "Alt Version": 25
        }
    },
    {
        "type": "Full",
        "basePrice": 150, // Базовая цена теперь фиксированная для типа
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

    document.getElementById('result').innerHTML = `Total: ${total.toFixed(2)}$`;
    summaryText += `Total: ${total.toFixed(2)}$`;
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

let prices = { types: {} };

async function loadPrices() {
    try {
        const response = await fetch('prices.txt');
        const text = await response.text();
        parsePrices(text);
    } catch (error) {
        console.error('Ошибка загрузки цен:', error);
        document.getElementById('error').style.display = 'block';
        // Значения по умолчанию в случае ошибки
        prices = {
            types: {
                "Sketch": { basePrice: 50, extraPicturePrice: 40, extraCharacterPrice: 25, versionPrice: 10 },
                "Render": { basePrice: 100, extraPicturePrice: 80, extraCharacterPrice: 75, versionPrice: 25 },
                "Full": { basePrice: 150, extraPicturePrice: 120, extraCharacterPrice: 110, versionPrice: 40 }
            }
        };
        updateTypeSelect();
    }
}

function parsePrices(text) {
    const lines = text.trim().split('\n');
    let currentType = null;

    for (let line of lines) {
        line = line.trim();
        
        if (line === 'Commission summary') continue;
        if (line === '-') {
            currentType = null;
            continue;
        }

        const [key, value] = line.split(':').map(part => part.trim());
        
        if (!value) { // Это новый тип
            currentType = key;
            prices.types[currentType] = {};
        } else if (currentType) {
            const price = parseInt(value) || 0;
            switch(key) {
                case 'Picture':
                    prices.types[currentType].extraPicturePrice = price;
                    break;
                case 'Character':
                    prices.types[currentType].extraCharacterPrice = price;
                    break;
                case 'Version':
                    prices.types[currentType].versionPrice = price;
                    break;
                default:
                    prices.types[currentType].basePrice = price;
            }
        }
    }
    
    updateTypeSelect();
}

function updateTypeSelect() {
    const typeSelect = document.getElementById('type');
    typeSelect.innerHTML = '';
    Object.keys(prices.types).forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
    });
}

window.onload = async function() {
    await loadPrices();
    updateTooltips();
    calculatePrice();
    addMobileTooltipSupport();
};

function updateTooltips() {
    const type = document.getElementById('type').value;
    const typePrices = prices.types[type] || {};

    document.getElementById('typeTooltip').innerText = `+$${typePrices.basePrice || 0}`;
    document.getElementById('picturesTooltip').innerText = `+$${typePrices.extraPicturePrice || 0}`;
    document.getElementById('charactersTooltip').innerText = `+$${typePrices.extraCharacterPrice || 0}`;
    document.getElementById('versionsTooltip').innerText = `+$${typePrices.versionPrice || 0}`;
}

function calculatePrice() {
    const type = document.getElementById('type').value;
    const extraPictures = parseInt(document.getElementById('extraPictures').value) || 0;
    const characters = parseInt(document.getElementById('characters').value) || 0;
    const altVersion = parseInt(document.getElementById('altVersion').value) || 0;

    const typePrices = prices.types[type] || {};
    const basePrice = typePrices.basePrice || 0;
    const extraPicturePrice = typePrices.extraPicturePrice || 0;
    const extraCharacterPrice = typePrices.extraCharacterPrice || 0;
    const versionPrice = typePrices.versionPrice || 0;

    let total = basePrice;
    const additionalPictures = extraPictures > 1 ? extraPictures - 1 : 0;
    total += additionalPictures * extraPicturePrice;
    total += characters * extraCharacterPrice;
    total += altVersion * versionPrice;

    document.getElementById('result').innerHTML = `Total: ${total.toFixed(2)}$`;

    let summaryText = "Commission summary\n";
    summaryText += `Type: ${type}\n`;
    summaryText += `Number of Pictures: ${extraPictures}\n`;
    summaryText += `Number of Characters: ${characters}\n`;
    summaryText += `Number of Versions: ${altVersion}\n`;
    summaryText += `Total: ${total.toFixed(2)}$`;

    document.getElementById('summary').innerText = summaryText;
}

function resetForm() {
    document.getElementById('type').value = Object.keys(prices.types)[0] || 'Sketch';
    document.getElementById('extraPictures').value = '1';
    document.getElementById('characters').value = '0';
    document.getElementById('altVersion').value = '0';
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

            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                this.classList.remove('active');
            }, 3000);
        });
    });

    document.addEventListener('click', function(e) {
        tooltips.forEach(tooltip => {
            if (!tooltip.contains(e.target)) {
                tooltip.classList.remove('active');
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            }
        });
    });
}

document.getElementById('extraPictures').addEventListener('input', calculatePrice);
document.getElementById('type').addEventListener('change', function() {
    updateTooltips();
    calculatePrice();
});
document.getElementById('characters').addEventListener('input', calculatePrice);
document.getElementById('altVersion').addEventListener('input', calculatePrice);

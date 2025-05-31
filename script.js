document.addEventListener('DOMContentLoaded', () =>
{
    // Page elements
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');
    const page3 = document.getElementById('page3');

    // Input fields from Page 1
    const productSalePriceInput = document.getElementById('productSalePrice');
    const yourMoneyPerSaleInput = document.getElementById('yourMoneyPerSale');
    const numClubKidsInput = document.getElementById('numClubKids');
    const totalUnitsSoldInput = document.getElementById('totalUnitsSold');
    const avgSalesPerKidInput = document.getElementById('avgSalesPerKid');

    // Input field from Page 2
    const sponsorshipsPerKidInput = document.getElementById('sponsorshipsPerKid');

    // Buttons
    const nextButton = document.getElementById('nextButton');
    const calculateButton = document.getElementById('calculateButton');
    // const resetButton = document.getElementById('resetButton'); // If you add a reset button

    // Number Pad elements
    const numberPad = document.getElementById('numberPad');
    const numberPadDisplay = document.getElementById('numberPadDisplay');
    const numPadOkButton = document.getElementById('numPadOk');
    const numPadClearButton = document.getElementById('numPadClear');
    const numPadBackspaceButton = document.getElementById('numPadBackspace');
    const numPadDigitButtons = document.querySelectorAll('.number-pad-grid .numpad-btn:not(.special):not(.ok)');

    let currentActiveInput = null;
    let chartInstance = null;

    // --- Application State ---
    const appState = {
        productSalePrice: 0,
        yourMoneyPerSale: 0,
        numClubKids: 0,
        totalUnitsSold: 0,
        sponsorshipsPerKid: 0,
    };

    function initializeStateFromInputs()
    {
        appState.productSalePrice = parseFloat(productSalePriceInput.value) || 0;
        appState.yourMoneyPerSale = parseFloat(yourMoneyPerSaleInput.value) || 0;
        appState.numClubKids = parseInt(numClubKidsInput.value) || 0;
        appState.totalUnitsSold = parseInt(totalUnitsSoldInput.value) || 0;
        appState.sponsorshipsPerKid = parseInt(sponsorshipsPerKidInput.value) || 0;
        calculateAverageSalesPerKid();
    }

    function updateAppState(inputElement, valueString)
    {
        const key = inputElement.id;
        let parsedValue;

        if (key === "numClubKids" || key === "totalUnitsSold" || key === "sponsorshipsPerKid")
        {
            parsedValue = parseInt(valueString) || 0;
        } else
        {
            parsedValue = parseFloat(valueString) || 0;
        }

        appState[key] = parsedValue;
        inputElement.value = valueString === '' ? '0' : valueString; // Display "0" if empty after OK

        if (key === 'numClubKids' || key === 'totalUnitsSold')
        {
            calculateAverageSalesPerKid();
        }
    }

    // --- Number Pad Logic ---
    const numericInputs = document.querySelectorAll('.numeric-input');
    numericInputs.forEach(input =>
    {
        input.addEventListener('click', (e) =>
        {
            e.preventDefault();
            currentActiveInput = e.target;
            numberPadDisplay.value = (currentActiveInput.value === '0' || currentActiveInput.value === '') ? '' : currentActiveInput.value;
            numberPad.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    numPadDigitButtons.forEach(button =>
    {
        button.addEventListener('click', () =>
        {
            if (numberPadDisplay.value.length < 8)
            { // Limit input length
                if (button.textContent === '0' && numberPadDisplay.value === '0') return; // No "00"
                if (button.textContent !== '0' && numberPadDisplay.value === '0')
                { // Replace "0" with new digit
                    numberPadDisplay.value = button.textContent;
                } else
                {
                    numberPadDisplay.value += button.textContent;
                }
            }
        });
    });

    numPadOkButton.addEventListener('click', () =>
    {
        if (currentActiveInput)
        {
            let valueToSet = numberPadDisplay.value;
            if (valueToSet === '')
            { // If display is empty on OK, treat as 0
                valueToSet = '0';
            }
            updateAppState(currentActiveInput, valueToSet);
        }
        numberPad.style.display = 'none';
        numberPadDisplay.value = '';
        document.body.style.overflow = ''; // Restore original overflow
        currentActiveInput = null;
    });

    numPadClearButton.addEventListener('click', () =>
    {
        numberPadDisplay.value = '';
    });

    numPadBackspaceButton.addEventListener('click', () =>
    {
        numberPadDisplay.value = numberPadDisplay.value.slice(0, -1);
    });

    // --- Page 1 Logic ---
    function calculateAverageSalesPerKid()
    {
        const kids = appState.numClubKids;
        const units = appState.totalUnitsSold;
        if (kids > 0)
        {
            avgSalesPerKidInput.value = (units / kids).toFixed(1);
        } else
        {
            avgSalesPerKidInput.value = '0';
        }
    }

    // --- Navigation ---
    nextButton.addEventListener('click', () =>
    {
        page1.classList.remove('active');
        page2.classList.add('active');
    });

    calculateButton.addEventListener('click', () =>
    {
        page2.classList.remove('active');
        page3.classList.add('active');
        const chartData = calculateChartData();
        renderChart(chartData);
    });

    /* // Optional Reset Button Logic
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Reset appState to initial or zero values
            productSalePriceInput.value = "200";
            yourMoneyPerSaleInput.value = "100";
            numClubKidsInput.value = "50";
            totalUnitsSoldInput.value = "250";
            sponsorshipsPerKidInput.value = "30";
            initializeStateFromInputs(); // Re-init state and avg sales

            if(chartInstance) chartInstance.destroy(); // Clear chart

            page3.classList.remove('active');
            page2.classList.remove('active');
            page1.classList.add('active');
        });
    }
    */


    // --- Chart Calculation Logic ---
    function calculateChartData()
    {
        const YMPS = appState.yourMoneyPerSale;
        const TUS = appState.totalUnitsSold;
        const NCK = appState.numClubKids;
        const SPK = appState.sponsorshipsPerKid;

        const barLabels = Array.from({ length: 12 }, (_, i) => (i + 1) * 3); // 3, 6, ..., 36

        // Grey Data (Product Sales)
        const greyRevenueIncrementPer6Months = YMPS * TUS;
        const greyBarPeriodicRevenue = greyRevenueIncrementPer6Months / 2;

        const greyLineData = [{ x: 0, y: 0 }];
        for (let i = 1; i <= 6; i++)
        {
            greyLineData.push({ x: i * 6, y: greyRevenueIncrementPer6Months * i });
        }
        const greyBarData = barLabels.map(() => greyBarPeriodicRevenue);

        // Yellow Data (Sponsorships)
        const yellowPeriodicRevenue = SPK * NCK * 0.68 * 10 * 3; // This is SPK * NCK * 20.4

        const yellowLineData = [{ x: 0, y: 0 }];
        for (let i = 1; i <= 12; i++)
        {
            yellowLineData.push({ x: i * 3, y: yellowPeriodicRevenue * i });
        }
        const yellowBarData = barLabels.map(() => yellowPeriodicRevenue);

        return {
            labels: barLabels,
            greyLineData,
            greyBarData,
            yellowLineData,
            yellowBarData
        };
    }

    // --- Chart Rendering ---
    function renderChart(data)
    {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        if (chartInstance)
        {
            chartInstance.destroy();
        }

        const maxYValue = Math.max(
            data.greyLineData[data.greyLineData.length - 1]?.y || 0,
            data.yellowLineData[data.yellowLineData.length - 1]?.y || 0,
            Math.max(...data.greyBarData, 0),
            Math.max(...data.yellowBarData, 0),
            10000
        ) * 1.1;


        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        type: 'line',
                        label: 'Product Sales (Cumulative)',
                        data: data.greyLineData,
                        borderColor: 'grey',
                        borderWidth: 2.5, // Slightly thicker
                        fill: false,
                        tension: 0.1,
                        pointRadius: 3,
                        pointBackgroundColor: 'grey',
                        order: 1
                    },
                    {
                        type: 'line',
                        label: 'Sponsorships (Cumulative)',
                        data: data.yellowLineData,
                        borderColor: '#FFFF00',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.1,
                        pointRadius: 3,
                        pointBackgroundColor: '#FFFF00',
                        order: 0
                    },
                    {
                        type: 'bar',
                        label: 'Product Sales (3-monthly)', // Clarified label
                        data: data.greyBarData,
                        backgroundColor: 'rgba(128, 128, 128, 0.6)', // Slightly more transparent
                        borderColor: 'grey',
                        borderWidth: 1,
                        order: 3
                    },
                    {
                        type: 'bar',
                        label: 'Sponsorships (3-monthly)', // Clarified label
                        data: data.yellowBarData,
                        backgroundColor: 'rgba(255, 255, 0, 0.6)',
                        borderColor: '#CCCC00',
                        borderWidth: 1,
                        order: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: false },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: 'white',
                            boxWidth: 15, // Smaller box
                            padding: 15, // More padding around legend
                            font: { size: 10 } // Smaller legend font
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (context)
                            {
                                let label = context.dataset.label || '';
                                if (label)
                                {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null)
                                {
                                    label += new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: { display: true, text: 'Months', color: 'white', font: { size: 12 } },
                        ticks: {
                            color: 'white',
                            stepSize: 3,
                            callback: function (value) { if (value >= 0 && value % 3 === 0) return value; }
                        },
                        grid: { color: 'rgba(255,255,255,0.08)' }, // Dimmer grid
                        min: 0,
                        max: 36
                    },
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Revenue (kr)', color: 'white', font: { size: 12 } },
                        ticks: {
                            color: 'white',
                            callback: function (value)
                            {
                                return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
                            }
                        },
                        grid: { color: 'rgba(255,255,255,0.08)' },
                        suggestedMax: maxYValue,
                        min: 0
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
            }
        });
    }

    // --- Initialization ---
    initializeStateFromInputs();
    page1.classList.add('active');
});
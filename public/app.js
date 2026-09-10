// Pi Immo Chain Tunisia Frontend Application Logic

let propertiesData = [];
let userWallet = null;
let simulatedBalance = 15000; // 15,000 Pi

document.addEventListener('DOMContentLoaded', () => {
    fetchProperties();
    fetchLedger();
    setupEventListeners();
});

// Fetch properties list from backend API
async function fetchProperties() {
    try {
        const response = await fetch('/api/properties');
        if (!response.ok) throw new Error('فشل جلب البيانات');
        propertiesData = await response.json();
        renderProperties(propertiesData);
    } catch (error) {
        console.error('Error loading properties:', error);
        document.getElementById('propertiesGrid').innerHTML = '<p class="error-msg">حدث خطأ في تحميل العقارات. يرجى المحاولة لاحقاً.</p>';
    }
}

// Render properties grid
function renderProperties(list) {
    const grid = document.getElementById('propertiesGrid');
    if (!list || list.length === 0) {
        grid.innerHTML = '<p class="no-results">لا توجد عقارات تطابق خيارات البحث المختارة.</p>';
        return;
    }

    grid.innerHTML = list.map(prop => `
        <div class="property-card">
            <div class="property-img-wrapper">
                <img src="${prop.image}" alt="${prop.title}" class="property-img" onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'">
                <span class="property-tag">${prop.type}</span>
                <span class="property-verified-badge"><i class="fa-solid fa-shield-halved"></i> عقد موثق</span>
            </div>
            <div class="property-content">
                <div class="property-location"><i class="fa-solid fa-location-dot"></i> ${prop.city} - ${prop.area}</div>
                <h3 class="property-title">${prop.title}</h3>
                <div class="property-specs">
                    <span><i class="fa-solid fa-maximize"></i> ${prop.space} م²</span>
                    <span><i class="fa-solid fa-bed"></i> ${prop.rooms} غرف</span>
                    <span><i class="fa-solid fa-bath"></i> ${prop.bathrooms} حمام</span>
                </div>
                <div class="property-price-row">
                    <div>
                        <div class="price-pi">${prop.pricePi.toLocaleString()} Pi</div>
                        <div class="price-tnd">~ ${prop.priceTnd.toLocaleString()} د.ت</div>
                    </div>
                    <button class="btn btn-pi" onclick="openPaymentModal('${prop.id}')">
                        <i class="fa-solid fa-cart-shopping"></i> شراء / استئجار
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Fetch ledger history
async function fetchLedger() {
    try {
        const response = await fetch('/api/blockchain/ledger');
        if (!response.ok) return;
        const ledger = await response.json();
        renderLedger(ledger);
    } catch (err) {
        console.error('Error fetching ledger:', err);
    }
}

function renderLedger(ledgerList) {
    const tbody = document.getElementById('ledgerTableBody');
    tbody.innerHTML = ledgerList.map(item => `
        <tr>
            <td><span class="hash-code">${item.txHash}</span></td>
            <td><strong>${item.propertyTitle}</strong></td>
            <td>${item.buyerWallet.substring(0, 10)}...</td>
            <td><strong style="color: var(--primary-color)">${item.amountPi.toLocaleString()} Pi</strong></td>
            <td><span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> ${item.status}</span></td>
            <td>${item.timestamp}</td>
        </tr>
    `).join('');
}

// Set up Search & Filter Event Listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const cityFilter = document.getElementById('cityFilter');
    const typeFilter = document.getElementById('typeFilter');
    const resetBtn = document.getElementById('resetFiltersBtn');
    const walletBtn = document.getElementById('walletBtn');

    searchInput.addEventListener('input', applyFilters);
    cityFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);

    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        cityFilter.value = 'all';
        typeFilter.value = 'all';
        renderProperties(propertiesData);
    });

    walletBtn.addEventListener('click', handleWalletConnection);

    // Modal Close buttons
    document.getElementById('closeDetailsModal').onclick = () => closeModal('detailsModal');
    document.getElementById('closePaymentModal').onclick = () => closeModal('paymentModal');
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const city = document.getElementById('cityFilter').value;
    const type = document.getElementById('typeFilter').value;

    const filtered = propertiesData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm) ||
                              item.description.toLowerCase().includes(searchTerm) ||
                              item.city.toLowerCase().includes(searchTerm);
        const matchesCity = (city === 'all' || item.city === city);
        const matchesType = (type === 'all' || item.type === type);

        return matchesSearch && matchesCity && matchesType;
    });

    renderProperties(filtered);
}

// Handle Pi Wallet Connection
function handleWalletConnection() {
    if (!userWallet) {
        // Generate simulated Pi Wallet address
        userWallet = 'G' + Math.random().toString(36).substring(2, 12).toUpperCase() + 'PI_TN';
        document.getElementById('walletBtnText').innerText = `${userWallet.substring(0, 8)}... (${simulatedBalance.toLocaleString()} Pi)`;
        document.getElementById('walletBtn').classList.add('connected');
        alert(`تم ربط محفظة Pi بنجاح!\nالعنوان: ${userWallet}\nالرصيد: ${simulatedBalance.toLocaleString()} Pi`);
    } else {
        alert(`المحفظة متصلة بالفعل.\nالعنوان: ${userWallet}\nالرصيد: ${simulatedBalance.toLocaleString()} Pi`);
    }
}

// Modal handling
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Open Payment Modal with Smart Contract simulator
window.openPaymentModal = function(propertyId) {
    const prop = propertiesData.find(p => p.id === propertyId);
    if (!prop) return;

    if (!userWallet) {
        handleWalletConnection();
    }

    const modalBody = document.getElementById('paymentModalBody');
    modalBody.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h4>${prop.title} - ${prop.city}</h4>
            <p style="color: var(--text-muted); font-size: 0.9rem;">${prop.type} بمساحة ${prop.space} م²</p>
        </div>

        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 0.95rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>المبلغ المطلوب:</span>
                <strong style="color: var(--primary-color);">${prop.pricePi.toLocaleString()} Pi</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>رصيدك الحالي:</span>
                <strong>${simulatedBalance.toLocaleString()} Pi</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>رسوم العقد الذكي:</span>
                <span style="color: var(--success-color);">مجاناً (مستضافة)</span>
            </div>
        </div>

        <button id="confirmPayBtn" class="btn btn-pi btn-block" onclick="executePiPayment('${prop.id}', ${prop.pricePi})">
            <i class="fa-solid fa-lock"></i> تأكيد العقد الشراء وتوقيع المعاملة
        </button>
    `;

    openModal('paymentModal');
};

// Execute Pi payment
window.executePiPayment = async function(propertyId, amountPi) {
    const confirmBtn = document.getElementById('confirmPayBtn');
    if (!confirmBtn) return;

    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إرسال المعاملة إلى شبكة Pi...';

    try {
        const response = await fetch('/api/pi/pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                propertyId,
                buyerWallet: userWallet || 'G_DEMO_WALLET_TUNISIA_PI',
                amountPi
            })
        });

        const result = await response.json();

        if (result.success) {
            simulatedBalance -= amountPi;
            document.getElementById('walletBtnText').innerText = `${userWallet.substring(0, 8)}... (${simulatedBalance.toLocaleString()} Pi)`;

            document.getElementById('paymentModalBody').innerHTML = `
                <div style="text-align: center; color: var(--success-color); padding: 20px 0;">
                    <i class="fa-solid fa-circle-check" style="font-size: 4rem; margin-bottom: 15px;"></i>
                    <h3 style="color: var(--text-dark);">تمت عملية الشراء وتوثيق الملكية بنجاح!</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 10px;">رقم المعاملة العقد الذكي (TX Hash):</p>
                    <code style="display: block; background: #e2e8f0; padding: 8px; border-radius: 6px; margin: 10px 0; word-break: break-all;">${result.txHash}</code>
                    <button class="btn btn-secondary btn-block" onclick="closeModal('paymentModal'); fetchLedger();">إغلاق وتحديث السجل</button>
                </div>
            `;
        } else {
            alert('فشلت العملية: ' + result.message);
            confirmBtn.disabled = false;
            confirmBtn.innerText = 'إعادة المحاولة';
        }
    } catch (err) {
        console.error('Payment error:', err);
        alert('حدث خطأ أثناء الاتصال بالخادم.');
        confirmBtn.disabled = false;
        confirmBtn.innerText = 'إعادة المحاولة';
    }
};

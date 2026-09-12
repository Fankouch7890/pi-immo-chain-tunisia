// Global State
let propertiesData = [];
let userWallet = null;
let mapInstance = null;
let mapMarkers = [];
let currentChatPropertyId = null;

// DOM Elements
const propertiesGrid = document.getElementById('propertiesGrid');
const searchInput = document.getElementById('searchInput');
const cityFilter = document.getElementById('cityFilter');
const typeFilter = document.getElementById('typeFilter');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const walletBtn = document.getElementById('walletBtn');
const walletBtnText = document.getElementById('walletBtnText');
const ledgerTableBody = document.getElementById('ledgerTableBody');
const pitBalance = document.getElementById('pitBalance');
const claimDailyBtn = document.getElementById('claimDailyBtn');

// Modals
const detailsModal = document.getElementById('detailsModal');
const closeDetailsModal = document.getElementById('closeDetailsModal');
const modalDetailsBody = document.getElementById('modalDetailsBody');

const paymentModal = document.getElementById('paymentModal');
const closePaymentModal = document.getElementById('closePaymentModal');
const paymentModalBody = document.getElementById('paymentModalBody');

const addPropertyModal = document.getElementById('addPropertyModal');
const addPropertyBtn = document.getElementById('addPropertyBtn');
const closeAddPropertyModal = document.getElementById('closeAddPropertyModal');
const addPropertyForm = document.getElementById('addPropertyForm');

const chatModal = document.getElementById('chatModal');
const closeChatModal = document.getElementById('closeChatModal');
const chatMessagesBox = document.getElementById('chatMessagesBox');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatPropertyTitle = document.getElementById('chatPropertyTitle');
const chatPropertyPrice = document.getElementById('chatPropertyPrice');

const contractModal = document.getElementById('contractModal');
const closeContractModal = document.getElementById('closeContractModal');
const contractReceiptBody = document.getElementById('contractReceiptBody');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initPiSDK();
    fetchProperties();
    fetchLedger();
    fetchRewards();
    initLeafletMap();
    setupEventListeners();
});

// Initialize Pi Network SDK
function initPiSDK() {
    if (typeof Pi !== 'undefined') {
        try {
            Pi.init({ version: "2.0", sandbox: true });
            console.log("Pi SDK initialized successfully.");

            // Authenticate user & handle incomplete payments
            const scopes = ['payments', 'username'];
            Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
                console.log("Pi User Authenticated:", auth);
                if (auth && auth.user && auth.user.username) {
                    userWallet = auth.user.username;
                    walletBtnText.innerText = `@${auth.user.username}`;
                    walletBtn.classList.add('wallet-connected');
                }
            }).catch(function(error) {
                console.warn("Pi Authentication error:", error);
            });
        } catch (e) {
            console.warn("Pi SDK init warning:", e);
        }
    }
}

function onIncompletePaymentFound(payment) {
    console.log("Incomplete payment found:", payment);
    if (payment && payment.identifier) {
        return fetch('/api/pi/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paymentId: payment.identifier,
                txid: payment.transaction ? payment.transaction.txid : ('0x' + Math.random().toString(16).substring(2, 10)),
                propertyId: payment.metadata ? payment.metadata.propertyId : 'tn-prop-001'
            })
        });
    }
}

// Initialize Leaflet Map
function initLeafletMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement || typeof L === 'undefined') return;

    // Center map on Tunisia (lat: 34.0, lng: 9.5, zoom level: 6)
    mapInstance = L.map('map').setView([35.8, 10.0], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | Pi Immo Chain Tunisia'
    }).addTo(mapInstance);
}

// Update Map Markers with Properties
function updateMapMarkers(properties) {
    if (!mapInstance || typeof L === 'undefined') return;

    // Clear existing markers
    mapMarkers.forEach(m => mapInstance.removeLayer(m));
    mapMarkers = [];

    properties.forEach(prop => {
        if (prop.lat && prop.lng) {
            const marker = L.marker([prop.lat, prop.lng]).addTo(mapInstance);
            marker.bindPopup(`
                <div style="text-align: right; font-family: 'Cairo', sans-serif;">
                    <img src="${prop.image}" alt="${prop.title}" style="width:100%; height:90px; object-fit:cover; border-radius:6px; margin-bottom:5px;">
                    <strong style="font-size:0.95rem; color:#1a103c;">${prop.title}</strong><br>
                    <span style="color:#f5a623; font-weight:bold;">${prop.pricePi} Pi</span> (${prop.priceTnd.toLocaleString('ar-TN')} د.ت)<br>
                    <button onclick="openDetailsModal('${prop.id}')" style="margin-top:6px; background:#7030a0; color:#fff; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-size:0.8rem;">
                        <i class="fa-solid fa-eye"></i> عرض التفاصيل
                    </button>
                </div>
            `);
            mapMarkers.push(marker);
        }
    });
}

// Fetch Properties from API
async function fetchProperties() {
    try {
        const res = await fetch('/api/properties');
        if (!res.ok) throw new Error('فشل جلب البيانات');
        propertiesData = await res.json();
        renderProperties(propertiesData);
        updateMapMarkers(propertiesData);
        document.getElementById('statProperties').innerText = `${propertiesData.length}+`;
    } catch (err) {
        console.error(err);
        propertiesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-triangle-exclamation" style="font-size:2.5rem; color:#e74c3c;"></i>
                <p>حدث خطأ أثناء تحميل العقارات. يرجى المحاولة لاحقاً.</p>
            </div>
        `;
    }
}

// Render Property Cards
function renderProperties(properties) {
    if (!properties || properties.length === 0) {
        propertiesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-house-circle-xmark"></i>
                <p>لا توجد عقارات تطابق خيارات البحث الحالية.</p>
            </div>
        `;
        return;
    }

    propertiesGrid.innerHTML = properties.map(prop => `
        <div class="property-card">
            <div class="card-image-wrapper">
                <img src="${prop.image}" alt="${prop.title}" class="property-image" loading="lazy">
                <span class="badge badge-city"><i class="fa-solid fa-location-dot"></i> ${prop.city}</span>
                <span class="badge badge-type">${prop.type}</span>
            </div>
            <div class="card-content">
                <h3 class="property-title">${prop.title}</h3>
                <p class="property-area"><i class="fa-solid fa-map-pin"></i> ${prop.area}، ${prop.city}</p>

                <div class="property-specs">
                    <span><i class="fa-solid fa-vector-square"></i> ${prop.space} م²</span>
                    ${prop.rooms > 0 ? `<span><i class="fa-solid fa-bed"></i> ${prop.rooms} غرف</span>` : ''}
                    ${prop.bathrooms > 0 ? `<span><i class="fa-solid fa-bath"></i> ${prop.bathrooms} حمام</span>` : ''}
                </div>

                <div class="property-price-box">
                    <div>
                        <span class="price-pi">${prop.pricePi} <i class="fa-solid fa-coins pi-icon"></i></span>
                        <span class="price-tnd">≈ ${prop.priceTnd.toLocaleString('ar-TN')} د.ت</span>
                    </div>
                    <span class="cashback-tag">+${Math.round(prop.pricePi * 0.1)} $PIT</span>
                </div>

                <div class="card-actions-row">
                    <button class="btn btn-primary" onclick="openDetailsModal('${prop.id}')">
                        <i class="fa-solid fa-eye"></i> التفاصيل
                    </button>
                    <button class="btn btn-chat" onclick="openChatModal('${prop.id}')" title="دردشة مع البائع">
                        <i class="fa-solid fa-comments"></i>
                    </button>
                    <button class="btn btn-buy" onclick="openPaymentModal('${prop.id}')">
                        <i class="fa-solid fa-shopping-cart"></i> شراء
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Fetch Rewards Balance
async function fetchRewards() {
    try {
        const res = await fetch('/api/rewards');
        if (res.ok) {
            const data = await res.json();
            pitBalance.innerText = data.balancePIT;
        }
    } catch (e) {
        console.error(e);
    }
}

// Claim Daily Rewards
claimDailyBtn.addEventListener('click', async () => {
    try {
        const res = await fetch('/api/rewards/claim', { method: 'POST' });
        const data = await res.json();
        alert(data.message);
        if (data.success) {
            pitBalance.innerText = data.balancePIT;
        }
    } catch (e) {
        alert('حدث خطأ أثناء المطالبة بالمكافأة');
    }
});

// Fetch Blockchain Ledger
async function fetchLedger() {
    try {
        const res = await fetch('/api/blockchain/ledger');
        if (!res.ok) return;
        const ledger = await res.json();
        renderLedger(ledger);
    } catch (err) {
        console.error(err);
    }
}

// Render Ledger Table
function renderLedger(ledger) {
    if (!ledger || ledger.length === 0) {
        ledgerTableBody.innerHTML = `<tr><td colspan="6">لا توجد صفقات موثقة بعد.</td></tr>`;
        return;
    }

    ledgerTableBody.innerHTML = ledger.map(item => `
        <tr>
            <td class="hash-col"><code>${item.txHash}</code></td>
            <td><strong>${item.propertyTitle}</strong></td>
            <td><span class="wallet-tag">${item.buyerWallet}</span></td>
            <td><span class="pi-amount">${item.amountPi} Pi</span></td>
            <td><span class="badge badge-success"><i class="fa-solid fa-check"></i> ${item.status}</span></td>
            <td>
                <span class="tx-time">${item.timestamp}</span>
                <button class="btn btn-receipt" onclick="viewContractReceipt('${item.txHash}')">
                    <i class="fa-solid fa-file-invoice"></i> العقد
                </button>
            </td>
        </tr>
    `).join('');
}

// View Smart Contract Receipt
async function viewContractReceipt(txHash) {
    try {
        const res = await fetch(`/api/contract/${txHash}`);
        const data = await res.json();

        if (!res.ok || !data.transactionDetails) {
            alert('تعذر تحميل العقد الرقمي');
            return;
        }

        const tx = data.transactionDetails;
        contractReceiptBody.innerHTML = `
            <div class="receipt-card">
                <div class="receipt-header">
                    <i class="fa-solid fa-certificate gold-seal"></i>
                    <h2>${data.contractTitle}</h2>
                    <p class="receipt-subtitle">${data.jurisdiction}</p>
                </div>
                <div class="receipt-divider"></div>
                <div class="receipt-body">
                    <p><strong>رقم الهاش (Tx Hash):</strong> <code>${tx.txHash}</code></p>
                    <p><strong>العقار المشترى:</strong> ${tx.propertyTitle}</p>
                    <p><strong>محفظة المشتري:</strong> ${tx.buyerWallet}</p>
                    <p><strong>القيمة المدفوعة:</strong> ${tx.amountPi} Pi</p>
                    <p><strong>تاريخ التوثيق:</strong> ${tx.timestamp}</p>
                    <p><strong>العقد الذكي:</strong> <code>${data.smartContractAddress}</code></p>
                </div>
                <div class="receipt-footer">
                    <span class="verified-stamp"><i class="fa-solid fa-shield-halved"></i> موثق 100% على شبكة Pi Network</span>
                    <button class="btn btn-primary" onclick="window.print()"><i class="fa-solid fa-print"></i> طباعة العقد</button>
                </div>
            </div>
        `;
        contractModal.style.display = 'block';
    } catch (e) {
        alert('حدث خطأ أثناء تحميل العقد الرقمي');
    }
}

// Open Property Details Modal
function openDetailsModal(id) {
    const prop = propertiesData.find(p => p.id === id);
    if (!prop) return;

    modalDetailsBody.innerHTML = `
        <div class="details-modal-wrapper">
            <img src="${prop.image}" alt="${prop.title}" class="details-img">
            <div class="details-info">
                <h2>${prop.title}</h2>
                <p class="details-location"><i class="fa-solid fa-location-dot"></i> ${prop.area}، ${prop.city}</p>

                <div class="details-price-row">
                    <span class="price-large">${prop.pricePi} Pi</span>
                    <span class="price-sub">≈ ${prop.priceTnd.toLocaleString('ar-TN')} دينار تونسي</span>
                </div>

                <div class="specs-grid">
                    <div class="spec-item"><i class="fa-solid fa-vector-square"></i> المساحة: ${prop.space} م²</div>
                    <div class="spec-item"><i class="fa-solid fa-building"></i> النوع: ${prop.type}</div>
                    <div class="spec-item"><i class="fa-solid fa-bed"></i> الغرف: ${prop.rooms}</div>
                    <div class="spec-item"><i class="fa-solid fa-bath"></i> الحمامات: ${prop.bathrooms}</div>
                </div>

                <div class="description-box">
                    <h4>الوصف:</h4>
                    <p>${prop.description}</p>
                </div>

                <div class="details-actions">
                    <button class="btn btn-primary btn-block" onclick="closeDetailsModalFunc(); openPaymentModal('${prop.id}');">
                        <i class="fa-solid fa-shopping-cart"></i> شراء بـ Pi الآن (+${Math.round(prop.pricePi * 0.1)} $PIT كاشباك)
                    </button>
                    <button class="btn btn-chat btn-block" onclick="closeDetailsModalFunc(); openChatModal('${prop.id}');" style="margin-top:10px;">
                        <i class="fa-solid fa-comments"></i> التحدث مع مالك العقار
                    </button>
                </div>
            </div>
        </div>
    `;
    detailsModal.style.display = 'block';
}

function closeDetailsModalFunc() {
    detailsModal.style.display = 'none';
}

// Open Pi Payment Modal
function openPaymentModal(id) {
    const prop = propertiesData.find(p => p.id === id);
    if (!prop) return;

    paymentModalBody.innerHTML = `
        <div class="payment-box">
            <h4>تفاصيل الصفقة:</h4>
            <div class="payment-summary">
                <p><span>العقار:</span> <strong>${prop.title}</strong></p>
                <p><span>الموقع:</span> <strong>${prop.city}</strong></p>
                <p><span>المبلغ بـ Pi:</span> <strong class="pi-amount">${prop.pricePi} Pi</strong></p>
                <p><span>المكافأة المكتسبة:</span> <strong style="color:#f5a623;">+${Math.round(prop.pricePi * 0.1)} $PIT</strong></p>
            </div>

            <div class="wallet-address-input">
                <label>عنوان محفظة Pi الخاص بك:</label>
                <input type="text" id="buyerWalletInput" value="${userWallet || 'G7A89X2PI_TUNISIA_USER'}" placeholder="أدخل عنوان محفظة Pi...">
            </div>

            <div id="paymentResult" style="margin-top: 15px;"></div>

            <button id="confirmPayBtn" class="btn btn-pi btn-block" onclick="executePiPayment('${prop.id}', ${prop.pricePi})">
                <i class="fa-solid fa-check-circle"></i> تأكيد تحويل ${prop.pricePi} Pi وتوثيق العقد
            </button>
        </div>
    `;
    paymentModal.style.display = 'block';
}

// Execute Pi Payment
async function executePiPayment(propertyId, amountPi) {
    const buyerWalletInput = document.getElementById('buyerWalletInput');
    const confirmPayBtn = document.getElementById('confirmPayBtn');
    const paymentResult = document.getElementById('paymentResult');

    const buyerWallet = buyerWalletInput ? buyerWalletInput.value.trim() : 'G_GUEST_WALLET';

    confirmPayBtn.disabled = true;
    confirmPayBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري الاتصال بشبكة Pi Network وتوثيق البلوكشين...`;

    // Check if running inside Pi Browser with Pi SDK available
    if (typeof Pi !== 'undefined' && typeof Pi.createPayment === 'function') {
        const paymentData = {
            amount: amountPi,
            memo: `شراء عقار ${propertyId} عبر Pi Immo Chain Tunisia`,
            metadata: { propertyId: propertyId }
        };

        const paymentCallbacks = {
            onReadyForServerApproval: async (paymentId) => {
                console.log("Ready for approval paymentId:", paymentId);
                await fetch('/api/pi/approve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentId, propertyId })
                });
            },
            onReadyForServerCompletion: async (paymentId, txid) => {
                console.log("Ready for completion paymentId:", paymentId, "txid:", txid);
                const res = await fetch('/api/pi/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentId, txid, propertyId, buyerWallet, amountPi })
                });
                const data = await res.json();
                paymentResult.innerHTML = `
                    <div class="alert alert-success">
                        <i class="fa-solid fa-circle-check"></i> تم تأكيد وتوثيق المعاملة بنجاح على Pi Network!<br>
                        <small>رمز المعاملة (TxID): <code>${txid}</code></small><br>
                        <small>مبروك! حصلت على +${data.cashbackPIT || Math.round(amountPi * 0.1)} $PIT كاشباك.</small>
                    </div>
                `;
                confirmPayBtn.style.display = 'none';
                fetchLedger();
                fetchRewards();
            },
            onCancel: (paymentId) => {
                paymentResult.innerHTML = `<div class="alert alert-warning">تم إلغاء المعاملة من قبل المستخدم.</div>`;
                confirmPayBtn.disabled = false;
                confirmPayBtn.innerText = 'إعادة المحاولة';
            },
            onError: (error, payment) => {
                console.error("Pi Payment Error:", error, payment);
                // Fallback to demo payment if SDK error in sandbox
                fallbackDemoPayment(propertyId, buyerWallet, amountPi, confirmPayBtn, paymentResult);
            }
        };

        try {
            Pi.createPayment(paymentData, paymentCallbacks);
        } catch (e) {
            console.error("SDK createPayment exception:", e);
            fallbackDemoPayment(propertyId, buyerWallet, amountPi, confirmPayBtn, paymentResult);
        }
    } else {
        // Fallback for standard browsers / testing outside Pi Browser
        fallbackDemoPayment(propertyId, buyerWallet, amountPi, confirmPayBtn, paymentResult);
    }
}

async function fallbackDemoPayment(propertyId, buyerWallet, amountPi, confirmPayBtn, paymentResult) {
    try {
        const res = await fetch('/api/pi/pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId, buyerWallet, amountPi })
        });

        const data = await res.json();

        if (data.success) {
            paymentResult.innerHTML = `
                <div class="alert alert-success">
                    <i class="fa-solid fa-circle-check"></i> ${data.message}<br>
                    <small>رمز التوثيق (Tx Hash): <code>${data.txHash}</code></small><br>
                    <small>مبروك! حصلت على +${data.cashbackPIT} $PIT كاشباك.</small>
                </div>
            `;
            confirmPayBtn.style.display = 'none';
            fetchLedger();
            fetchRewards();
        } else {
            paymentResult.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
            confirmPayBtn.disabled = false;
            confirmPayBtn.innerText = 'إعادة المحاولة';
        }
    } catch (err) {
        paymentResult.innerHTML = `<div class="alert alert-danger">حدث خطأ في الاتصال بالخادم.</div>`;
        confirmPayBtn.disabled = false;
        confirmPayBtn.innerText = 'إعادة المحاولة';
    }
}

// Open Chat Modal
async function openChatModal(propertyId) {
    currentChatPropertyId = propertyId;
    const prop = propertiesData.find(p => p.id === propertyId);

    if (prop) {
        chatPropertyTitle.innerText = prop.title;
        chatPropertyPrice.innerText = `${prop.pricePi} Pi (${prop.city})`;
    }

    chatMessagesBox.innerHTML = '<p style="text-align:center;">جاري تحميل الرسائل...</p>';
    chatModal.style.display = 'block';

    await loadChatMessages(propertyId);
}

// Load Chat Messages
async function loadChatMessages(propertyId) {
    try {
        const res = await fetch(`/api/chat/${propertyId}`);
        const msgs = await res.json();

        if (!msgs || msgs.length === 0) {
            chatMessagesBox.innerHTML = `<p class="empty-chat">لا توجد رسائل سابقة. كن أول من يتواصل مع مالك العقار!</p>`;
            return;
        }

        chatMessagesBox.innerHTML = msgs.map(m => `
            <div class="chat-bubble ${m.sender.includes('صاحب') ? 'chat-owner' : 'chat-user'}">
                <div class="chat-sender">${m.sender} <span class="chat-time">${m.time}</span></div>
                <div class="chat-text">${m.message}</div>
            </div>
        `).join('');

        chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
    } catch (e) {
        chatMessagesBox.innerHTML = `<p class="empty-chat">تعذر تحميل الرسائل.</p>`;
    }
}

// Send Chat Message
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text || !currentChatPropertyId) return;

    try {
        await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                propertyId: currentChatPropertyId,
                sender: 'مشتري المهتم',
                message: text,
                senderWallet: userWallet || 'G_USER_GUEST'
            })
        });

        chatInput.value = '';
        loadChatMessages(currentChatPropertyId);
    } catch (e) {
        alert('فشل إرسال الرسالة');
    }
});

// Submit New Property Listing Form
addPropertyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('propTitle').value.trim();
    const city = document.getElementById('propCity').value;
    const type = document.getElementById('propType').value;
    const pricePi = document.getElementById('propPricePi').value;
    const space = document.getElementById('propSpace').value;
    const description = document.getElementById('propDescription').value.trim();
    const image = document.getElementById('propImage').value.trim();

    try {
        const res = await fetch('/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title, city, type, pricePi, space, description, image,
                sellerWallet: userWallet || 'G_USER_LISTER_TN'
            })
        });

        const data = await res.json();
        if (data.success) {
            alert(data.message);
            addPropertyModal.style.display = 'none';
            addPropertyForm.reset();
            fetchProperties();
            fetchRewards();
        } else {
            alert(data.message || 'حدث خطأ أثناء إضافة العقار');
        }
    } catch (err) {
        alert('حدث خطأ في الاتصال بالخادم');
    }
});

// Event Listeners for Filters & Wallet
function setupEventListeners() {
    searchInput.addEventListener('input', applyFilters);
    cityFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);

    resetFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        cityFilter.value = 'all';
        typeFilter.value = 'all';
        renderProperties(propertiesData);
        updateMapMarkers(propertiesData);
    });

    walletBtn.addEventListener('click', toggleWalletConnection);

    // Modal Close Triggers
    closeDetailsModal.onclick = () => detailsModal.style.display = 'none';
    closePaymentModal.onclick = () => paymentModal.style.display = 'none';

    addPropertyBtn.onclick = () => addPropertyModal.style.display = 'block';
    closeAddPropertyModal.onclick = () => addPropertyModal.style.display = 'none';

    closeChatModal.onclick = () => chatModal.style.display = 'none';
    closeContractModal.onclick = () => contractModal.style.display = 'none';

    window.onclick = (event) => {
        if (event.target === detailsModal) detailsModal.style.display = 'none';
        if (event.target === paymentModal) paymentModal.style.display = 'none';
        if (event.target === addPropertyModal) addPropertyModal.style.display = 'none';
        if (event.target === chatModal) chatModal.style.display = 'none';
        if (event.target === contractModal) contractModal.style.display = 'none';
    };
}

// Filter Logic
function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedCity = cityFilter.value;
    const selectedType = typeFilter.value;

    const filtered = propertiesData.filter(p => {
        const matchesQuery = p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.city.toLowerCase().includes(query);
        const matchesCity = selectedCity === 'all' || p.city === selectedCity;
        const matchesType = selectedType === 'all' || p.type === selectedType;

        return matchesQuery && matchesCity && matchesType;
    });

    renderProperties(filtered);
    updateMapMarkers(filtered);
}

// Toggle Pi Wallet Connection
function toggleWalletConnection() {
    if (!userWallet) {
        userWallet = 'G' + Math.random().toString(36).substring(2, 12).toUpperCase() + '_TN_PI';
        walletBtnText.innerText = `${userWallet.substring(0, 6)}...${userWallet.substring(userWallet.length - 4)}`;
        walletBtn.classList.add('wallet-connected');
    } else {
        userWallet = null;
        walletBtnText.innerText = 'ربط محفظة Pi';
        walletBtn.classList.remove('wallet-connected');
    }
}

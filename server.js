const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock Properties Database in Tunisia
const properties = [
  {
    id: 'tn-prop-001',
    title: 'شقة فاخرة إطلالة على البحر في القنطاوي',
    city: 'سوسة',
    area: 'مرسى القنطاوي',
    type: 'شقة',
    pricePi: 450,
    priceTnd: 280000,
    space: 120,
    rooms: 3,
    bathrooms: 2,
    description: 'شقة فاخرة ومفروشة بالكامل تطل مباشرة على الشاطئ وميناء القنطاوي بسوسة مع حراسة ومسبح.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    lat: 35.8920,
    lng: 10.5980,
    verified: true,
    sellerWallet: 'G7A89X2PI_TN_DEMO'
  },
  {
    id: 'tn-prop-002',
    title: 'فيلا عصرية في ضفاف البحيرة 2',
    city: 'تونس',
    area: 'ضفاف البحيرة 2',
    type: 'فيلا',
    pricePi: 1800,
    priceTnd: 1200000,
    space: 380,
    rooms: 5,
    bathrooms: 4,
    description: 'فيلا فخمة ذات تصميم عصري مع حديقة واسعة ومسبح خاص ومأرب لسيارتين في أفضل مناطق العاصمة.',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    lat: 36.8378,
    lng: 10.2520,
    verified: true,
    sellerWallet: 'G2B99Y1PI_TN_DEMO'
  },
  {
    id: 'tn-prop-003',
    title: 'أرض مجهزة للبناء بالقرب من الشاطئ',
    city: 'الحمامات',
    area: 'الحمامات الجنوبية',
    type: 'أرض',
    pricePi: 300,
    priceTnd: 190000,
    space: 500,
    rooms: 0,
    bathrooms: 0,
    description: 'قطعة أرض مقسمة ومسجلة بدفتر الملكية العقارية مجهزة بالماء والكهرباء وقريبة من جميع المرافق.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    lat: 36.3883,
    lng: 10.5400,
    verified: true,
    sellerWallet: 'G5C88Z3PI_TN_DEMO'
  },
  {
    id: 'tn-prop-004',
    title: 'محل تجاري في قلب وسط المدينة',
    city: 'صفاقس',
    area: 'باب بحر',
    type: 'تجاري',
    pricePi: 250,
    priceTnd: 160000,
    space: 75,
    rooms: 2,
    bathrooms: 1,
    description: 'محل تجاري ذو موقع استراتيجي ممتاز على الشارع الرئيسي مناسب لجميع الأنشطة التجارية والاستثمار.',
    image: 'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&w=800&q=80',
    lat: 34.7406,
    lng: 10.7603,
    verified: true,
    sellerWallet: 'G9D77A4PI_TN_DEMO'
  },
  {
    id: 'tn-prop-005',
    title: 'استوديو أنيق بالقرب من الجامعة والمنطقة السياحية',
    city: 'المنستير',
    area: 'سكانس',
    type: 'شقة',
    pricePi: 180,
    priceTnd: 110000,
    space: 60,
    rooms: 1,
    bathrooms: 1,
    description: 'استوديو حديث ومجهز بقرب جميع المرافق الجامعية والسياحية بالمنستير جاهز للسكن أو للاستثمار.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    lat: 35.7643,
    lng: 10.8113,
    verified: true,
    sellerWallet: 'G3B12Z9PI_TN_DEMO'
  },
  {
    id: 'tn-prop-006',
    title: 'دار تقليدية رممّت بأسلوب عصري في المدينة العتيقة',
    city: 'تونس',
    area: 'المدينة العتيقة',
    type: 'فيلا',
    pricePi: 950,
    priceTnd: 600000,
    space: 260,
    rooms: 4,
    bathrooms: 3,
    description: 'دار عربي تاريخية ساحرة مرممة وفق أعلى المعايير مع صحن دار مفتوح وتفاصيل معمارية تونسية أصيلة.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    lat: 36.7989,
    lng: 10.1708,
    verified: true,
    sellerWallet: 'G1E66B5PI_TN_DEMO'
  }
];

// Mock Ledger Database
const blockchainLedger = [
  {
    txHash: '0x8f3c9b12a',
    propertyId: 'tn-prop-001',
    propertyTitle: 'شقة فاخرة القنطاوي',
    buyerWallet: 'G7A89X2PI_TN_DEMO',
    amountPi: 450,
    status: 'مكتملة ومثبتة',
    timestamp: '2026-03-01 14:20'
  },
  {
    txHash: '0x1a4e7f83b',
    propertyId: 'tn-prop-005',
    propertyTitle: 'استوديو المنستير',
    buyerWallet: 'G3B12Z9PI_TN_DEMO',
    amountPi: 180,
    status: 'مكتملة ومثبتة',
    timestamp: '2026-03-05 10:15'
  }
];

// Mock Chat Messages Database
const chatMessages = [
  {
    id: 1,
    propertyId: 'tn-prop-001',
    sender: 'مشتري مهتم',
    senderWallet: 'G_GUEST_1',
    message: 'السلام عليكم، هل الشقة متوفرة للمعاينة هذا الأسبوع؟',
    time: '10:30'
  },
  {
    id: 2,
    propertyId: 'tn-prop-001',
    sender: 'صاحب العقار (المالك)',
    senderWallet: 'G7A89X2PI_TN_DEMO',
    message: 'وعليكم السلام، نعم مرحباً بك! يمكنك المعاينة يوم السبت بعد العصر.',
    time: '10:35'
  }
];

// User Rewards Database (PIT Token: Pi Immo Token)
const userRewards = {
  balancePIT: 120,
  lastClaimDate: null,
  history: [
    { type: 'تسجيل دخول أولي', amount: 50, date: '2026-03-01' },
    { type: 'ربط محفظة Pi', amount: 70, date: '2026-03-02' }
  ]
};

// --- Routes ---

// Serve Pi Validation Key at domain root
app.get('/validation-key.txt', (req, res) => {
  const envKey = process.env.PI_VALIDATION_KEY;
  if (envKey) {
    return res.type('text/plain').send(envKey);
  }

  const filePath = path.join(__dirname, 'public', 'validation-key.txt');
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  res.type('text/plain').send('428d3931b0c0a0dc0173257fa411af');
});

// Get all properties
app.get('/api/properties', (req, res) => {
  res.json(properties);
});

// Get property by ID
app.get('/api/properties/:id', (req, res) => {
  const prop = properties.find(p => p.id === req.params.id);
  if (!prop) {
    return res.status(404).json({ error: 'العقار غير موجود' });
  }
  res.json(prop);
});

// Add new property listing (User Listing)
app.post('/api/properties', (req, res) => {
  const { title, city, area, type, pricePi, priceTnd, space, rooms, bathrooms, description, image, lat, lng, sellerWallet } = req.body;

  if (!title || !city || !pricePi) {
    return res.status(400).json({ success: false, message: 'عنوان العقار، المدينة، والسعر بـ Pi مطلوبة' });
  }

  const newId = `tn-prop-${String(properties.length + 1).padStart(3, '0')}`;
  const newProp = {
    id: newId,
    title,
    city,
    area: area || city,
    type: type || 'شقة',
    pricePi: parseFloat(pricePi),
    priceTnd: parseFloat(priceTnd) || parseFloat(pricePi) * 600,
    space: parseInt(space) || 100,
    rooms: parseInt(rooms) || 2,
    bathrooms: parseInt(bathrooms) || 1,
    description: description || 'عقار جديد مدرج بواسطة المستخدم.',
    image: image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    lat: parseFloat(lat) || 36.8065,
    lng: parseFloat(lng) || 10.1815,
    verified: true,
    sellerWallet: sellerWallet || 'G_USER_LISTER_TN'
  };

  properties.unshift(newProp);

  // Bonus 50 PIT tokens for listing a property
  userRewards.balancePIT += 50;
  userRewards.history.unshift({ type: 'مكافأة إدراج عقار جديد', amount: 50, date: new Date().toISOString().substring(0, 10) });

  res.status(201).json({
    success: true,
    message: 'تم إضافة العقار بنجاح ومنحك 50 توكن $PIT كمكافأة!',
    property: newProp,
    reward: { bonusPIT: 50, totalPIT: userRewards.balancePIT }
  });
});

// Get Pi Blockchain Ledger History
app.get('/api/blockchain/ledger', (req, res) => {
  res.json(blockchainLedger);
});

// Get digital smart contract receipt for a transaction
app.get('/api/contract/:txHash', (req, res) => {
  const tx = blockchainLedger.find(t => t.txHash === req.params.txHash || t.txHash.includes(req.params.txHash));
  if (!tx) {
    return res.status(404).json({ success: false, message: 'عقد المعاملة غير موجود' });
  }

  res.json({
    contractTitle: 'عقد ملكية عقاري إلكتروني موثق عبر شبكة Pi Network',
    platform: 'Pi Immo Chain Tunisia',
    jurisdiction: 'الجمهورية التونسية - السجل العقاري الرقمي',
    transactionDetails: tx,
    smartContractAddress: '0xPiImmoTunisiaSmartContractAddress2026',
    issuedAt: new Date().toISOString()
  });
});

// Server-side Pi Network Payment Approval endpoint
app.post('/api/pi/approve', (req, res) => {
  const { paymentId, propertyId } = req.body;
  console.log(`Pi Payment Approved on server: paymentId=${paymentId}, propertyId=${propertyId}`);
  res.json({ success: true, message: 'Payment approved by app server', paymentId });
});

// Server-side Pi Network Payment Completion endpoint
app.post('/api/pi/complete', (req, res) => {
  const { paymentId, txid, propertyId, buyerWallet, amountPi } = req.body;
  console.log(`Pi Payment Completed: paymentId=${paymentId}, txid=${txid}`);

  const prop = properties.find(p => p.id === propertyId);
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const newTx = {
    txHash: txid || ('0x' + Math.random().toString(16).substring(2, 10)),
    propertyId: propertyId || 'tn-prop-001',
    propertyTitle: prop ? prop.title : 'عقار تونس',
    buyerWallet: buyerWallet || 'G_PI_BROWSER_USER',
    amountPi: amountPi || 100,
    status: 'مكتملة ومثبتة',
    timestamp: now
  };

  blockchainLedger.unshift(newTx);

  const pitEarned = Math.round((amountPi || 100) * 0.1);
  userRewards.balancePIT += pitEarned;

  res.json({
    success: true,
    message: 'تم إكمال المعاملة وتوثيق العقد الذكي بنجاح',
    txHash: newTx.txHash,
    transaction: newTx,
    cashbackPIT: pitEarned
  });
});

// Execute Pi Payment / Smart Contract Transaction
app.post('/api/pi/pay', (req, res) => {
  const { propertyId, buyerWallet, amountPi } = req.body;

  if (!propertyId || !amountPi) {
    return res.status(400).json({ success: false, message: 'بيانات الطلب غير مكتملة' });
  }

  const prop = properties.find(p => p.id === propertyId);
  if (!prop) {
    return res.status(404).json({ success: false, message: 'العقار غير موجود' });
  }

  // Generate unique transaction hash
  const txHash = '0x' + Math.random().toString(16).substring(2, 10);
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const newTx = {
    txHash,
    propertyId: prop.id,
    propertyTitle: prop.title,
    buyerWallet: buyerWallet || 'G_GUEST_WALLET_TN',
    amountPi,
    status: 'مكتملة ومثبتة',
    timestamp: now
  };

  blockchainLedger.unshift(newTx);

  // Cashbacks in $PIT token (10% of Pi paid in $PIT)
  const pitEarned = Math.round(amountPi * 0.1);
  userRewards.balancePIT += pitEarned;
  userRewards.history.unshift({ type: `استرداد نقدي (Cashback) شراء ${prop.title}`, amount: pitEarned, date: now.substring(0, 10) });

  res.json({
    success: true,
    message: 'تمت العملية وتوثيق العقد العقاري على البلوكشين بنجاح',
    txHash,
    transaction: newTx,
    cashbackPIT: pitEarned
  });
});

// Chat Endpoints
app.get('/api/chat/:propertyId', (req, res) => {
  const msgs = chatMessages.filter(m => m.propertyId === req.params.propertyId);
  res.json(msgs);
});

app.post('/api/chat', (req, res) => {
  const { propertyId, sender, message, senderWallet } = req.body;
  if (!propertyId || !message) {
    return res.status(400).json({ success: false, message: 'العقار والرسالة مطلوبة' });
  }

  const newMsg = {
    id: chatMessages.length + 1,
    propertyId,
    sender: sender || 'مستخدم Pi',
    senderWallet: senderWallet || 'G_USER_GUEST',
    message,
    time: new Date().toLocaleTimeString('ar-TN', { hour: '2-digit', minute: '2-digit' })
  };

  chatMessages.push(newMsg);
  res.status(201).json({ success: true, message: newMsg });
});

// Token Rewards ($PIT) Endpoints
app.get('/api/rewards', (req, res) => {
  res.json(userRewards);
});

app.post('/api/rewards/claim', (req, res) => {
  const today = new Date().toISOString().substring(0, 10);
  if (userRewards.lastClaimDate === today) {
    return res.status(400).json({ success: false, message: 'لقد قمت بالمطالبة بمكافأة التعدين اليومية اليوم مسبقاً! عد غداً.' });
  }

  const dailyReward = 15;
  userRewards.balancePIT += dailyReward;
  userRewards.lastClaimDate = today;
  userRewards.history.unshift({ type: 'تعدين ومكافأة يومية', amount: dailyReward, date: today });

  res.json({
    success: true,
    message: `تم إضافة ${dailyReward} توكن $PIT إلى محفظتك بنجاح!`,
    balancePIT: userRewards.balancePIT
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Pi Immo Chain Tunisia API', timestamp: new Date() });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Pi Immo Chain Tunisia Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;

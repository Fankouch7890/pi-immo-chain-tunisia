const express = require('express');
const path = require('path');

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
    verified: true
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
    verified: true
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
    verified: true
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
    verified: true
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
    verified: true
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
    verified: true
  }
];

// Mock Ledger Database
const blockchainLedger = [
  {
    txHash: '0x8f3c...9b12a',
    propertyId: 'tn-prop-001',
    propertyTitle: 'شقة فاخرة القنطاوي',
    buyerWallet: 'G7A89X2PI_TN_DEMO',
    amountPi: 450,
    status: 'مكتملة ومثبتة',
    timestamp: '2026-03-01 14:20'
  },
  {
    txHash: '0x1a4e...7f83b',
    propertyId: 'tn-prop-005',
    propertyTitle: 'استوديو المنستير',
    buyerWallet: 'G3B12Z9PI_TN_DEMO',
    amountPi: 180,
    status: 'مكتملة ومثبتة',
    timestamp: '2026-03-05 10:15'
  }
];

// Routes

// Route for Pi Domain Validation
app.get('/validation-key.txt', (req, res) => {
  if (process.env.PI_VALIDATION_KEY) {
    return res.type('text/plain').send(process.env.PI_VALIDATION_KEY);
  }
  res.sendFile(path.join(__dirname, 'public', 'validation-key.txt'));
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

// Get Pi Blockchain Ledger History
app.get('/api/blockchain/ledger', (req, res) => {
  res.json(blockchainLedger);
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
  const txHash = '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 7);
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

  res.json({
    success: true,
    message: 'تمت العملية وتوثيق العقد العقاري على البلوكشين بنجاح',
    txHash,
    transaction: newTx
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

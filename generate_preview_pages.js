const fs = require('fs');

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');`;

// Logo HTML (512x512)
const logoHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
${fontImport}
* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Cairo', sans-serif; }
body {
  width: 512px;
  height: 512px;
  background: linear-gradient(135deg, #0b0f19 0%, #1a1c2e 50%, #0d1b2a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}
.icon-box {
  width: 220px;
  height: 220px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 40px rgba(245, 158, 11, 0.35);
  margin-bottom: 24px;
}
.icon-box svg {
  width: 120px;
  height: 120px;
  fill: #ffffff;
}
.title {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #ffffff;
  margin-bottom: 6px;
  text-align: center;
}
.subtitle {
  font-size: 18px;
  font-weight: 700;
  color: #f59e0b;
  letter-spacing: 2px;
  text-align: center;
}
</style>
</head>
<body>
  <div class="icon-box">
    <svg viewBox="0 0 24 24"><path d="M10.707 2.293a1 1 0 011.414 0l9 9a1 1 0 01-1.414 1.414L19 12.001V20a1 1 0 01-1 1h-5v-6h-4v6H5a1 1 0 01-1-1v-7.999l-1.293 1.293a1 1 0 01-1.414-1.414l9-9z"/></svg>
  </div>
  <div class="title">باي إيمو تشين</div>
  <div class="subtitle">تونس - تكنولوجيا العقارات</div>
</body>
</html>`;

// Preview 1 (750x1500) - Map & Property Search
const p1Html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
${fontImport}
* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Cairo', sans-serif; }
body {
  width: 750px;
  height: 1500px;
  background: #0b0f19;
  color: #ffffff;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.logo-tag {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo-icon {
  width: 44px;
  height: 44px;
  background: #f59e0b;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-icon svg { width: 24px; height: 24px; fill: #fff; }
.logo-text { font-size: 24px; font-weight: 800; color: #fff; }
.net-badge {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid #f59e0b;
  color: #f59e0b;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 16px;
}
.search-bar {
  background: #161d2f;
  border: 1px solid #2a3447;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  font-size: 18px;
  color: #94a3b8;
}
.map-card {
  height: 520px;
  background: #111827;
  border: 1px solid #1f293d;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  margin-bottom: 30px;
}
.map-bg {
  width: 100%;
  height: 100%;
  opacity: 0.35;
  background-image: radial-gradient(#2a3447 2px, transparent 2px);
  background-size: 30px 30px;
}
.pin {
  position: absolute;
  background: #f59e0b;
  color: #000;
  font-weight: 800;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}
.section-title {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 20px;
}
.prop-card {
  background: #161d2f;
  border: 1px solid #2a3447;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.prop-img {
  width: 160px;
  height: 120px;
  background: linear-gradient(135deg, #1e293b, #334155);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-weight: 700;
}
.prop-details { display: flex; flex-direction: column; justify-content: center; gap: 8px; flex: 1; }
.prop-title { font-size: 20px; font-weight: 700; color: #fff; }
.prop-loc { font-size: 16px; color: #94a3b8; }
.prop-price { font-size: 22px; font-weight: 800; color: #f59e0b; }
</style>
</head>
<body>
  <div class="header">
    <div class="logo-tag">
      <div class="logo-icon"><svg viewBox="0 0 24 24"><path d="M10.707 2.293a1 1 0 011.414 0l9 9a1 1 0 01-1.414 1.414L19 12.001V20a1 1 0 01-1 1h-5v-6h-4v6H5a1 1 0 01-1-1v-7.999l-1.293 1.293a1 1 0 01-1.414-1.414l9-9z"/></svg></div>
      <div class="logo-text">باي إيمو تشين تونس</div>
    </div>
    <div class="net-badge">شبكة Pi الرئيسية</div>
  </div>

  <div class="search-bar">
    🔍 ابحث عن شقق، فيلات، أو أراضي في تونس...
  </div>

  <div class="map-card">
    <div class="map-bg"></div>
    <div class="pin" style="top: 35%; right: 25%;">45,000 π - قمرت</div>
    <div class="pin" style="top: 55%; right: 55%;">28,000 π - الحمامات</div>
    <div class="pin" style="top: 40%; right: 70%;">62,000 π - سوسة</div>
  </div>

  <div class="section-title">العقارات الممتازة في تونس</div>

  <div class="prop-card">
    <div class="prop-img">شقة فاخرة</div>
    <div class="prop-details">
      <div class="prop-title">فيلا المطلة على البحر - قمرت</div>
      <div class="prop-loc">تونس الكبرى، تونس</div>
      <div class="prop-price">45,000 π</div>
    </div>
  </div>

  <div class="prop-card">
    <div class="prop-img">إقامة حديثة</div>
    <div class="prop-details">
      <div class="prop-title">شقة مطلة على الشاطئ - الحمامات</div>
      <div class="prop-loc">نابل، تونس</div>
      <div class="prop-price">28,000 π</div>
    </div>
  </div>
</body>
</html>`;

// Preview 2 (750x1500) - Property Details & Verification
const p2Html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
${fontImport}
* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Cairo', sans-serif; }
body {
  width: 750px;
  height: 1500px;
  background: #0b0f19;
  color: #ffffff;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}
.back-btn { font-size: 24px; color: #f59e0b; font-weight: 700; }
.title-top { font-size: 22px; font-weight: 800; }
.hero-box {
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 24px;
  border: 1px solid #2a3447;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 30px;
  margin-bottom: 30px;
}
.hero-badge {
  background: #f59e0b;
  color: #000;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: 12px;
  width: fit-content;
  margin-bottom: 12px;
  font-size: 16px;
}
.hero-title { font-size: 32px; font-weight: 800; margin-bottom: 8px; }
.hero-sub { font-size: 18px; color: #94a3b8; }
.grid-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}
.info-card {
  background: #161d2f;
  border: 1px solid #2a3447;
  border-radius: 18px;
  padding: 20px;
}
.info-label { font-size: 16px; color: #94a3b8; margin-bottom: 6px; }
.info-val { font-size: 22px; font-weight: 800; color: #f59e0b; }
.cert-box {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid #10b981;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}
.cert-icon { font-size: 40px; }
.cert-title { font-size: 20px; font-weight: 800; color: #10b981; margin-bottom: 4px; }
.cert-desc { font-size: 16px; color: #94a3b8; }
.action-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #ffffff;
  font-size: 24px;
  font-weight: 800;
  padding: 24px;
  border-radius: 20px;
  text-align: center;
  margin-top: auto;
  box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
}
</style>
</head>
<body>
  <div class="header">
    <div class="back-btn">← عودة</div>
    <div class="title-top">تفاصيل العقار</div>
    <div style="width: 50px;"></div>
  </div>

  <div class="hero-box">
    <div class="hero-badge">عقار موثق على البلوكشين</div>
    <div class="hero-title">فيلا مطلة على البحر - قمرت</div>
    <div class="hero-sub">تونس الكبرى • المساحة 450 م²</div>
  </div>

  <div class="grid-info">
    <div class="info-card">
      <div class="info-label">السعر المطلوب</div>
      <div class="info-val">45,000 π</div>
    </div>
    <div class="info-card">
      <div class="info-label">الملكية العقارية</div>
      <div class="info-val">سند ملكية مسجل</div>
    </div>
    <div class="info-card">
      <div class="info-label">الغرف / حمامات</div>
      <div class="info-val">5 غرف / 3 حمامات</div>
    </div>
    <div class="info-card">
      <div class="info-label">الموقع</div>
      <div class="info-val">قمرت، تونس</div>
    </div>
  </div>

  <div class="cert-box">
    <div class="cert-icon">🛡️</div>
    <div>
      <div class="cert-title">العقد الذكي والمستندات موثقة</div>
      <div class="cert-desc">تم التحقق من بيانات العقار وربطه بـ Pi Network Mainnet بكل أمان.</div>
    </div>
  </div>

  <div class="action-btn">شراء الآن بواسطة Pi SDK</div>
</body>
</html>`;

// Preview 3 (750x1500) - Pi Mainnet Escrow Payment
const p3Html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
${fontImport}
* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Cairo', sans-serif; }
body {
  width: 750px;
  height: 1500px;
  background: #0b0f19;
  color: #ffffff;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
}
.header {
  text-align: center;
  margin-bottom: 40px;
}
.header-title { font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 8px; }
.header-sub { font-size: 18px; color: #94a3b8; }
.payment-card {
  background: #161d2f;
  border: 1px solid #f59e0b;
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 35px;
  box-shadow: 0 12px 30px rgba(245, 158, 11, 0.15);
}
.pay-amount { text-align: center; margin-bottom: 25px; }
.pay-num { font-size: 48px; font-weight: 800; color: #f59e0b; }
.pay-label { font-size: 18px; color: #94a3b8; }
.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #2a3447;
  font-size: 18px;
}
.detail-row:last-child { border-bottom: none; }
.lbl { color: #94a3b8; }
.val { font-weight: 700; color: #fff; }
.escrow-box {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid #3b82f6;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 35px;
}
.escrow-title { font-size: 20px; font-weight: 800; color: #60a5fa; margin-bottom: 8px; }
.escrow-desc { font-size: 16px; color: #94a3b8; line-height: 1.6; }
.btn-primary {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #fff;
  font-size: 24px;
  font-weight: 800;
  padding: 24px;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 20px;
}
.btn-secondary {
  background: #1e293b;
  color: #94a3b8;
  font-size: 20px;
  font-weight: 700;
  padding: 18px;
  border-radius: 20px;
  text-align: center;
}
</style>
</head>
<body>
  <div class="header">
    <div class="header-title">دفع آمن بواسطة Pi Wallet</div>
    <div class="header-sub">تطبيقات شبكة Pi الرسمية (Pi Mainnet)</div>
  </div>

  <div class="payment-card">
    <div class="pay-amount">
      <div class="pay-num">45,000 π</div>
      <div class="pay-label">المبلغ الإجمالي للتجميد في العقد الذكي</div>
    </div>
    <div class="detail-row">
      <span class="lbl">العقار</span>
      <span class="val">فيلا مطلة على البحر - قمرت</span>
    </div>
    <div class="detail-row">
      <span class="lbl">البائع</span>
      <span class="val">محفظة البائع الموثقة</span>
    </div>
    <div class="detail-row">
      <span class="lbl">رسوم الشبكة</span>
      <span class="val">0.01 π</span>
    </div>
    <div class="detail-row">
      <span class="lbl">حالة الضمان</span>
      <span class="val" style="color: #10b981;">جاهز للتأكيد (Escrow)</span>
    </div>
  </div>

  <div class="escrow-box">
    <div class="escrow-title">🔒 نظام الضمان المالي الحامي للمشتري</div>
    <div class="escrow-desc">تُحفظ الأموال في العقد الذكي بأمان ولا يتم تحويلها للبائع إلا بعد استكمال نقل الملكية وتأكيد الطرفين.</div>
  </div>

  <div class="btn-primary">تأكيد الدفع عبر Pi Browser</div>
  <div class="btn-secondary">إلغاء العملية</div>
</body>
</html>`;

fs.writeFileSync('logo_temp.html', logoHtml);
fs.writeFileSync('p1_temp.html', p1Html);
fs.writeFileSync('p2_temp.html', p2Html);
fs.writeFileSync('p3_temp.html', p3Html);
console.log('Arabic HTML files generated successfully.');

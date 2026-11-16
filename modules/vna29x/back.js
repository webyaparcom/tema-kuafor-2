// Menü Portal 1 (5 Kas 2026, PAKET 6): menu-4 / menu-login-3 deseni — sayfa linkleri ({{html}}), dil çubuğu ({{langhtml}}),
// giriş adresi ({{mnu1girishref}}) ve üye linkleri ({{mnu1uyelinkler}}) burada üretilir. Metinler {{panoText}} gibi desing
// yer tutucusu olarak bırakılır; motorun desing döngüsü aktif dile çözer (tek kaynak desing).
function mnu1Kacis(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
var mnu1Desing = (json && json.desing) || {};
// Ana sayfada page = setting nesnesidir (path yok) → '' ana sayfa demek
var mnu1Aktif = page && typeof page === 'object' && typeof page.path === 'string' ? page.path : '';

// Sayfa linkleri: modulestatus.page koleksiyonunda kategorisiz + yayında olanlar (menu:false olanları motor zaten eler)
var mnu1Sayfaset = webmakerdata.pagesetting.data.find(function (item) {
  return item.modulestatus && item.modulestatus.page;
});
var mnu1Ana = mnu1Aktif === '';
var mnu1Linkler = '<li><a href="' + wxLangInternalHref('') + '" class="mnu1-link' + (mnu1Ana ? ' mnu1-aktif' : '') + '"' +
  (mnu1Ana ? ' aria-current="page"' : '') + ' dir="auto">@home@</a></li>';
if (mnu1Sayfaset && webmakerdata[mnu1Sayfaset.path]) {
  webmakerdata[mnu1Sayfaset.path].data.forEach(function (s) {
    if (s.status != 'play' || s.category != '') return;
    var hedef = s.pathnext || s.path || '';
    var aktif = !mnu1Ana && (s.path === mnu1Aktif || (s.pathnext && s.pathnext === mnu1Aktif));
    mnu1Linkler += '<li><a href="' + mnu1Kacis(wxLangInternalHref(hedef)) + '" class="mnu1-link' + (aktif ? ' mnu1-aktif' : '') + '"' +
      (aktif ? ' aria-current="page"' : '') + ' dir="auto">' + mnu1Kacis(wmPickLang(s.name, json.lang)) + '</a></li>';
  });
}
html = html.replace(/\{\{html\}\}/g, function () { return mnu1Linkler; });

// Dil çubuğu: bulunulan sayfada kalır; tek dilli sitede boş (ul:empty gizlenir)
var mnu1Diller = [];
for (var mnu1Dil in webmakerdata.setting.langs) {
  if (webmakerdata.setting.langs[mnu1Dil] == true) mnu1Diller.push(mnu1Dil);
}
var mnu1Dilhtml = '';
if (mnu1Diller.length > 1) {
  mnu1Diller.forEach(function (d) {
    var buDil = d === json.lang;
    mnu1Dilhtml += '<li><a href="' + mnu1Kacis(wxLangHref(d, mnu1Aktif)) + '" class="mnu1-dil' + (buDil ? ' mnu1-dil-aktif' : '') + '"' +
      (buDil ? ' aria-current="true"' : '') + ' hreflang="' + d + '" lang="' + d + '" aria-label="@language-selector@: ' + d + '">' + d.toUpperCase() + '</a></li>';
  });
}
html = html.replace(/\{\{langhtml\}\}/g, function () { return mnu1Dilhtml; });

// Giriş ve üye adresleri dil öneklidir (6 Kas 2026 kuralı): /<dil>/login · /<dil>/user/… (cf-worker portal yolu).
// girishref: tam adres ya da / ile başlayan yol aynen kalır; göreli değer aktif dile bağlanır («tr/login» gibi dil önekli eski değer de).
// G1 (15 Kas 2026): eski «/^(tr|en|ar)$/» ezberi kalktı — geçerli dil = sitenin aktif dilleri; önek = aktif ya da katalog dili.
var mnu1Lang = mnu1Diller.indexOf(String(json.lang || '')) !== -1 ? String(json.lang) : (mnu1Diller[0] || String(json.lang || '') || 'tr');
var mnu1Giris = String(mnu1Desing.girishref || 'login').trim();
var mnu1DilOnekMi = function (seg) {
  return mnu1Diller.indexOf(seg) !== -1 || (typeof wmLangInfo === 'function' ? !wmLangInfo(seg).katalogDisi : /^(tr|en|ar)$/.test(seg));
};
if (!/^(https?:)?\/\//i.test(mnu1Giris) && mnu1Giris.charAt(0) !== '/') {
  var mnu1Ilk = /^([a-z]{2})\//.exec(mnu1Giris);
  if (mnu1Ilk && mnu1DilOnekMi(mnu1Ilk[1])) mnu1Giris = mnu1Giris.slice(mnu1Ilk[0].length);
  mnu1Giris = '/' + mnu1Lang + '/' + mnu1Giris;
}
html = html.replace(/\{\{mnu1girishref\}\}/g, function () { return mnu1Kacis(mnu1Giris); });

// Üye linkleri — /<dil>/user portalının hazır sayfaları (cf-worker BILINEN kümesi; talep tekil: /<dil>/user/talep); ikonlar 16px tek çizgi kalınlığı
var mnu1Ikon = {
  pano: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  cari: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2M7 6V4h10v2"/>',
  fatura: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
  odeme: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  talep: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  profil: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'
};
var mnu1Uye = [
  ['', 'pano', 'panoText'],
  ['cari', 'cari', 'bakiyeText'],
  ['faturalar', 'fatura', 'faturalarText'],
  ['odeme', 'odeme', 'odemeText'],
  ['talep', 'talep', 'taleplerText'],
  ['profil', 'profil', 'profilText']
];
var mnu1Uyehtml = '';
mnu1Uye.forEach(function (u) {
  mnu1Uyehtml += '<li><a href="/' + mnu1Lang + '/user/' + u[0] + '" class="mnu1-uyelink"><svg class="mnu1-ikon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    mnu1Ikon[u[1]] + '</svg><span dir="auto">{{' + u[2] + '}}</span></a></li>';
});
html = html.replace(/\{\{mnu1uyelinkler\}\}/g, function () { return mnu1Uyehtml; });

// Find the page with `modulestatus.page` set to true
var pagesettingjson = webmakerdata.pagesetting.data.find(
  function(item) { return item.modulestatus && item.modulestatus.page; },
);
var backhtml = `<a href="${wxLangInternalHref('')}">@home@ </a>`;
if (pagesettingjson) {
  // Iterate over the relevant data to create HTML content (p = sayfa öğesi, page = mevcut sayfa bilgisi back.js bağlamında)
  for (var p of webmakerdata[pagesettingjson.path].data) {
    if (p.status == "play" && p.category == "") {
      backhtml += `<a href="${wxLangInternalHref(p.path)}">${
        p.name[json.lang]
      }</a>`;
    }
  }
  // Replace the placeholder {{html}} with the generated backhtml content
  html = html.replace(new RegExp("{{html}}", "g"), backhtml);
}
// Dil linkleri: bulunulan sayfada kalsın (ana sayfa değilse aynı path ile dil değişsin)
langhtml = "";
var currentPagePath = (page && typeof page === "object" && page.path !== undefined) ? page.path : "";
for (var key in webmakerdata.setting.langs) {
  if (webmakerdata.setting.langs[key] == true) {
    var langUrl = wxLangHref(key, currentPagePath || "");
    /* G1: tek üretici (hreflang + aria-current; png yoksa kod) — wmLangLi yoksa eski biçim */
langhtml += typeof wmLangLi === "function" ? wmLangLi(key, langUrl, { style: "flag" }) : `<li><a href="${langUrl}"><img height="25" src="/src/lang/${key}.png" alt="${key}" loading="lazy"></a></li>`;
  }
}
html = html.replace(new RegExp("{{langhtml}}", "g"), langhtml);

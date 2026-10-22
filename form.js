// Ortak: yıl ve "haber ver" formu (Formspree)
(function () {
  var yil = document.getElementById("yil");
  if (yil) yil.textContent = new Date().getFullYear();
  var form = document.getElementById("haber-formu");
  if (!form) return;
  var durum = document.getElementById("durum");
  var dugme = form.querySelector("button");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var eposta = document.getElementById("f-eposta");
    if (!eposta.value.trim() || !eposta.checkValidity()) {
      durum.className = "kotu"; durum.textContent = "Geçerli bir e-posta adresi yaz."; eposta.focus(); return;
    }
    var riza = document.getElementById("f-riza");
    if (riza && !riza.checked) { durum.className = "kotu"; durum.textContent = "Devam etmek için onay kutusunu işaretle."; riza.focus(); return; }
    if (window.ONIZLEME) { durum.className = "iyi"; durum.textContent = "Önizleme: form doğru çalışıyor. Sitede bu kayıt e-postanıza gelir."; return; }
    var veri = new FormData(form);
    var secilen = Array.prototype.map.call(form.querySelectorAll('input[name="oyunlar"]:checked'), function (x) { return x.value; });
    if (secilen.length) { veri.delete("oyunlar"); veri.append("oyunlar", secilen.join(", ")); }
    dugme.disabled = true; var eski = dugme.textContent; dugme.textContent = "Gönderiliyor…";
    fetch(form.action, { method: "POST", body: veri, headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error();
        form.reset();
        durum.className = "iyi"; durum.textContent = "Tamamdır! Oyun çıktığı gün sana haber vereceğiz.";
      })
      .catch(function () {
        durum.className = "kotu"; durum.textContent = "Gönderilemedi. İnternet bağlantını kontrol edip tekrar dene.";
      })
      .finally(function () { dugme.disabled = false; dugme.textContent = eski; });
  });
})();

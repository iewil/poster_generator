var qr_code = new QRCode(document.getElementById("qrcode"))

function updatePage() {
  qr_code.clear()
  // var company_name = document.getElementById("company_name").value;
  var safe_entry_url = document.getElementById("safe_entry_url").value;
  qr_code.makeCode(safe_entry_url)
}


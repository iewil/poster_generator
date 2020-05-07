const fs = require('fs');

const PDFDocument = require('pdfkit');
const QRCode = require('qrcode')
const slugify = require('slugify')


// generatePDF
// Arguments: 
// 'qr_description': <String> Description of QR code location
// 'safe_entry_url': <String> URL that is encoded into the QR code

// Example:
// 'qr_description': "NTUC Northpoint SE",
// 'safe_entry_url': "https://temperaturepass.ndi-api.gov.sg/login/PROD-S83CS0191L-NTUC-NORTHPOINT-SE"

async function generatePDF(qr_description, safe_entry_url) {
  console.log("starting script")
  try {
    // Create a document
    console.log("creating pdf doc")
    let doc = new PDFDocument({
      size: "A3",
      margin: 0,
    });
    let QR_DESCRIPTION = qr_description;
    let SAFE_ENTRY_URL = safe_entry_url;
    let qr_code_image = await QRCode.toDataURL(SAFE_ENTRY_URL, { 
        errorCorrectionLevel: 'H',
        quality: 1,
        margin: 1,
      }
    );
    let poster_template_path = "assets/poster_template.jpg";
    let safe_entry_logo_path = "assets/SafeEntry_logo_inline.png";

    // Add poster template
    doc.image(poster_template_path, {
      fit: [841.89, 1190.55],
      align: 'center',
      valign: 'center'
    });

    // Add qr code
    doc.image(qr_code_image, 472, 360, {
      fit: [320, 320],
      align: 'center',
      valign: 'center'
    });

    // Add qr safe entry logo
    doc.rect(530, 485, 200, 60).fill('white')
      
    doc.image(safe_entry_logo_path, 556, 115, {
      fit: [150, 800],
      align: 'center',
      valign: 'center'
    });

    // Add qr description
    doc.fontSize(25)
      .font('Helvetica-Bold')
      .fill('black')
      .text(QR_DESCRIPTION, 485, 340, {
        width: 300,
        align: 'center',
        baseline: 'bottom'
      });

    // Add safe entry url
    doc.fontSize(15)
      .font('Helvetica')
      .fill('black')
      .text(safe_entry_url, 485, 710, {
        width: 300,
        align: 'center'
      });
      
    doc.end();
    
    console.log("completed pdf doc")

    // Pipe its output somewhere, like to a file or HTTP response
    doc.pipe(fs.createWriteStream('/tmp/' + slugify(QR_DESCRIPTION) + '.pdf'));
    console.log("saved pdf doc to: " + '/tmp/' + slugify(QR_DESCRIPTION) + '.pdf')

  } catch (error) {
    console.log(error)
    throw Error(error)
  }
}

generatePDF("NTUC Northpoint SE", "https://temperaturepass.ndi-api.gov.sg/login/PROD-S83CS0191L-NTUC-NORTHPOINT-SE")
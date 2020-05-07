const fs = require('fs');

const PDFDocument = require('pdfkit');
const QRCode = require('qrcode')
const slugify = require('slugify')

exports.handler =  async function(event, context) {
  try {
    console.log("start")
    // Create a document
    let doc = new PDFDocument({
      size: "A3",
      margin: 0,
    });
    let qr_description = "NTUC Northpoint SE"
    let company_logo_url = "https://s3-ap-southeast-1.amazonaws.com/www.fairprice.com.sg/fpol/media/images/wcm/corporate/Corporate_logo.png"
    let safe_entry_url = "https://temperaturepass.ndi-api.gov.sg/login/PROD-S83CS0191L-NTUC-NORTHPOINT-SE"
    let qr_code_image = await QRCode.toDataURL(safe_entry_url, { 
        errorCorrectionLevel: 'H',
        quality: 1,
        margin: 1,
      }
    )
    let poster_template_path = "assets/poster_template.jpg"
    let safe_entry_logo_path = "assets/SafeEntry_logo_inline.png"

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
      .text(qr_description, 485, 340, {
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

    // Pipe its output somewhere, like to a file or HTTP response
    console.log('/tmp/' + slugify(qr_description) + '.pdf')
    doc.pipe(fs.createWriteStream('/tmp/' + slugify(qr_description) + '.pdf'));

    let buffer = fs.readFileSync('/tmp/' + slugify(qr_description) + '.pdf').toString('BASE64');
    let file_data = fs.existsSync('/tmp/NTUC-Northpoint-SE.pdf')
    console.log(file_data)

    console.log(fs.readFileSync('/tmp/' + slugify(qr_description) + '.pdf'))

    let response = {
      statusCode: 200,
      headers: {'Content-type' : 'application/pdf'},
      body: buffer,
      isBase64Encoded : true,
    };

    // return response
    console.log(response)
    return response;
  } catch (error) {
    console.log(error)
    throw Error(error)
  }
}

exports.handler("event", "context")
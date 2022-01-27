function getTodayDate() {
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = `${dd}/${mm}/${yyyy}`;
return today;
}

function gatherHtmlAndSendEmail() {

  // Get today's date.
  var today = getTodayDate();
  var dateValues = today.split('/');
  var dayToday = dateValues[0];
  var monthToday = dateValues[1];

  // Activate Tasks spreadsheet.
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  // Get automations sheet.
  var automations = sheet.getSheetByName("Automations");

  // Get automation sheet data.
  var data = automations.getDataRange().getValues();

  // Gather and store all the data in variables from "Automations" sheet.
  for(var i = 1; i < data.length; i++) {
    var to = data[i][0];
    var cc = data[i][1];
    var bcc = data[i][2];
    var month_aut = data[i][3];
    if (month_aut.length > 2)
      month_aut = month_aut.split(',');
    var day_aut = data[i][4];
    if (day_aut.length > 2)
      day_aut = day_aut.split(',');
    var subject = data[i][5];
    var htmlFile = data[i][6];

    // Gather html file.
    var htmlBody = HtmlService.createHtmlOutputFromFile(htmlFile).getContent();

    // Send email body html template to email recipient(s).
    let mm = 0;
    while (mm < month_aut.length) {
      let dd = 0;
      while (dd < day_aut.length){
        if (dayToday === day_aut[dd] && monthToday.includes(month_aut[mm])){
            MailApp.sendEmail({
            to: to,
            cc: cc,
            bcc: bcc,
            subject: subject,
            htmlBody: htmlBody,
          });
        }
        dd++;
      }
      mm++;
    }
  }
}

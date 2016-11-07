var extend = require('extend'),
  path = require('path'),
  nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport'),
  emailTemplates = require('email-templates');
var log = require(__base + '/lib/logging');

var Mailer = function Mailer(options) {
  if (typeof options === 'undefined' || options === null) {
    var config = require(__base + 'config.' + process.env.NODE_ENV + '.json');
    options = config.mailer;
  }
  options = extend({}, options);

  this.transporter = nodemailer.createTransport(smtpTransport(options));
  this.message = {};
};

Mailer.prototype.send = function (message, callback) {
  var that = this;

  if (typeof message === 'undefined' || message === null || message === {}) {
    message = this.message;
  }

  var templatesDir = path.resolve(__dirname, '../..', 'client/templates/mailer');
  emailTemplates(templatesDir, function (err, template) {
    if (err) {
      return callback(err);
    }

    template(message.template, message.locals, function (err, html, text) {
      if (err) {
        return callback(err);
      }

      message.html = html;
      message.text = text;

      that.transporter.sendMail(message, callback);
    });
  });
};

/*
 * Instanciate the class and export a send email function
 */
var sendEmail = function (to, bcc, subj, template, locals, addAttachments, success, failure) {

  locals = locals || {};

  var attachmentsDir = path.resolve(__dirname, '../..', 'attachments');

  var mailer = new Mailer();
  var message = {
    'from': 'noreply@aci.it',
    'to': to,
    'bcc': bcc,
    'subject': '[CSU] ' + subj,
    'template': template,
    'locals': locals
  };

  if (addAttachments) {
    message.attachments = [
      {   // file on disk as an attachment
        filename: 'CONDIZIONI GENERALI DI SERVIZIO def.docx',
        path: attachmentsDir + "/CONDIZIONI GENERALI DI SERVIZIO def.docx" // stream this file
      },
      {   // file on disk as an attachment
        filename: 'Allegato A - Dichiarazione inerente il veicolo.docx',
        path: attachmentsDir + "/Allegato A - Dichiarazione inerente il veicolo.docx" // stream this file
      },
      {   // file on disk as an attachment
        filename: 'Allegato B - Documento tecnico.docx',
        path: attachmentsDir + "/Allegato B - Documento tecnico.docx" // stream this file
      }
    ];
  }

  mailer.send(message, function (err, info) {
    if (err) {
      return failure(err);
    } else {
      //log.info(JSON.stringify(info));
      return success();
    }
  });
};

module.exports = sendEmail;
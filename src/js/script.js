const $ = require('jquery');
const sudo = require('sudo-prompt');

require('popper.js');
require('bootstrap');

const sudo_option = {
  name: 'LAMP Administrative Privilege'
};

function switchToPhp5() {
  let command = 'a2dismod php7.2; a2enmod php5.6; update-alternatives --set php /usr/bin/php5.6';

  sudo.exec(command, sudo_option, function(err, stdout, stderr) {
    if (err) throw err;
  });
}

function switchToPhp7() {
  let command = 'a2dismod php5.6; a2enmod php7.2; update-alternatives --set php /usr/bin/php7.2';

  sudo.exec(command, sudo_option, function(err, stdout, stderr) {
    if (err) throw err;
  });
}

function checkPhpVersion() {
  let command = 'php -v';

  sudo.exec(command, sudo_option, function(err, stdout, stderr) {
    if(err) throw err;

    let current_php_version = stdout.substr(4, 3);

    $('#dropdown-php').val(current_php_version);
  });
}

function startApache() {
  let command = 'service apache2 start';

  sudo.exec(command, sudo_option, function(err, stdout, stderr) {
    if(err) throw err;
  });
}

function stopApache() {
  let command = 'service apache2 stop';

  sudo.exec(command, sudo_option, function(err, stdout, stderr) {
    if(err) throw err;
  });
}

function restartApache() {
  $('#switch-apache').attr('checked', false);

  let command = 'service apache2 restart';

  sudo.exec(command, sudo_option, function(err, stdout, stderr) {
    if(err) throw err;
  });
}

function checkApache() {
  let command = 'service apache2 status';

  sudo.exec(command, sudo_option, function(err, stdout, stderr) {
    if(err) throw err;

    console.log(stdout);
  });
}

$(document).ready(function() {
  $(function() {
    checkPhpVersion();
  });

  $('body').on('change', '#dropdown-php', function() {
    switch($(this).val()) {
      case '5.6':
        switchToPhp5();

        break;
      case '7.2':
        switchToPhp7();

        break;
      default:
        break;
    }

    checkPhpVersion();
  });
});

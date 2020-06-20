const exec = require('child_process').exec;
const sudo = require('sudo-prompt');
const $ = require('jquery');

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
  let shell = exec(command);

  shell.stdout.on('data', function(data) {
    let current_php_version = stdout.substr(4, 3);

    $('#dropdown-php').val(current_php_version);
  });

  shell.stderr.on('data', function(err) {
    console.error(err);
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
  let shell = exec(command);

  shell.stdout.on('data', function(data) {
    console.log(data);
  });

  shell.stderr.on('data', function(err) {
    console.error(err);
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

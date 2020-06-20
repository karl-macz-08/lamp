const $ = require('jquery');
const exec = require('child_process').exec;

require('popper.js');
require('bootstrap');

function switchToPhp5() {
  let shell = exec('sudo a2dismod php7.2; sudo a2enmod php5.6; sudo update-alternatives --set php /usr/bin/php5.6');

  shell.stderr.on('data', (data) => {
    console.error(data);
  });
}

function switchToPhp7() {
  let shell = exec('sudo a2dismod php5.6; sudo a2enmod php7.2; sudo update-alternatives --set php /usr/bin/php7.2');

  shell.stderr.on('data', (data) => {
    console.error(data);
  });
}

function checkPhpVersion() {
  let shell = exec('php -v');

  shell.stdout.on('data', (data) => {
    let current_php_version = data.substr(4, 3);

    $('#dropdown-php').val(current_php_version);
  });

  shell.stderr.on('data', (data) => {
    console.error(data);
  });
}

function startApache() {
  let shell = exec('sudo service apache2 start');

  shell.stderr.on('data', (data) => {
    console.error(data);
  });
}

function stopApache() {
  let shell = exec('sudo service apache2 stop');

  shell.stderr.on('data', (data) => {
    console.error(data);
  });
}

function restartApache() {
  $('#switch-apache').attr('checked', false);

  let shell = exec('sudo service apache2 restart');

  shell.stderr.on('data', (data) => {
    console.error(data);
  });
}

function checkApache() {
  let shell = exec('sudo service apache2 restart');

  shell.stderr.on('data', (data) => {
    console.error(data);
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

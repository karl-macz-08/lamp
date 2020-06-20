const exec = require('child_process').exec;
const sudo = require('sudo-prompt');
const $ = require('jquery');

require('popper.js');
require('bootstrap');

const sudo_option = {
  name: 'LAMP Administrative Privilege'
};

function checkPhpVersion() {
  let command = 'php -v';
  let shell = exec(command);

  shell.stdout.on('data', function(data) {
    let current_php_version = data.substr(4, 3);
    
    $('#dropdown-php').find('option:selected').attr('selected', false);
    $('#dropdown-php').find(`option[value="${current_php_version}"]`).attr('selected', true);
    $('#dropdown-php').val(current_php_version);
  });

  shell.stderr.on('data', function(err) {
    console.error(err);
  });
}

function checkApache() {
  let command = 'service apache2 status';
  let shell = exec(command);

  shell.stdout.on('data', function(data) {
    let status = data.split("\n")[2].trim();
    status = status.substring(8, status.indexOf('since') - 2);
    status = status.split(' ')[0];
    status = status[0].toUpperCase() + status.substring(1);

    switch(status) {
      case 'Active':
        tickApache();

        break;
      case 'Inactive':
        untickApache();
        
        break;
      default:
        break;
    }
  });

  shell.stderr.on('data', function(err) {
    console.error(err);
  });
}

function tickApache() {
  $('#switch-apache').attr('checked', true);
  $('#apache-status').text('Active');
  $('#apache-status').removeClass('text-danger').addClass('text-success');
}

function untickApache() {
  $('#switch-apache').attr('checked', false);
  $('#apache-status').text('Inactive');
  $('#apache-status').removeClass('text-success').addClass('text-danger');
}

function switchToPhp5() {
  let command = 'a2dismod php7.2; a2enmod php5.6; update-alternatives --set php /usr/bin/php5.6';

  sudo.exec(command, sudo_option, function(err, stdout, stderr) {
    if (err) throw err;

    checkPhpVersion();
    restartApache();
  });
}

function switchToPhp7() {
  let command = 'a2dismod php5.6; a2enmod php7.2; update-alternatives --set php /usr/bin/php7.2';

  sudo.exec(command, sudo_option, function(err, stdout, stderr) {
    if (err) throw err;

    checkPhpVersion();
    restartApache();
  });
}

function startApache() {
  let command = 'service apache2 start';

  sudo.exec(command, sudo_option, function(err, stdout, stderr) {
    if(err) throw err;

    checkApache();
  });
}

function stopApache() {
  let command = 'service apache2 stop';

  sudo.exec(command, sudo_option, function(err, stdout, stderr) {
    if(err) throw err;

    checkApache();
  });
}

function restartApache() {
  untickApache();

  let command = 'service apache2 restart';

  sudo.exec(command, sudo_option, function(err, stdout, stderr) {
    if(err) throw err;

    checkApache();
  });
}

$(document).ready(function() {
  $(function() {
    checkPhpVersion();
    checkApache();
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
  });

  $('body').on('change', '#switch-apache', function() {
    $('#apache-status').html(`<div class="spinner-border spinner-border-sm text-dark">
        <span class="sr-only">Loading...</span>
      </div>`);
    
    if($(this).is(':checked')) {
      startApache();
    } else {
      stopApache();
    }
  });
});

(function() {

  /*
  Deliverable 1
  Author: Jeremy Fox
  Created For: VFW Online
  Simple HTML5 / Javascript Mobile Web Form
  */

  var add0;

  this.storeData = function() {};

  this.getData = function() {};

  this.addAccount = function(account) {};

  this.getAccounts = function() {
    var account, accountStripped, accounts, output, _i, _len;
    accounts = ["Bank of America - Checking", "Bank of America - Savings", "Bank of America - Credit Card"];
    document.write("<select id=\"payFrom\" required aria-required=\"true\">");
    for (_i = 0, _len = accounts.length; _i < _len; _i++) {
      account = accounts[_i];
      accountStripped = account.toLowerCase();
      accountStripped = accountStripped.replace(/\s+/g, "");
      output = "<option value=\"" + accountStripped + "\" />" + account + "</option>    ";
      document.write(output);
    }
    return document.write("</select>");
  };

  this.currentDate = function() {
    var currentTime, day, month, showDate, year;
    currentTime = new Date();
    month = currentTime.getMonth() + 1;
    day = currentTime.getDate();
    year = currentTime.getFullYear();
    showDate = year + "-" + add0(month) + "-" + add0(day);
    return document.getElementById("payOn").value = showDate;
  };

  add0 = function(n) {
    if (n < 10) {
      return "0" + n;
    } else {
      return "" + n;
    }
  };

  this.uncheckYes = function() {
    return document.getElementById("rememberYes").checked = "false";
  };

  this.uncheckNo = function() {
    return document.getElementById("rememberNo").checked = "false";
  };

}).call(this);

/*
  Deliverable 1
  Author: Jeremy Fox
  Created For: VFW Online
  Simple HTML5 / Javascript Mobile Web Form
  */

  this.saveData = function() {};

  this.pullData = function() {};

  this.getAccounts = function() {
    var account, accountStripped, accounts, output, _i, _len, _results;
    accounts = ["Bank of America - Checking", "Bank of America - Savings", "Bank of America - Credit Card"];
    _results = [];
    for (_i = 0, _len = accounts.length; _i < _len; _i++) {
      account = accounts[_i];
      accountStripped = account.toLowerCase();
      accountStripped = accountStripped.replace(/\s+/g, "");
      output = "" + account + ": <input type=\"radio\" name=\"test\" value=\"" + accountStripped + "\" id=\"\" /><br />";
      _results.push(document.write(output));
    }
    return _results;
  };

  this.showValue = function(newValue) {
    return document.getElementById("range").innerHTML = newValue;
  };

  this.currentDate = function() {
    var currentTime, day, month, showDate, year;
    currentTime = new Date();
    month = currentTime.getMonth() + 1;
    day = currentTime.getDate();
    year = currentTime.getFullYear();
    showDate = year + "-" + month + "-" + day;
    return document.getElementById("date").value = showDate;
  };

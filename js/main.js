(function() {

  /*
  Deliverable 1
  Author: Jeremy Fox
  Created For: VFW Online
  Simple HTML5 / Javascript Mobile Web Form
  */

  var add0, currentDate, getAccounts, getFavValue;

  this.storeData = function() {
    var item, itemId, newDate;
    newDate = new Date();
    itemId = newDate.getTime();
    item = {};
    item.name = ["Name:", $("#name").val()];
    item.payto = ["Pay To:", $("#payTo").val()];
    item.amount = ["Amount:", $("#payAmount").val()];
    item.account = ["From Account:", $("#payFrom").val()];
    item.payon = ["Pay On:", $("#payOn").val()];
    item.notes = ["Notes:", $("#notes").val()];
    item.remember = ["Remember This Payment:", getFavValue()];
    try {
      localStorage.setItem(itemId, JSON.stringify(item));
      return alert("Bill Added!");
    } catch (e) {
      if (e === QUOTA_EXCEEDED_ERR) return alert('Quota exceeded!');
    }
  };

  getFavValue = function() {
    var radio, radios, rememberValue, _i, _len;
    radios = document.forms[0].remember;
    for (_i = 0, _len = radios.length; _i < _len; _i++) {
      radio = radios[_i];
      if (radio.checked) {
        rememberValue = "";
        rememberValue = radio.value;
        return rememberValue;
      }
    }
  };

  this.getData = function() {};

  this.addAccount = function(account) {};

  getAccounts = function() {
    var account, accounts, liSelect, makeOpt, makeSelect, _i, _len;
    accounts = ["Bank of America - Checking", "Bank of America - Savings", "Bank of America - Credit Card"];
    liSelect = document.getElementById("selectAccounts");
    makeSelect = document.createElement("select");
    makeSelect.setAttribute("id", "payFrom");
    for (_i = 0, _len = accounts.length; _i < _len; _i++) {
      account = accounts[_i];
      makeOpt = document.createElement("option");
      makeOpt.setAttribute("value", account);
      makeOpt.innerHTML = account;
      makeSelect.appendChild(makeOpt);
    }
    liSelect.appendChild(makeSelect);
  };

  currentDate = function() {
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

  $(document).bind("mobileinit", function() {
    $.mobile.accounts = getAccounts;
    $.mobile.date = currentDate;
  });

}).call(this);

(function() {

  /*
  Deliverable 1
  Author: Jeremy Fox
  Created For: VFW Online
  Simple HTML5 / Javascript Mobile Web Form
  */

  /*
  Main Metheds
  */

  var add0, currentDate, getAccounts, getFavValue, hideBillForm, hideItems, stopEvent, validateRequiredFields, viewBillForm, viewItems;

  this.storeData = function() {
    var item, itemId, message, messages, newDate;
    newDate = new Date();
    itemId = newDate.getTime();
    messages = validateRequiredFields();
    if (!_.isEmpty(messages)) {
      message = messages.join('\n');
      return alert(message);
    } else {
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
        alert("Bill Added!");
        this.setDataState();
      } catch (e) {
        return alert(e);
      }
    }
  };

  this.getData = function() {
    var makeList;
    if (_.size(localStorage) > 0) {
      makeList = document.createElement("ul");
      $("#items").append(makeList);
      _.each(_.keys(localStorage), function(key) {
        var billObj, makeListItem, makeSubList, value;
        makeListItem = document.createElement("li");
        makeList.appendChild(makeListItem);
        value = localStorage.getItem(key);
        billObj = JSON.parse(value);
        makeSubList = document.createElement("ul");
        makeListItem.appendChild(makeSubList);
        _.each(billObj, function(bill) {
          var makeSubListItem, optSubText;
          makeSubListItem = document.createElement("li");
          makeSubList.appendChild(makeSubListItem);
          optSubText = bill[0] + " " + bill[1];
          makeSubListItem.innerHTML = optSubText;
          return true;
        });
        return true;
      });
      return true;
    }
  };

  this.addAccount = function(account) {};

  this.clearStorage = function() {
    localStorage.clear();
    return alert("All Data Has Been Deleted.");
  };

  this.setDataState = function() {
    if ($("#billForm").css("visibility") === "visible") {
      if (localStorage.length > 0) {
        hideBillForm();
        viewItems();
        getData();
        $("#displayData").text("Display Form");
      } else {
        return alert("Nothing To Display. Please Add A New Bill And Try Again.");
      }
    } else if ($("#billForm").css("visibility") === "hidden") {
      hideItems();
      $("#displayData").text("Display Data");
      viewBillForm();
    }
  };

  $("#billForm").live("submit", function(e) {
    var formdata;
    stopEvent(e);
    formdata = $(this).serialize();
    $.ajax({
      type: "POST",
      url: "additem.html",
      data: formdata,
      success: function() {
        return storeData();
      }
    });
    return false;
  });

  /*
  Helper Methods
  */

  add0 = function(n) {
    if (n < 10) {
      return "0" + n;
    } else {
      return "" + n;
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

  validateRequiredFields = function() {
    var message;
    message = [];
    if ($("#name").val() === null || $("#name").val() === "") {
      message.push("Please Enter Your Name.");
    }
    if ($("#payTo").val() === null || $("#payTo").val() === "") {
      message.push("Please Enter Who You Would Like To Pay.");
    }
    if ($("#payAmount").val() === null || $("#payAmount").val() === 0) {
      message.push("Please Enter The Amount To Pay.");
    }
    if ($("#payFrom").val() === null || $("#payFrom").val() === "" || $("#payFrom").val() === "-- Choose Account --") {
      message.push("Please Enter The Account To Pay From.");
    }
    if ($("#payOn").val() === null || $("#payOn").val() === "") {
      message.push("Please Enter The Date You Would Like To Make This Payment.");
    }
    return message;
  };

  stopEvent = function(event) {
    event.preventDefault();
    event.stopPropagation();
    if ($.browser.msie) {
      event.originalEvent.keyCode = 0;
      event.originalEvent.cancelBubble = true;
      return event.originalEvent.returnValue = false;
    }
  };

  viewItems = function() {
    $("#items").css("visibility", "visible");
  };

  hideItems = function() {
    $("#items").css("visibility", "hidden");
  };

  viewBillForm = function() {
    $("#billForm").css("visibility", "visible");
  };

  hideBillForm = function() {
    $("#billForm").css("visibility", "hidden");
  };

  /*
  Bind to jQueries mobileinit
  */

  $(document).bind("mobileinit", function() {
    $.mobile.accounts = getAccounts;
    $.mobile.date = currentDate;
  });

  getAccounts = function() {
    var account, accounts, liSelect, makeOpt, makeSelect, _i, _len;
    accounts = ["-- Choose Account --", "Bank of America - Checking", "Bank of America - Savings", "Bank of America - Credit Card"];
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

}).call(this);

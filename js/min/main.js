
/*
Deliverable 1
Author: Jeremy Fox
Created For: MiU Online
Simple HTML5 / Javascript Mobile Web Form
*/

/*
Variables
*/

(function() {
  var add0, billAccounts, currentDate, deleteItem, destroyDataSet, destroyDetailsDataSet, editItem, getAccounts, getData, getDataDisplayed, getDetailsKey, getFavValue, getInvalidated, getViewState, hideBillForm, hideItems, qryBills, setDataDisplayed, setDetailsKey, setInvalidated, setViewState, showAccount, showBillDetails, stopEvent, storeJsonData, unBindClickListeners, validateDate, validateRequiredFields, viewBillForm, viewItems,
    _this = this;

  this.dataViewState = false;

  this.hasDataBeenDisplayed = false;

  this.invalidateData = false;

  this.keyToEdit = 0;

  billAccounts = ["-- Choose Account --", "Bank of America - Checking", "Bank of America - Savings", "Bank of America - Credit Card"];

  this.detailsKey = "";

  /*
  State Control Methods
  */

  setViewState = function(state) {
    return _this.dataViewState = state;
  };

  getViewState = function() {
    return _this.dataViewState;
  };

  setDataDisplayed = function(val) {
    return _this.hasDataBeenDisplayed = val;
  };

  getDataDisplayed = function() {
    return _this.hasDataBeenDisplayed;
  };

  setInvalidated = function(val) {
    return _this.invalidateData = val;
  };

  getInvalidated = function() {
    return _this.invalidateData;
  };

  setDetailsKey = function(key) {
    return _this.detailsKey = key;
  };

  getDetailsKey = function() {
    return _this.detailsKey;
  };

  destroyDataSet = function() {
    return $("#items").empty();
  };

  destroyDetailsDataSet = function() {
    return $("#itemDetails").empty();
  };

  /*
  Getter and Setter for key to edit
  */

  this.getKeyToEdit = function() {
    return _this.keyToEdit;
  };

  this.setKeyToEdit = function(key) {
    return _this.keyToEdit = key;
  };

  /*
  Main Metheds
  */

  this.storeData = function() {
    var item, itemId, message, messages, newDate;
    newDate = new Date();
    if (_this.getKeyToEdit() === 0 || _this.getKeyToEdit() === "") {
      itemId = newDate.getTime();
    } else {
      itemId = _this.getKeyToEdit();
    }
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
        setInvalidated(true);
        alert("Bill Added!");
        _this.setKeyToEdit(0);
        $("legend").html("<h2>Create a New Bill</h2>");
        _this.displayData();
      } catch (e) {
        return alert(e);
      }
    }
  };

  storeJsonData = function() {
    _.each(_.keys(_this.json), function(key) {
      var item;
      item = this.json[key];
      try {
        localStorage.setItem(key, JSON.stringify(item));
      } catch (e) {
        return alert(e);
      }
    });
    setInvalidated(true);
    return getData();
  };

  getData = function() {
    if (_.size(localStorage) > 0) {
      return qryBills(localStorage, "localStorage");
    } else {
      return storeJsonData();
    }
  };

  qryBills = function(storage, from) {
    var i;
    i = 1;
    return _.each(_.keys(storage), function(key) {
      var billObj, makeDeleteIcon, makeLink, makeListItem, payAmount, payDate, payTo, value;
      makeListItem = document.createElement("li");
      makeListItem.setAttribute("id", "li-key-" + key);
      makeDeleteIcon = document.createElement("img");
      makeDeleteIcon.setAttribute("src", "i/arrow.png");
      makeDeleteIcon.setAttribute("class", "listIcons");
      makeDeleteIcon.setAttribute("id", "delete-" + key);
      if (_.size(storage) === i) {
        makeListItem.setAttribute("class", "lastBill");
      } else {
        makeListItem.setAttribute("class", "bill");
      }
      makeLink = document.createElement("a");
      makeLink.setAttribute("href", "#");
      makeListItem.appendChild(makeLink);
      makeListItem.appendChild(makeDeleteIcon);
      $("#items").append(makeListItem);
      $("#li-key-" + key).click("click", function(e) {
        stopEvent(e);
        setDetailsKey(key);
        $.mobile.changePage("details.html", {
          showLoadMsg: true
        });
        return false;
      });
      value = storage.getItem(key);
      billObj = JSON.parse(value);
      payTo = billObj.payto[0] + " " + billObj.payto[1];
      payAmount = "$" + billObj.amount[1];
      payDate = "(" + billObj.payon[1] + ")";
      makeLink.innerHTML = payTo + " " + payAmount + " " + payDate;
      return i++;
    });
  };

  editItem = function(key) {
    var bill, radio, radios, value, _i, _len, _results;
    value = localStorage.getItem(key);
    bill = JSON.parse(value);
    _this.setKeyToEdit(key);
    $("legend").html("<h2>Your Editing a Bill - <a href=\"additem.html\" data-ajax=\"false\" >Cancel</a></h2>");
    _this.displayData();
    /*
      Unfortunately, due to a bug in jQuery, we can not use $("objectId").val("something")
      to set the values. We have to use the native javascipt method
      document.getElementById("objectId").value = "something"
    */
    document.getElementById('name').value = bill.name[1];
    document.getElementById('payTo').value = bill.payto[1];
    document.getElementById('payAmount').value = bill.amount[1];
    document.getElementById('payFrom').value = bill.account[1];
    document.getElementById('payOn').value = bill.payon[1];
    document.getElementById('notes').value = bill.notes[1];
    radios = document.forms[0].remember;
    _results = [];
    for (_i = 0, _len = radios.length; _i < _len; _i++) {
      radio = radios[_i];
      if (radio.value === "Yes" && bill.remember[1] === "Yes") {
        radio.setAttribute("checked", "checked");
        document.getElementById("labelNo").setAttribute("class", "ui-btn ui-corner-right ui-controlgroup-last ui-radio-off ui-btn-up-c");
        _results.push(document.getElementById("labelYes").setAttribute("class", "ui-btn ui-corner-left ui-btn-up-c ui-radio-on ui-btn-active"));
      } else if (radio.value === "No" && bill.remember[1] === "No") {
        radio.setAttribute("checked", "checked");
        document.getElementById("labelYes").setAttribute("class", "ui-btn ui-radio-off ui-corner-left ui-btn-up-c");
        _results.push(document.getElementById("labelNo").setAttribute("class", "ui-btn ui-corner-right ui-controlgroup-last ui-radio-on ui-btn-active ui-btn-up-c"));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  deleteItem = function(key) {
    var ask;
    ask = confirm("Are you sure you want to delete this bill?");
    if (ask) {
      $("#bill-" + key).animate({
        opacity: 0.00,
        height: 'toggle'
      }, 1000);
      if (_.size(localStorage) > 1) {
        localStorage.removeItem(key);
        return setInvalidated(true);
      } else if (_.size(localStorage) === 1) {
        localStorage.removeItem(key);
        setInvalidated(true);
        return setTimeout(function() {
          return this.displayData();
        }, 1000);
      }
    } else {
      return alert("Bill was not deleted");
    }
  };

  showAccount = function(key) {
    return $("#li-account-" + key).animate({
      opacity: 0.00
    }, 500, function() {
      return $("#li-account-" + key).animate({
        opacity: 1.00
      }, 500, function() {});
    });
  };

  this.addAccount = function(account) {};

  this.clearStorage = function() {
    localStorage.clear();
    return alert("All Data Has Been Deleted.");
  };

  /*
  Click Events
  */

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

  $("#billSearch").click("click", function(e) {
    $("#searchFormContainer").css("display", "block");
    $("#searchFormContainer").animate({
      opacity: 1.00
    }, 1000);
    $("#billSearch").animate({
      opacity: 0.00
    }, 500);
    setTimeout(function() {
      return $("#billSearch").css("display", "none");
    }, 500);
    return setTimeout(function() {
      $("#billSearchHide").css("display", "inline");
      return $("#billSearchHide").animate({
        opacity: 1.00
      }, 500);
    }, 500);
  });

  $("#billSearchHide").click("click", function(e) {
    $("#searchFormContainer").animate({
      opacity: 0.00
    }, 1000);
    setTimeout(function() {
      return $("#searchFormContainer").css("display", "none");
    }, 1000);
    $("#billSearchHide").animate({
      opacity: 0.00
    }, 500);
    setTimeout(function() {
      return $("#billSearchHide").css("display", "none");
    }, 500);
    return setTimeout(function() {
      $("#billSearch").css("display", "inline");
      return $("#billSearch").animate({
        opacity: 1.00
      }, 500);
    }, 500);
  });

  $("#viewBills").click("click", function(e) {
    stopEvent(e);
    setTimeout(function() {
      return this.displayData(true, false);
    }, 500);
    return $.mobile.changePage("additem.html", {
      transition: "slideup",
      showLoadMsg: true
    });
  });

  $("#addBill").click("click", function(e) {
    stopEvent(e);
    setTimeout(function() {
      return this.displayData(false, true);
    }, 500);
    return $.mobile.changePage("additem.html", {
      showLoadMsg: true
    });
  });

  $("#cta-bills").click("click", function(e) {
    stopEvent(e);
    setTimeout(function() {
      return this.displayData(false, true);
    }, 500);
    return $.mobile.changePage("additem.html", {
      showLoadMsg: true
    });
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
    if (validateDate($("#payOn").val())) {
      message.push("Please Enter A Valid Date.");
    }
    return message;
  };

  validateDate = function(date) {
    var OPERATOR, currentTime, dateArray, day, invalidDate, matchDate, month, year;
    invalidDate = false;
    OPERATOR = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    matchDate = date.match(OPERATOR);
    if (matchDate.length <= 0) invalidDate = true;
    currentTime = new Date();
    month = "";
    month = currentTime.getMonth() + 1;
    day = "";
    day = currentTime.getDate();
    year = "";
    year = currentTime.getFullYear();
    dateArray = _.toArray(date.split("-"));
    if (dateArray[0] < year) {
      invalidDate = true;
      console.log("Entered Year =" + dateArray[0] + ". Current Year =" + year);
    }
    if (dateArray[1] < add0(month)) {
      invalidDate = true;
      console.log("Entered Month =" + dateArray[1] + ". Current Month =" + add0(month));
    }
    if (dateArray[2] < add0(day) && dateArray[1] === add0(month)) {
      invalidDate = true;
      console.log("Entered Day =" + dateArray[2] + ". Current Day =" + add0(day));
    }
    if (invalidDate !== null || invalidDate !== "" && _.isBoolean(invalidDate)) {
      return invalidDate;
    } else {
      return alert("ERROR: Please Try Again.");
    }
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
    $("#itemsSection").css("display", "inline-block");
  };

  hideItems = function() {
    $("#itemsSection").css("display", "none");
  };

  viewBillForm = function() {
    $("#billForm").css("display", "inline");
  };

  hideBillForm = function() {
    $("#billForm").css("display", "none");
  };

  this.displayData = function(showBills, showForm) {
    var bills, form;
    bills = (showBills !== null || showBills !== "" ? showBills : false);
    form = (showForm !== null || showForm !== "" ? showForm : false);
    if (form) {
      _this.showForm();
    } else if (bills) {
      _this.showBills();
    } else if (getViewState()) {
      _this.showForm();
    } else {
      _this.showBills();
    }
  };

  this.showForm = function() {
    setViewState(false);
    hideItems();
    viewBillForm();
    $("#displayData").text("Display Data");
    $("#displayData").css("padding", "0.65em 15px 0.6em 15px");
  };

  this.showBills = function() {
    setViewState(true);
    hideBillForm();
    viewItems();
    if (getDataDisplayed() === false || getInvalidated()) {
      destroyDataSet();
      getData();
      setDataDisplayed(true);
      setInvalidated(false);
    }
    $("#displayData").text("Display Form");
    $("#displayData").css("padding", "0.65em 15px 0.6em 15px");
  };

  unBindClickListeners = function() {
    return $(document).unbind("click");
  };

  /*
  Bind to jQueries mobileinit
  */

  $(document).bind("mobileinit", function() {
    $.mobile.accounts = getAccounts;
    $.mobile.date = currentDate;
    $.mobile.details = showBillDetails;
  });

  getAccounts = function() {
    var account, liSelect, makeOpt, makeSelect, _i, _len;
    liSelect = document.getElementById("selectAccounts");
    makeSelect = document.createElement("select");
    makeSelect.setAttribute("id", "payFrom");
    for (_i = 0, _len = billAccounts.length; _i < _len; _i++) {
      account = billAccounts[_i];
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

  showBillDetails = function(key) {
    var OPERATOR, account, accountMatch, billObj, makeAccountIcon, makeDeleteIcon, makeEditIcon, makeList, makeListItem, makeSubList, value;
    key = (key !== void 0 ? key : getDetailsKey());
    destroyDetailsDataSet();
    makeList = document.createElement("ul");
    $("#itemDetails").append(makeList);
    makeListItem = document.createElement("li");
    makeList.appendChild(makeListItem);
    value = localStorage[key];
    billObj = JSON.parse(value);
    makeSubList = document.createElement("ul");
    makeSubList.setAttribute("id", "bill-" + key);
    makeEditIcon = document.createElement("img");
    makeEditIcon.setAttribute("src", "i/pencil.png");
    makeEditIcon.setAttribute("class", "icons");
    makeEditIcon.setAttribute("id", "edit-" + key);
    makeDeleteIcon = document.createElement("img");
    makeDeleteIcon.setAttribute("src", "i/x.png");
    makeDeleteIcon.setAttribute("class", "icons");
    makeDeleteIcon.setAttribute("id", "delete-" + key);
    makeAccountIcon = document.createElement("img");
    OPERATOR = /((Checking)|(Savings)|(Credit\sCard))+/g;
    account = billObj.account[1];
    accountMatch = account.match(OPERATOR);
    switch (accountMatch[0]) {
      case "Checking":
        makeAccountIcon.setAttribute("src", "i/thumb_checking.png");
        break;
      case "Savings":
        makeAccountIcon.setAttribute("src", "i/thumb_savings.png");
        break;
      case "Credit Card":
        makeAccountIcon.setAttribute("src", "i/thumb_creditcard.png");
    }
    makeAccountIcon.setAttribute("class", "icons");
    makeAccountIcon.setAttribute("id", "account-" + key);
    makeSubList.appendChild(makeEditIcon);
    makeSubList.appendChild(makeDeleteIcon);
    makeSubList.appendChild(makeAccountIcon);
    makeListItem.appendChild(makeSubList);
    $("#edit-" + key).click("click", function(e) {
      return editItem(key);
    });
    $("#delete-" + key).click("click", function(e) {
      alert("here");
      return deleteItem(key);
    });
    $("#account-" + key).click("click", function(e) {
      return showAccount(key);
    });
    _.each(billObj, function(bill) {
      var field, makeSubListItem;
      makeSubListItem = document.createElement("li");
      if (bill[0] === "From Account:") {
        makeSubListItem.setAttribute("id", "li-account-" + key);
      }
      makeSubList.appendChild(makeSubListItem);
      field = document.createElement("span");
      value = document.createElement("span");
      field.setAttribute("class", "billField");
      value.setAttribute("class", "billValue");
      makeSubListItem.appendChild(field);
      makeSubListItem.appendChild(value);
      field.innerHTML = bill[0] + " ";
      value.innerHTML = bill[1];
      return true;
    });
    return true;
  };

}).call(this);

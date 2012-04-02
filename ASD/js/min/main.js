
/*
Deliverable 1
Author: Jeremy Fox
Created For: ASD Online
main.coffee (main.js)
*/

/*
Variables
*/

(function() {
  var add0, billAccounts, currentDate, deleteItem, destroyDataSet, destroyDetailsDataSet, editItem, getAccounts, getData, getDataDisplayed, getDetailsKey, getFavValue, getInvalidated, getViewState, hideBillForm, hideItems, qryBills, setDataDisplayed, setDetailsKey, setInvalidated, setViewState, setupBills, showAccount, showBillDetails, stopEvent, storeJsonData, storeRemoteJsonData, unBindClickListeners, validateDate, validateRequiredFields, viewBillForm, viewItems,
    _this = this;

  this.dataViewState = false;

  this.hasDataBeenDisplayed = false;

  this.invalidateData = false;

  this.keyToEdit = 0;

  billAccounts = ["Please Select An Account", "Bank of America - Checking", "Bank of America - Savings", "Bank of America - Credit Card"];

  this.detailsKey = "";

  /***********************************************************
  State Control Methods
  **********************************************************
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

  destroyDataSet = function() {
    return $("#items").empty();
  };

  destroyDetailsDataSet = function() {
    return $("#itemDetails").empty();
  };

  /***********************************************************
  Getter and Setter for key to edit
  **********************************************************
  */

  this.getKeyToEdit = function() {
    return _this.keyToEdit;
  };

  this.setKeyToEdit = function(key) {
    return _this.keyToEdit = key;
  };

  /***********************************************************
  Getter and Setter for details key
  **********************************************************
  */

  setDetailsKey = function(key) {
    return _this.detailsKey = key;
  };

  getDetailsKey = function() {
    return _this.detailsKey;
  };

  /***********************************************************
  Main Metheds
  **********************************************************
  */

  this.storeData = function() {
    var item, itemId, newDate;
    newDate = new Date();
    if (_this.getKeyToEdit() === 0 || _this.getKeyToEdit() === "") {
      itemId = newDate.getTime();
    } else {
      itemId = _this.getKeyToEdit();
    }
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
  };

  $(window).scroll(function() {
    if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
      $("div#loadmoreajaxloader").show();
      return $.ajax({
        type: "POST",
        url: "php/load_bills.php",
        success: function(json) {
          if (getViewState()) {
            if (json) {
              return storeRemoteJsonData(json);
            } else {
              return $("div#loadmoreajaxloader").hide();
            }
          } else {
            return $("div#loadmoreajaxloader").hide();
          }
        }
      });
    }
  });

  storeRemoteJsonData = function(json) {
    _.each(_.keys(json), function(key) {
      var billIndexKey;
      billIndexKey = key;
      return _.each(_.keys(json[key]), function(key) {
        var billObject, item;
        item = json[billIndexKey];
        billObject = item[key];
        try {
          localStorage.setItem(key, JSON.stringify(billObject));
          return true;
        } catch (e) {
          return alert(e);
        }
      });
    });
    setInvalidated(true);
    $("div#loadmoreajaxloader").hide();
    return getData();
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

  setupBills = function() {
    var billsList, callbackFunc;
    billsList = [];
    _.each(_.keys(localStorage), function(key) {
      var billObj, value;
      value = localStorage.getItem(key);
      billObj = JSON.parse(value);
      billObj.key = key;
      return billsList.push(billObj);
    });
    callbackFunc = function(a, b) {
      if (a.payon[1] === b.payon[1]) {
        if (a.payon[1] === b.payon[1]) return 0;
        return (a.payon[1] < b.payon[1] ? -1 : 1);
      }
      if (a.payon[1] < b.payon[1]) {
        return -1;
      } else {
        return 1;
      }
    };
    return billsList.sort(callbackFunc);
  };

  qryBills = function() {
    var i;
    i = 1;
    return _.each(setupBills(), function(bill) {
      var OPERATOR, account, accountMatch, key, makeArrowIcon, makeLink, makeListItem, makeThumbIcon, payAmount, payDate, payTo;
      key = bill.key;
      makeListItem = $("<li>");
      makeListItem.attr("id", "li-key-" + key);
      makeThumbIcon = $("<img>");
      makeThumbIcon.attr("class", "listThumbIcons");
      OPERATOR = /((Checking)|(Savings)|(Credit\sCard))+/g;
      account = bill.account[1];
      accountMatch = account.match(OPERATOR);
      switch (accountMatch[0]) {
        case "Checking":
          makeThumbIcon.attr("src", "i/checking_thumb.png");
          break;
        case "Savings":
          makeThumbIcon.attr("src", "i/savings_thumb.png");
          break;
        case "Credit Card":
          makeThumbIcon.attr("src", "i/credit_thumb.png");
          break;
        default:
          makeThumbIcon.attr("src", "i/checking_thumb.png");
      }
      makeArrowIcon = $("<img>");
      makeArrowIcon.attr("src", "i/arrow.png");
      makeArrowIcon.attr("class", "listArrowIcons");
      if (_.size(localStorage) === i) {
        makeListItem.attr("class", "lastBill");
      } else {
        makeListItem.attr("class", "bill");
      }
      makeLink = $("<a>");
      makeLink.attr("href", "#");
      makeListItem.append(makeLink);
      makeListItem.append(makeThumbIcon);
      makeListItem.append(makeArrowIcon);
      $("#items").append(makeListItem);
      $("#li-key-" + key).click("click", function(e) {
        stopEvent(e);
        $(this).removeClass("bill").addClass("billClicked");
        setDetailsKey(key);
        $.mobile.changePage("details.html", {
          showLoadMsg: true
        });
        return false;
      });
      payTo = bill.payto[1];
      if (payTo.length >= 20) payTo = payTo.substr(0, 20) + "…";
      payAmount = "$" + bill.amount[1];
      payDate = "(" + bill.payon[1] + ")";
      makeLink.html(payTo + " " + payAmount + " " + payDate);
      return i++;
    });
  };

  editItem = function(key) {
    var bill, radio, radios, value, _i, _len;
    value = localStorage.getItem(key);
    bill = JSON.parse(value);
    _this.setKeyToEdit(key);
    $("legend").html("<h2>Your Editing a Bill - <a href=\"#\" id=\"cancelEdit\" data-ajax=\"false\" >Cancel</a></h2>");
    $("#cancelEdit").click("click", function(e) {
      return $.mobile.changePage('additem.html', {
        reloadPage: true,
        allowSamePageTranstion: true,
        transition: 'slide'
      });
    });
    $('#name').val(bill.name[1]);
    $('#payTo').val(bill.payto[1]);
    $('#payAmount').val(bill.amount[1]);
    $('#payFrom').val(bill.account[1]);
    $('#payOn').val(bill.payon[1]);
    $('#notes').val(bill.notes[1]);
    radios = $("input[type='radio']");
    for (_i = 0, _len = radios.length; _i < _len; _i++) {
      radio = radios[_i];
      if (radio.value === "Yes" && bill.remember[1] === "Yes") {
        $(radio).attr("checked", "checked");
        $("#labelNo").attr("class", "ui-btn ui-corner-right ui-controlgroup-last ui-radio-off ui-btn-up-c");
        $("#labelYes").attr("class", "ui-btn ui-corner-left ui-btn-up-c ui-radio-on ui-btn-active");
      } else if (radio.value === "No" && bill.remember[1] === "No") {
        $(radio).attr("checked", "checked");
        $("#labelYes").attr("class", "ui-btn ui-radio-off ui-corner-left ui-btn-up-c");
        $("#labelNo").attr("class", "ui-btn ui-corner-right ui-controlgroup-last ui-radio-on ui-btn-active ui-btn-up-c");
      }
    }
    history.back();
    return setTimeout(function() {
      return this.displayData();
    }, 500);
  };

  deleteItem = function(key) {
    var ask;
    ask = confirm("Are you sure you want to delete this bill?");
    if (ask) {
      $("#bill-" + key).animate({
        opacity: 0.00,
        height: 'toggle'
      }, 1000);
      setTimeout(function() {
        localStorage.removeItem(key);
        setInvalidated(true);
        history.back();
        return this.displayData(true, false);
      }, 1000);
      return false;
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

  /***********************************************************
  Click Events
  **********************************************************
  */

  $("#billForm").live("submit", function(e) {
    var formdata;
    stopEvent(e);
    if ($("#billForm").valid()) {
      formdata = $(this).serialize();
      $.ajax({
        type: "POST",
        url: "additem.html",
        data: formdata,
        success: function() {
          return storeData();
        }
      });
    } else {
      $('html, body').animate({
        scrollTop: 0
      }, 0);
    }
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
    }, 700);
    return $.mobile.changePage("additem.html", {
      transition: "slideup",
      showLoadMsg: true
    });
  });

  $("#accounts").click("click", function(e) {
    stopEvent(e);
    return $.mobile.changePage("accounts.html", {
      showLoadMsg: true
    });
  });

  $("#faq").click("click", function(e) {
    stopEvent(e);
    return $.mobile.changePage("faq.html", {
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

  $("#searchForm").submit(function(e) {
    stopEvent(e);
    setTimeout(function() {
      return this.displayData(true, false);
    }, 500);
    $.mobile.changePage("additem.html", {
      showLoadMsg: true
    });
    return false;
  });

  /***********************************************************
  Helper Methods
  **********************************************************
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
    radios = $("input[type='radio']");
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
    $("#displayData").text("Load JSON");
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
    $("#displayData").text("Show Form");
    $("#displayData").css("padding", "0.65em 15px 0.6em 15px");
  };

  unBindClickListeners = function() {
    return $(document).unbind("click");
  };

  /***********************************************************
  Add Account Page Form Methods
  **********************************************************
  */

  this.actBank = function() {
    if ($("#accountBank").val() !== null && $("#accountBank").val() !== "") {
      return $("#actType").removeClass("hide").addClass("show");
    } else {
      return alert("Please enter your bank account to conitue.");
    }
  };

  this.actType = function() {
    if ($("#accountType").val() !== null && $("#accountType").val() !== "") {
      if ($("#accountType").val() === "credit") {
        return $("#actExp").removeClass("hide").addClass("show");
      } else {
        $("#actExp").removeClass("show").addClass("hide");
        return $("#actNum").removeClass("hide").addClass("show");
      }
    } else {
      return alert("Please enter the account type to conitue.");
    }
  };

  this.actExp = function() {
    if ($("#accountExpiration").val() !== null && $("#accountExpiration").val() !== "") {
      return $("#actNum").removeClass("hide").addClass("show");
    } else {
      return alert("Please enter your credit cards expiration date to conitue.");
    }
  };

  this.actNum = function() {
    if ($("#accountNumber").val() !== null && $("#accountNumber").val() !== "") {
      return $("#accountSubmitBtn").removeClass("hide").addClass("show");
    } else {
      return alert("Please enter your credit cards expiration date to conitue.");
    }
  };

  $("#accountForm").live("submit", function(e) {
    var formdata;
    stopEvent(e);
    formdata = $(this).serialize();
    return $.ajax({
      type: "POST",
      url: "accounts.html",
      data: formdata,
      success: function() {
        return alert("Your account has been added! --THIS IS NOT ACTUALLING DOING ANYTHING JUST YET!--");
      }
    });
  });

  /***********************************************************
  Bind to jQueries mobileinit
  **********************************************************
  */

  $(document).bind("mobileinit", function() {
    $.mobile.accounts = getAccounts;
    $.mobile.date = currentDate;
    $.mobile.details = showBillDetails;
  });

  getAccounts = function() {
    var account, liSelect, makeOpt, makeSelect, _i, _len;
    liSelect = $("#selectAccounts");
    makeSelect = $("<select>");
    makeSelect.attr("id", "payFrom");
    makeSelect.attr("class", "required");
    for (_i = 0, _len = billAccounts.length; _i < _len; _i++) {
      account = billAccounts[_i];
      makeOpt = $("<option>");
      makeOpt.attr("value", account);
      makeOpt.html(account);
      makeSelect.append(makeOpt);
    }
    liSelect.append(makeSelect);
  };

  currentDate = function() {
    var currentTime, day, month, showDate, year;
    currentTime = new Date();
    month = currentTime.getMonth() + 1;
    day = currentTime.getDate();
    year = currentTime.getFullYear();
    showDate = year + "-" + add0(month) + "-" + add0(day);
    return $("#payOn").val(showDate);
  };

  showBillDetails = function(key) {
    var OPERATOR, account, accountMatch, billObj, makeAccountIcon, makeDeleteIcon, makeEditIcon, makeList, makeListItem, makeSubList, value;
    $("#backToBills").click("click", function(e) {
      stopEvent(e);
      history.back();
      return $("#li-key-" + key).removeClass("billClick").addClass("bill");
    });
    key = (key !== void 0 ? key : getDetailsKey());
    destroyDetailsDataSet();
    makeList = $("<ul>");
    $("#itemDetails").append(makeList);
    makeListItem = $("<li>");
    makeList.append(makeListItem);
    value = localStorage[key];
    billObj = JSON.parse(value);
    makeSubList = $("<ul>");
    makeSubList.attr("id", "bill-" + key);
    makeEditIcon = $("<img>");
    makeEditIcon.attr("src", "i/pencil.png");
    makeEditIcon.attr("class", "icons");
    makeEditIcon.attr("id", "edit-" + key);
    makeDeleteIcon = $("<img>");
    makeDeleteIcon.attr("src", "i/x.png");
    makeDeleteIcon.attr("class", "icons");
    makeDeleteIcon.attr("id", "delete-" + key);
    makeAccountIcon = $("<img>");
    OPERATOR = /((Checking)|(Savings)|(Credit\sCard))+/g;
    account = billObj.account[1];
    accountMatch = (account != null ? account.match(OPERATOR) : "Undefined");
    switch (accountMatch[0]) {
      case "Checking":
        makeAccountIcon.attr("src", "i/thumb_checking.png");
        break;
      case "Savings":
        makeAccountIcon.attr("src", "i/thumb_savings.png");
        break;
      case "Credit Card":
        makeAccountIcon.attr("src", "i/thumb_creditcard.png");
        break;
      case "Undefined":
        makeAccountIcon.attr("src", "i/thumb_checking.png");
    }
    makeAccountIcon.attr("class", "icons");
    makeAccountIcon.attr("id", "account-" + key);
    makeSubList.append(makeEditIcon);
    makeSubList.append(makeDeleteIcon);
    makeSubList.append(makeAccountIcon);
    makeListItem.append(makeSubList);
    $("#edit-" + key).click("click", function(e) {
      return editItem(key);
    });
    $("#delete-" + key).click("click", function(e) {
      return deleteItem(key);
    });
    $("#account-" + key).click("click", function(e) {
      return showAccount(key);
    });
    _.each(billObj, function(bill) {
      var field, makeSubListItem;
      makeSubListItem = $("<li>");
      if (bill[0] === "From Account:") {
        makeSubListItem.attr("id", "li-account-" + key);
      }
      makeSubList.append(makeSubListItem);
      field = $("<span>");
      value = $("<span>");
      field.attr("class", "billField");
      value.attr("class", "billValue");
      makeSubListItem.append(field);
      makeSubListItem.append(value);
      field.html(bill[0] + " ");
      value.html(bill[1]);
      return true;
    });
    return true;
  };

}).call(this);

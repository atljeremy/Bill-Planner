(function() {

  /*
  Deliverable 1
  Author: Jeremy Fox
  Created For: VFW Online
  Simple HTML5 / Javascript Mobile Web Form
  */

  var _this = this;

  this.saveData = function() {};

  this.pullData = function() {};

  this.scrollToTop = function() {
    var d, e, g, w, x, y;
    w = window;
    d = document;
    e = d.documentElement;
    g = d.getElementsByTagName('body')[0];
    x = w.innerWidth || e.clientWidth || g.clientWidth;
    y = w.innerHeight || e.clientHeight || g.clientHeight;
    y += 60;
    alert(y);
    $("#PAGETOP").css("min-height", y + 'px');
    $(this).scrollTo("#PAGETOP", 1000);
  };

  this.getAccounts = function() {
    var account, accountStripped, accounts, output, _i, _len, _results;
    accounts = ["Bank of America - Checking", "Bank of America - Savings", "Bank of America - Credit Card"];
    _results = [];
    for (_i = 0, _len = accounts.length; _i < _len; _i++) {
      account = accounts[_i];
      accountStripped = account.toLowerCase();
      accountStripped = accountStripped.replace(/\s+/g, "");
      output = "" + account + ": <input type=\"radio\" name=\"test\" value=\"" + accountStripped + "\" id=\"payFrom\" required aria-required=\"true\" /><br />";
      _results.push(document.write(output));
    }
    return _results;
  };

  this.showAmount = function(newValue) {
    document.getElementById("range").innerHTML = newValue;
    this.convertAmountToWords(newValue);
  };

  this.showAmountWords = function(newValue) {
    return document.getElementById("checkAmountWords").innerHTML = newValue;
  };

  this.showPayTo = function(newValue) {
    return document.getElementById("checkPayTo").innerHTML = newValue;
  };

  this.showDate = function(newValue) {
    return document.getElementById("checkDate").innerHTML = newValue;
  };

  this.showYourName = function(newValue) {
    return document.getElementById("checkName").innerHTML = newValue;
  };

  this.currentDate = function() {
    var currentTime, day, month, showDate, year;
    currentTime = new Date();
    month = currentTime.getMonth() + 1;
    day = currentTime.getDate();
    year = currentTime.getFullYear();
    showDate = year + "-" + month + "-" + day;
    return document.getElementById("payOn").value = showDate;
  };

  this.uncheckYes = function() {
    return document.getElementById("rememberYes").checked = "";
  };

  this.uncheckNo = function() {
    return document.getElementById("rememberNo").checked = "";
  };

  this.placeholder = function() {
    if (!Modernizr.input.placeholder) {
      $("input[placeholder], textarea[placeholder]").each(function() {
        if ($(this).val() === "") {
          $(this).val($(this).attr("placeholder"));
          $(this).focus(function() {
            if ($(this).val() === $(this).attr("placeholder")) {
              $(this).val("");
              return $(this).removeClass('placeholder');
            }
          });
          return $(this).blur(function() {
            if ($(this).val() === "") {
              $(this).val($(this).attr("placeholder"));
              return $(this).addClass('placeholder');
            }
          });
        }
      });
      return $('form').submit(function() {
        var placeheld, _i, _len, _results;
        placeheld = $(this).find('[placeholder]');
        _results = [];
        for (_i = 0, _len = placeheld.length; _i < _len; _i++) {
          placeheld = placeheld[_i];
          if ($(placeheld).val() === $(placeheld).attr('placeholder')) {
            _results.push($(placeheld).attr('value', ''));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    }
  };

  this.tooltip = function() {
    $("#yourName").tooltip({
      position: "top center",
      offset: [-10, 0],
      effect: "fade",
      opacity: 0.7
    });
    return $("#payTo").tooltip({
      position: "top center",
      offset: [-10, 0],
      effect: "fade",
      opacity: 0.7
    });
  };

  this.calendar = function() {
    $(":date").dateinput({
      trigger: true,
      format: 'mmm dd yyyy',
      min: -1
    });
    return $(":date").bind("onShow onHide", function() {
      return $(this).parent().toggleClass("active");
    });
  };

  this.rangeStyle = function() {
    return $(":range").rangeinput();
  };

  /*
  The concept of the following functions were found here: http://www.tek-tips.com/viewthread.cfm?qid=859695
  It has been edited to suit my needs
  */

  this.convert0_99ToWords = function(intValue) {
    var tensAmount, unitsAmount;
    if (isNaN(intValue) || intValue < 0 || intValue > 99) return "";
    intValue = parseInt(intValue, 10);
    switch (intValue) {
      case 0:
        return "";
      case 1:
        return "one";
      case 2:
        return "two";
      case 3:
        return "three";
      case 4:
        return "four";
      case 5:
        return "five";
      case 6:
        return "six";
      case 7:
        return "seven";
      case 8:
        return "eight";
      case 9:
        return "nine";
      case 10:
        return "ten";
      case 11:
        return "eleven";
      case 12:
        return "twelve";
      case 13:
        return "thirteen";
      case 14:
        return "fourteen";
      case 15:
        return "fifteen";
      case 16:
        return "sixteen";
      case 17:
        return "seventeen";
      case 18:
        return "eighteen";
      case 19:
        return "nineteen";
      case 20:
        return "twenty";
      case 30:
        return "thirty";
      case 40:
        return "fourty";
      case 50:
        return "fifty";
      case 60:
        return "sixty";
      case 70:
        return "seventy";
      case 80:
        return "eighty";
      case 90:
        return "ninety";
      default:
        tensAmount = parseInt(intValue / 10) * 10;
        unitsAmount = intValue - tensAmount;
        return _this.convert0_99ToWords(tensAmount) + " " + _this.convert0_99ToWords(unitsAmount);
    }
  };

  this.convertAmountToWords = function(amount) {
    var amountNumber, amountWords, centsAmount, dollarsAmount, negativeAmount, tempDollarsAmount, tempHundredsAmount, tempTensAmount;
    amountNumber = amount;
    if (isNaN(amountNumber)) {
      alert("You have not entered a valid number. Use only numbers (0-9) and full-stop character (.)");
      return;
    }
    if (amountNumber === "") {
      alert("You have not entered anything.");
      return;
    }
    negativeAmount = amountNumber.indexOf("-") !== -1;
    if (negativeAmount) amountNumber = amountNumber.replace("-", "");
    if (amountNumber.indexOf(".") === 0) amountNumber = "0" + amountNumber;
    dollarsAmount = parseInt(amountNumber, 10);
    tempDollarsAmount = dollarsAmount;
    centsAmount = parseInt((parseFloat(amountNumber) - dollarsAmount).toFixed(2) * 100, 10);
    amountWords = "";
    tempTensAmount = (dollarsAmount > 9 ? parseInt(dollarsAmount.toString().substr(dollarsAmount.toString().length - 2), 10) : dollarsAmount);
    amountWords = this.convert0_99ToWords(tempTensAmount);
    tempDollarsAmount -= tempTensAmount;
    if (tempDollarsAmount > 99) {
      tempHundredsAmount = parseInt(tempDollarsAmount / 100, 10).toString();
      tempHundredsAmount = parseInt(tempHundredsAmount.charAt(tempHundredsAmount.length - 1), 10);
      if (tempHundredsAmount !== 0) {
        if (tempTensAmount !== 0) {
          amountWords = this.convert0_99ToWords(tempHundredsAmount) + " hundred and " + amountWords;
        } else {
          amountWords = this.convert0_99ToWords(tempHundredsAmount) + " hundred " + amountWords;
        }
      }
      tempDollarsAmount -= tempHundredsAmount * 100;
    }
    if (dollarsAmount > 0) {
      amountWords += (dollarsAmount === 1 ? " dollar" : " dollars");
    }
    if (dollarsAmount === 0) amountWords += "0";
    if (centsAmount > 0) {
      if (dollarsAmount > 0) amountWords += " and ";
      amountWords += this.convert0_99ToWords(centsAmount) + (centsAmount === 1 ? " cent" : " cents");
    }
    if (negativeAmount) amountWords = "Negative " + amountWords;
    return this.showAmountWords(amountWords);
  };

}).call(this);

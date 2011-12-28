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
    return document.getElementById("range").innerHTML = newValue;
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
    return $("#billForm :input").tooltip({
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

}).call(this);

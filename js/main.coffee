###
Deliverable 1
Author: Jeremy Fox
Created For: VFW Online
Simple HTML5 / Javascript Mobile Web Form
###

@storeData = ->
  #something
  
@getData = ->
  #something
  
@addAccount = (account) ->
  #something
  
getAccounts = ->
  accounts = ["Bank of America - Checking", "Bank of America - Savings", "Bank of America - Credit Card"]
  accountsform = $("#billForm");
  liSelect = $("#select");
  makeSelect = document.createElement("select");
  makeSelect.setAttribute("id", "payFrom");
  for account in accounts
    makeOpt = document.createElement("option");
    makeOpt.setAttribute("value", account);
    makeOpt.innerHTML = account;
    makeSelect.appendChild(makeOpt);
  liSelect.appendChild(makeSelect);
  return

currentDate = ->
  currentTime = new Date()
  month = currentTime.getMonth()+1
  day = currentTime.getDate()
  year = currentTime.getFullYear()
  showDate = year + "-" + add0(month) + "-" + add0(day)
  document.getElementById("payOn").value=showDate
  
add0 = (n) ->
  (if n < 10 then "0" + n else "" + n)
  
@uncheckYes = ->
  document.getElementById("rememberYes").checked="false"

@uncheckNo = ->
  document.getElementById("rememberNo").checked="false"
  
$(document).bind "mobileinit", ->
  $.mobile.accounts = getAccounts
  $.mobile.date     = currentDate
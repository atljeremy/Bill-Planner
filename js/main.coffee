###
Deliverable 1
Author: Jeremy Fox
Created For: VFW Online
Simple HTML5 / Javascript Mobile Web Form
###

@storeData = ->
  newDate = new Date()
  itemId = newDate.getTime()
  
  item = {}
  item.name = ["Name:", ""]
  item.payto = ["Pay To:", ""]
  item.amount = ["Amount:", ""]
  item.account = ["From Account:", ""]
  item.payon = ["Pay On:", ""]
  item.notes = ["Notes:", ""]
  item.remember = ["Remember This Payment:", getFavValue]

  try
    localStorage.setItem itemId, JSON.stringify(item)
  catch (e)
    if (e == QUOTA_EXCEEDED_ERR)
      alert('Quota exceeded!')

getFavValue = ->
  radios = document.forms[0].favorite
  for radio in radios
    if radio.checked
      rememberValue = ""
      rememberValue = radio.value
      return rememberValue
  
@getData = ->
  #something
  
@addAccount = (account) ->
  #something
  
getAccounts = ->
  accounts      = ["Bank of America - Checking", "Bank of America - Savings", "Bank of America - Credit Card"]
  liSelect      = document.getElementById("selectAccounts");
  makeSelect    = document.createElement("select");
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
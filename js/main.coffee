###
Deliverable 1
Author: Jeremy Fox
Created For: VFW Online
Simple HTML5 / Javascript Mobile Web Form
###

###
Main Metheds
###
@storeData = ->
  newDate = new Date()
  itemId = newDate.getTime()
  
  messages = validateRequiredFields()
  unless _.isEmpty(messages) 
    message = messages.join('\n')
    alert message
  else
    item = {}
    item.name     = ["Name:", $("#name").val()]
    item.payto    = ["Pay To:", $("#payTo").val()]
    item.amount   = ["Amount:", $("#payAmount").val()]
    item.account  = ["From Account:", $("#payFrom").val()]
    item.payon    = ["Pay On:", $("#payOn").val()]
    item.notes    = ["Notes:", $("#notes").val()]
    item.remember = ["Remember This Payment:", getFavValue()]
  
    try
      localStorage.setItem itemId, JSON.stringify(item)
      alert("Bill Added!")
    catch e
      if (e == QUOTA_EXCEEDED_ERR)
        alert('Quota exceeded!')
  
@getData = ->
  #something

@addAccount = (account) ->
  #something 

###
Helper Methods
###
add0 = (n) ->
  (if n < 10 then "0" + n else "" + n)

getFavValue = ->
  radios = document.forms[0].remember
  for radio in radios
    if radio.checked
      rememberValue = ""
      rememberValue = radio.value
      return rememberValue

validateRequiredFields = ->
  message = []
  
  message.push "Please Enter Your Name." if $("#name").val() == null or $("#name").val() == "" 
  
  message.push "Please Enter Who You Would Like To Pay." if $("#payTo").val() == null or $("#payTo").val() == ""
  
  message.push "Please Enter The Amount To Pay." if $("#payAmount").val() == null or $("#payAmount").val() == 0
  
  message.push "Please Enter The Account To Pay From." if $("#payFrom").val() == null or $("#payFrom").val() == "" or $("#payFrom").val() == "-- Choose Account --"
  
  message.push "Please Enter The Date You Would Like To Make This Payment." if $("#payOn").val() == null or $("#payOn").val() == ""
  
  return message

###
Bind to jQueries mobileinit
###
$(document).bind "mobileinit", ->
  $.mobile.accounts = getAccounts
  $.mobile.date     = currentDate
  return

getAccounts = ->
  accounts   = ["-- Choose Account --", "Bank of America - Checking", "Bank of America - Savings", "Bank of America - Credit Card"]
  liSelect   = document.getElementById("selectAccounts");
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
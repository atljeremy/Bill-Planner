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
  document.write("<select id=\"payFrom\" required aria-required=\"true\">")
  for account in accounts
    accountStripped = account.toLowerCase()
    accountStripped = accountStripped.replace(/\s+/g, "")
    output = "<option value=\"#{accountStripped}\" />#{account}</option>
    "
    document.write(output)
  document.write("</select>")

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
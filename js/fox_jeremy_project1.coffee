###
Deliverable 1
Author: Jeremy Fox
Created For: VFW Online
Simple HTML5 / Javascript Mobile Web Form
###

@saveData = () ->
  #something
  
@pullData = () ->
  #something
  
@getAccounts = () ->
  accounts = ["Bank of America - Checking", "Bank of America - Savings", "Bank of America - Credit Card"]
  for account in accounts
    accountStripped = account.toLowerCase()
    accountStripped = accountStripped.replace(/\s+/g, "")
    output = "#{account}: <input type=\"radio\" name=\"test\" value=\"#{accountStripped}\" id=\"\" /><br />"
    document.write(output)

@showValue = (newValue) ->
  document.getElementById("range").innerHTML=newValue

@currentDate = () ->
  currentTime = new Date()
  month = currentTime.getMonth()+1
  day = currentTime.getDate()
  year = currentTime.getFullYear()
  showDate = year + "-" + month + "-" + day
  document.getElementById("date").value=showDate
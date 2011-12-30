###
Deliverable 1
Author: Jeremy Fox
Created For: VFW Online
Simple HTML5 / Javascript Mobile Web Form
###

@saveData = ->
  #something
  
@pullData = ->
  #something
  
@scrollToTop = ->
  w = window
  d = document
  e = d.documentElement
  g = d.getElementsByTagName('body')[0]
  x = w.innerWidth or e.clientWidth or g.clientWidth
  y = w.innerHeight or e.clientHeight or g.clientHeight
  y += 60
  alert y
  $("#PAGETOP").css("min-height", y + 'px')
  $(this).scrollTo( "#PAGETOP", 1000 )
  return

  
@getAccounts = ->
  accounts = ["Bank of America - Checking", "Bank of America - Savings", "Bank of America - Credit Card"]
  for account in accounts
    accountStripped = account.toLowerCase()
    accountStripped = accountStripped.replace(/\s+/g, "")
    output = "#{account}: <input type=\"radio\" name=\"test\" value=\"#{accountStripped}\" id=\"payFrom\" required aria-required=\"true\" /><br />"
    document.write(output)

@showAmount = (newValue) ->
  document.getElementById("range").innerHTML=newValue
  @convertAmountToWords(newValue)
  return
  
@showAmountWords = (newValue) ->
  document.getElementById("checkAmountWords").innerHTML=newValue
  
@showPayTo = (newValue) ->
  document.getElementById("checkPayTo").innerHTML=newValue
  
@showDate = (newValue) ->
  document.getElementById("checkDate").innerHTML=newValue
  
@showYourName = (newValue) ->
  document.getElementById("checkName").innerHTML=newValue

@currentDate = ->
  currentTime = new Date()
  month = currentTime.getMonth()+1
  day = currentTime.getDate()
  year = currentTime.getFullYear()
  showDate = year + "-" + month + "-" + day
  document.getElementById("payOn").value=showDate
  
@uncheckYes = ->
  document.getElementById("rememberYes").checked=""

@uncheckNo = ->
  document.getElementById("rememberNo").checked=""

@placeholder = =>
  if !Modernizr.input.placeholder
    $("input[placeholder], textarea[placeholder]").each -> 
  
      if $(this).val()==""
        $(this).val $(this).attr("placeholder")
        $(this).focus ->
          if $(this).val()==$(this).attr("placeholder")
            $(this).val("")
            $(this).removeClass('placeholder')
            
        $(this).blur ->
          if($(this).val() =="")
            $(this).val $(this).attr("placeholder")
            $(this).addClass('placeholder')
    
    
    $('form').submit ->
      placeheld = $(this).find('[placeholder]')
      for placeheld in placeheld
        if $(placeheld).val() == $(placeheld).attr('placeholder')
          $(placeheld).attr('value','')
          
@tooltip = =>
  $("#yourName").tooltip
    position: "top center"
    offset: [-10, 0]
    effect: "fade"
    opacity: 0.7
    
  $("#payTo").tooltip
    position: "top center"
    offset: [-10, 0]
    effect: "fade"
    opacity: 0.7
    
@calendar = ->
  $(":date").dateinput(trigger: true, format: 'mmm dd yyyy', min: -1)
  $(":date").bind "onShow onHide", () ->
    $(this).parent().toggleClass("active")
    
@rangeStyle = ->
  $(":range").rangeinput()

###
The concept of the following functions were found here: http://www.tek-tips.com/viewthread.cfm?qid=859695
It has been edited to suit my needs
###
@convert0_99ToWords = (intValue) =>
  return ("") if isNaN(intValue) or intValue < 0 or intValue > 99
  intValue = parseInt(intValue, 10)
  switch intValue
    when 0
      ""
    when 1
      "one"
    when 2
      "two"
    when 3
      "three"
    when 4
      "four"
    when 5
      "five"
    when 6
      "six"
    when 7
      "seven"
    when 8
      "eight"
    when 9
      "nine"
    when 10
      "ten"
    when 11
      "eleven"
    when 12
      "twelve"
    when 13
      "thirteen"
    when 14
      "fourteen"
    when 15
      "fifteen"
    when 16
      "sixteen"
    when 17
      "seventeen"
    when 18
      "eighteen"
    when 19
      "nineteen"
    when 20
      "twenty"
    when 30
      "thirty"
    when 40
      "fourty"
    when 50
      "fifty"
    when 60
      "sixty"
    when 70
      "seventy"
    when 80
      "eighty"
    when 90
      "ninety"
    else
      tensAmount = parseInt(intValue / 10) * 10
      unitsAmount = intValue - tensAmount
      @convert0_99ToWords(tensAmount) + " " + @convert0_99ToWords(unitsAmount)

@convertAmountToWords = (amount) ->
  amountNumber = amount
  if isNaN(amountNumber)
    alert "You have not entered a valid number. Use only numbers (0-9) and full-stop character (.)"
    return

  if amountNumber is ""
    alert "You have not entered anything."
    return

  negativeAmount = (amountNumber.indexOf("-") isnt -1)
  amountNumber = amountNumber.replace("-", "")  if negativeAmount
  amountNumber = "0" + amountNumber  if amountNumber.indexOf(".") is 0
  dollarsAmount = parseInt(amountNumber, 10)
  tempDollarsAmount = dollarsAmount
  centsAmount = parseInt((parseFloat(amountNumber) - dollarsAmount).toFixed(2) * 100, 10)
  amountWords = ""
  tempTensAmount = (if (dollarsAmount > 9) then parseInt(dollarsAmount.toString().substr(dollarsAmount.toString().length - 2), 10) else dollarsAmount)
  amountWords = @convert0_99ToWords(tempTensAmount)
  tempDollarsAmount -= tempTensAmount

  if tempDollarsAmount > 99
    tempHundredsAmount = parseInt(tempDollarsAmount / 100, 10).toString()
    tempHundredsAmount = parseInt(tempHundredsAmount.charAt(tempHundredsAmount.length - 1), 10)
    unless tempHundredsAmount is 0
      unless tempTensAmount is 0
        amountWords = @convert0_99ToWords(tempHundredsAmount) + " hundred and " + amountWords
      else
        amountWords = @convert0_99ToWords(tempHundredsAmount) + " hundred " + amountWords
    tempDollarsAmount -= (tempHundredsAmount * 100)

  if dollarsAmount > 0
    amountWords += (if (dollarsAmount is 1) then " dollar" else " dollars")
    
  if dollarsAmount == 0
    amountWords += "0"
    
  if centsAmount > 0
    amountWords += " and "  if dollarsAmount > 0
    amountWords += @convert0_99ToWords(centsAmount) + (if (centsAmount is 1) then " cent" else " cents")

  amountWords = "Negative " + amountWords  if negativeAmount
  @showAmountWords(amountWords)
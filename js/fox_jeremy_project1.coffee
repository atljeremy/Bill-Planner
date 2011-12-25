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
    output = "#{account}: <input type=\"radio\" name=\"test\" value=\"#{accountStripped}\" id=\"payFrom\" onfocus=\"tooltip()\" required aria-required=\"true\" title=\"Please choose one of your accounts to make this payment from.\" /><br />"
    document.write(output)

@showAmount = (newValue) ->
  document.getElementById("range").innerHTML=newValue
  
@showPayTo = (newValue) ->
  document.getElementById("checkPayTo").innerHTML=newValue
  
@showDate = (newValue) ->
  document.getElementById("checkDate").innerHTML=newValue
  
@showYourName = (newValue) ->
  document.getElementById("checkName").innerHTML=newValue

@currentDate = () ->
  currentTime = new Date()
  month = currentTime.getMonth()+1
  day = currentTime.getDate()
  year = currentTime.getFullYear()
  showDate = year + "-" + month + "-" + day
  document.getElementById("payOn").value=showDate
  
@uncheckYes = () ->
  document.getElementById("rememberYes").checked=""

@uncheckNo = () ->
  document.getElementById("rememberNo").checked=""

@placeholder = () =>
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
          
@tooltip = () =>
  $("#billForm :input").tooltip
    position: "top center"
    offset: [-10, 0]
    effect: "fade"
    opacity: 0.7
    
@calendar = () ->
  $(":date").dateinput(trigger: true, format: 'mmm dd yyyy', min: -1)
  $(":date").bind "onShow onHide", () ->
    $(this).parent().toggleClass("active")
    
@rangeStyle = () ->
  $(":range").rangeinput()
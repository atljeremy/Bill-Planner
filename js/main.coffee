###
Deliverable 3
Author: Jeremy Fox
Created For: VFW Online
Simple HTML5 / Javascript Mobile Web Form
###

###
Variables
###
@dataViewState        = false #false = bills (in localStorage) not visible. true = bills visible
@hasDataBeenDisplayed = false #Keeps track of whether or not localStorage has been display, if so, there is no reason to re-query localStorage, just show the previously viewed data.
@invalidateData       = false #set this to true when we need to force the app to re-query localStorage for new data.

###
State Control Methods
###
setViewState = (state) =>
  @dataViewState = state

getViewState = () =>
  return @dataViewState
  
setDataDisplayed = (val) =>
  @hasDataBeenDisplayed = val

getDataDisplayed = () =>
  return @hasDataBeenDisplayed
  
setInvalidated = (val) =>
  @invalidateData = val

getInvalidated = () =>
  return @invalidateData
  
destroyDataSet = () ->
  $("#items").empty()

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
      setInvalidated(true)
      alert("Bill Added!")
      @displayData()
      return
    catch e
      alert e

getData = ->
  if _.size(localStorage) > 0
    #Create unordered list
    makeList = document.createElement("ul")
    #Add list to "items" div
    $("#items").append makeList
    
    #for each item in localStorage do the following
    _.each(_.keys(localStorage), (key) ->
      #Make a list item
      makeListItem = document.createElement("li")
      #Add the list item to the Unordered list
      makeList.appendChild makeListItem
      #Get the value of the item in localStorage
      value       = localStorage.getItem(key)
      #parse the value's JSON
      billObj     = JSON.parse value
      #create a new Unordered list within the original Unordered list
      makeSubList = document.createElement("ul")
      
      #set class attribute for the new Unordered list for styling
      makeSubList.setAttribute("class", "bill")
      
      #Add the new Unordered list to the list item of original Unordered list
      makeListItem.appendChild makeSubList
      
      #for each bill in the billObj do the following
      _.each(billObj, (bill) ->
        #Make a list item
        makeSubListItem = document.createElement("li")
        #Add the list item to the new Unordered list
        makeSubList.appendChild makeSubListItem
        #Create the text to display for each line
        optSubText = bill[0]+" "+bill[1]
        #Add the text to the new list item
        makeSubListItem.innerHTML = optSubText
        true
      )
      true
    )
    true
  
@addAccount = (account) ->
  #something

@clearStorage = () ->
  localStorage.clear();
  alert "All Data Has Been Deleted."

$("#billForm").live "submit", (e) ->
  stopEvent(e)
  formdata = $(this).serialize()
  $.ajax
    type: "POST"
    url: "additem.html"
    data: formdata
    success: ->
      storeData()
  return false

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

stopEvent = (event) ->
  event.preventDefault()
  event.stopPropagation()
  if $.browser.msie
    event.originalEvent.keyCode = 0
    event.originalEvent.cancelBubble = true
    event.originalEvent.returnValue = false
    
viewItems = ->
  $("#items").css "display", "inline-block"
  return
  
hideItems = ->
  $("#items").css "display", "none"
  return
  
viewBillForm = ->
  $("#billForm").css "display", "inline"
  return
  
hideBillForm = ->
  $("#billForm").css "display", "none"
  return
  
@displayData = () =>
  if localStorage.length > 0
    if getViewState()
      #Bills are visible, show form
      setViewState(false)
      hideItems()
      viewBillForm()
      $("#displayData").text "Display Data"
      return
    else
      #Form is visible, show bills
      setViewState(true)
      hideBillForm()
      viewItems()
      if getDataDisplayed() == false or getInvalidated()
        destroyDataSet()
        getData()
        setDataDisplayed(true)
        setInvalidated(false)
      $("#displayData").text "Display Form"
      return
  else
    alert "Nothing To Display. Please Add A New Bill And Try Again."
    return

###
Bind to jQueries mobileinit
###
$(document).bind "mobileinit", ->
  $.mobile.accounts = getAccounts
  $.mobile.date     = currentDate
  return

getAccounts = ->
  accounts   = ["-- Choose Account --", "Bank of America - Checking", "Bank of America - Savings", "Bank of America - Credit Card"]
  liSelect   = document.getElementById("selectAccounts")
  makeSelect = document.createElement("select")
  makeSelect.setAttribute("id", "payFrom")
  for account in accounts
    makeOpt = document.createElement("option")
    makeOpt.setAttribute("value", account)
    makeOpt.innerHTML = account
    makeSelect.appendChild(makeOpt)
  liSelect.appendChild(makeSelect)
  return

currentDate = ->
  currentTime = new Date()
  month = currentTime.getMonth()+1
  day = currentTime.getDate()
  year = currentTime.getFullYear()
  showDate = year + "-" + add0(month) + "-" + add0(day)
  document.getElementById("payOn").value=showDate 
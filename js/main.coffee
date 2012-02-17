###
Deliverable 3
Author: Jeremy Fox
Created For: MiU Online
Simple HTML5 / Javascript Mobile Web Form
###

###
Variables
###
@dataViewState        = false #false = bills (in localStorage) not visible. true = bills visible
@hasDataBeenDisplayed = false #Keeps track of whether or not localStorage has been display, if so, there is no reason to re-query localStorage, just show the previously viewed data.
@invalidateData       = false #set this to true when we need to force the app to re-query localStorage for new data.
@keyToEdit            = 0 #The key of the item in localStorage we want to edit
billAccounts          = ["-- Choose Account --", "Bank of America - Checking", "Bank of America - Savings", "Bank of America - Credit Card"]
@inlaysOpen           = []

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
Getter and Setter for key to edit
###
@getKeyToEdit = () =>
  return @keyToEdit
  
@setKeyToEdit = (key) =>
  @keyToEdit = key
  
###
Getter and Setter for key of Inlay(s) that have been opened
###
getInlaysOpen = =>
  return @inlaysOpen

setInlaysOpen = (key) =>
  @inlaysOpen.push key
  
removeInlayKey = (key) =>
  keyIndex = _.indexOf(@inlaysOpen, key)
  @inlaysOpen.splice keyIndex, 1

###
Main Metheds
###
@storeData = () =>
  newDate = new Date()

  if @getKeyToEdit() == 0 or @getKeyToEdit() == ""
    itemId = newDate.getTime()
  else
    itemId = @getKeyToEdit()

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
      @setKeyToEdit(0)
      $("legend").html("<h2>Create a New Bill</h2>")
      @displayData()
      return
    catch e
      alert e
      
storeJsonData = () =>
  _.each(_.keys(@json), (key) ->
    item = @json[key]

    try
      localStorage.setItem key, JSON.stringify(item)
      return
    catch e
      alert e
  )
  setInvalidated(true)
  getData()

getData = ->
    if _.size(localStorage) > 0
      qryBills(localStorage, "localStorage")
    else
      storeJsonData()
      # qryBills(@json, "json")
   
qryBills = (storage, from) ->
  #Create unordered list
  makeList = document.createElement("ul")
  #Add list to "items" div
  $("#items").append makeList
  #for each item in localStorage do the following
  _.each(_.keys(storage), (key) ->
    #Make a list item
    makeListItem = document.createElement("li")
    makeListItem.setAttribute("id", "master-list-item-"+key)
    
    #Add the list item to the Unordered list
    makeList.appendChild makeListItem
    
    if from == "localStorage"
      #Get the value of the item in storage
      value = storage.getItem(key)
    else
      value = storage[key]
    
    if from == "localStorage"
      #parse the value's JSON
      billObj = JSON.parse value
    else
      #parse the value's JSON
      billObj = value
    
    #create a new Unordered list within the original Unordered list
    makeSubList = document.createElement("ul")
  
    #set class and id attribute for the new Unordered list for styling
    makeSubList.setAttribute("class", "bill")
    makeSubList.setAttribute("id", "bill-"+key)
  
    #Create a new img view for edit icon
    makeEditIcon = document.createElement("img")
  
    #Set src, class and id attribute on edit icon img view
    makeEditIcon.setAttribute("src", "i/pencil.png")
    makeEditIcon.setAttribute("class", "icons")
    makeEditIcon.setAttribute("id", "edit-"+key)
  
    #Create a new img view for delete icon
    makeDeleteIcon = document.createElement("img")
  
    #Set src, class and id attribute on delete icon img view
    makeDeleteIcon.setAttribute("src", "i/x.png")
    makeDeleteIcon.setAttribute("class", "icons")
    makeDeleteIcon.setAttribute("id", "delete-"+key)
    
    #Create a new img view for notes icon
    makeInlayIcon = document.createElement("img")
  
    #Set src, class and id attribute on notes icon img view
    makeInlayIcon.setAttribute("src", "i/notes.png")
    makeInlayIcon.setAttribute("class", "icons")
    makeInlayIcon.setAttribute("id", "inlay-"+key)
    
    #Create a new img view for account icon
    makeAccountIcon = document.createElement("img")
  
    #Set src, class and id attribute on delete icon img view
    OPERATOR = ///
    ((Checking)|(Savings)|(Credit\sCard))+
    ///g

    account = billObj.account[1]
    accountMatch = account.match(OPERATOR)
    switch accountMatch[0]
      when "Checking" then makeAccountIcon.setAttribute("src", "i/thumb_checking.png")
      when "Savings" then makeAccountIcon.setAttribute("src", "i/thumb_savings.png")
      when "Credit Card" then makeAccountIcon.setAttribute("src", "i/thumb_creditcard.png")
    
    makeAccountIcon.setAttribute("class", "icons")
    makeAccountIcon.setAttribute("id", "account-"+key)
        
    #Add the new Unordered list to the list item of original Unordered list
    makeListItem.appendChild makeSubList
    
    makeInlayDiv = document.createElement("div")
    makeInlayDiv.setAttribute("id", "inlay-div-"+key)
    makeInlayDiv.setAttribute("class", "billNotes")
    makeInlayUl = document.createElement("ul")
    makeInlayDiv.appendChild makeInlayUl
    
    #Add icons to subList
    makeSubList.appendChild makeInlayIcon
    makeInlayUl.appendChild makeEditIcon
    makeInlayUl.appendChild makeDeleteIcon
    makeInlayUl.appendChild makeAccountIcon
    
    makeListItem.appendChild makeInlayDiv
    
    #Set click listener on edit icon
    $("#edit-"+key).click("click", (e) ->
      editItem(key)
    )
    
    #Set click listener on delete icon
    $("#delete-"+key).click("click", (e) ->
      deleteItem(key)
    )
    
    #Set click listener on account icon
    $("#account-"+key).click("click", (e) ->
      showAccount(key)
    )
    
    #Set click listener on notes icon
    $("#inlay-"+key).click("click", (e) ->
      openKeys = getInlaysOpen()
      if openKeys? and openKeys.length != 0
      
        if _.indexOf(openKeys, key) != -1
          console.log "is open " + key
          removeInlayKey(key)
          $("#inlay-div-"+key).removeClass("billNotesShow").addClass("billNotes")
          return
        else
          console.log "not open " + key
          setInlaysOpen(key)
          $("#inlay-div-"+key).removeClass("billNotes").addClass("billNotesShow")
          return

      else
        setInlaysOpen(key)
        $("#inlay-div-"+key).removeClass("billNotes").addClass("billNotesShow")
    )
    
    #for each bill in the billObj do the following
    _.each(billObj, (bill) ->
    
      #Make a list item
      makePayToItem = document.createElement("li")
      makeInlayLi = document.createElement("li")
      
      #Create the text to display for each line
      field = document.createElement("span")
      value = document.createElement("span")
      
      field.setAttribute("class", "billField")
      value.setAttribute("class", "billValue")
        
      switch bill[0]
        when "Pay To:"
          makePayToItem.appendChild field
          makePayToItem.appendChild value
          
          field.innerHTML = bill[0] + " "
          value.innerHTML = bill[1]
          
          makeSubList.appendChild makePayToItem
          return
        when "From Account:"
          makeInlayLi.setAttribute("id", "li-account-"+key)
          
          makeInlayLi.appendChild field
          makeInlayLi.appendChild value
          
          field.innerHTML = bill[0] + " "
          value.innerHTML = bill[1]
          
          makeInlayUl.appendChild makeInlayLi
          return
        else
          makeInlayLi.appendChild field
          makeInlayLi.appendChild value
          
          field.innerHTML = bill[0] + " "
          value.innerHTML = bill[1]
          
          makeInlayUl.appendChild makeInlayLi
          return
      true
    )
    true
  )
  true    

editItem = (key) =>
  value = localStorage.getItem key
  bill = JSON.parse value
  
  @setKeyToEdit(key)
  
  $("legend").html("<h2>Your Editing a Bill - <a href=\"additem.html\" data-ajax=\"false\" >Cancel</a></h2>")
  
  @displayData()
  
  ###
  Unfortunately, due to a bug in jQuery, we can not use $("objectId").val("something")
  to set the values. We have to use the native javascipt method
  document.getElementById("objectId").value = "something"
  ###
  document.getElementById('name').value = bill.name[1]
  document.getElementById('payTo').value = bill.payto[1]
  document.getElementById('payAmount').value = bill.amount[1]
  document.getElementById('payFrom').value = bill.account[1]
  document.getElementById('payOn').value = bill.payon[1]
  document.getElementById('notes').value = bill.notes[1]
  radios = document.forms[0].remember
  for radio in radios
    if radio.value == "Yes" and bill.remember[1] == "Yes"
      radio.setAttribute "checked", "checked"
      document.getElementById("labelNo").setAttribute "class", "ui-btn ui-corner-right ui-controlgroup-last ui-radio-off ui-btn-up-c"
      document.getElementById("labelYes").setAttribute "class", "ui-btn ui-corner-left ui-btn-up-c ui-radio-on ui-btn-active"
    else if radio.value == "No" and bill.remember[1] == "No"
      radio.setAttribute "checked", "checked"
      document.getElementById("labelYes").setAttribute "class", "ui-btn ui-radio-off ui-corner-left ui-btn-up-c"
      document.getElementById("labelNo").setAttribute "class", "ui-btn ui-corner-right ui-controlgroup-last ui-radio-on ui-btn-active ui-btn-up-c"
  
deleteItem = (key) ->
  ask = confirm "Are you sure you want to delete this bill?"
  if ask
    $("#bill-"+key).animate
      opacity: 0.00
      height: 'toggle'
    , 1000
    $("#inlay-div-"+key).animate
      opacity: 0.00
      height: 'toggle'
    , 1000
    setTimeout(->
      $("#inlay-div-"+key).parent().empty()
    , 1000)
    
    if _.size(localStorage) > 1
      localStorage.removeItem key
      setInvalidated(true)
    else if _.size(localStorage) == 1
      localStorage.removeItem key
      setInvalidated(true)
      setTimeout(->
        @displayData()
      , 1000)
  else
    alert "Bill was not deleted"
    
showAccount = (key) ->
  $("#li-account-"+key).animate
    opacity: 0.00
  , 500, ->
    $("#li-account-"+key).animate
      opacity: 1.00
    , 500, ->
      return

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
  
$("#billSearch").click("click", (e) ->
  $("#searchFormContainer").css "display", "block"
  $("#searchFormContainer").animate
    opacity: 1.00
  , 1000
  
  $("#billSearch").animate
    opacity: 0.00
  , 500
  setTimeout(->
    $("#billSearch").css "display", "none"
  , 500)
  
  setTimeout(->
    $("#billSearchHide").css "display", "inline"

    $("#billSearchHide").animate
      opacity: 1.00
    , 500
  , 500)
)

$("#billSearchHide").click("click", (e) ->
  $("#searchFormContainer").animate
    opacity: 0.00
  , 1000
  setTimeout(->
    $("#searchFormContainer").css "display", "none"
  , 1000)
  
  $("#billSearchHide").animate
    opacity: 0.00
  , 500
  setTimeout(->
    $("#billSearchHide").css "display", "none"
  , 500)
  
  setTimeout(->
    $("#billSearch").css "display", "inline"
    $("#billSearch").animate
      opacity: 1.00
    , 500
  , 500)
)

$("#viewBills").click("click", (e) =>
  stopEvent(e)
  setTimeout(->
    @displayData(true, false)
  , 500)
  $.mobile.changePage( "additem.html",
    transition: "slideup"
    showLoadMsg: true
  )
)

$("#addBill").click("click", (e) =>
  stopEvent(e)
  setTimeout(->
    @displayData(false, true)
  , 500)
  $.mobile.changePage( "additem.html",
    showLoadMsg: true
  )
)

$("#cta-bills").click("click", (e) =>
  stopEvent(e)
  setTimeout(->
    @displayData(false, true)
  , 500)
  $.mobile.changePage( "additem.html",
    showLoadMsg: true
  )
)

###
Helper Methods
###
add0 = (n) ->
  (if n < 10 then "0" + n else "" + n)

getFavValue = ->
  radios = document.forms[0].remember
  console.log radios
  for radio in radios
    if radio.checked
      rememberValue = ""
      rememberValue = radio.value
      return rememberValue

validateRequiredFields = ->
  message = []
  #Validate Name
  message.push "Please Enter Your Name." if $("#name").val() == null or $("#name").val() == ""
  #Validate Pay To
  message.push "Please Enter Who You Would Like To Pay." if $("#payTo").val() == null or $("#payTo").val() == ""
  #Validate Pay Amount
  message.push "Please Enter The Amount To Pay." if $("#payAmount").val() == null or $("#payAmount").val() == 0
  #Validate Pay From
  message.push "Please Enter The Account To Pay From." if $("#payFrom").val() == null or $("#payFrom").val() == "" or $("#payFrom").val() == "-- Choose Account --"
  #Validate Payment Date
  message.push "Please Enter The Date You Would Like To Make This Payment." if $("#payOn").val() == null or $("#payOn").val() == ""
  message.push "Please Enter A Valid Date." if validateDate($("#payOn").val())
  return message
  
validateDate = (date) ->
  invalidDate = false

  OPERATOR = ///^
  [0-9]{4}-                  #Checks year format and length
  (0[1-9]|1[0-2])-           #Checks month format and lenth
  (0[1-9]|[1-2][0-9]|3[0-1]) #Check day format and length
  $///
  
  matchDate = date.match(OPERATOR)
  invalidDate = true if matchDate.length <= 0
  
  currentTime = new Date()
  month = ""
  month = currentTime.getMonth()+1
  day   = ""
  day   = currentTime.getDate()
  year  = ""
  year  = currentTime.getFullYear()
  
  dateArray = _.toArray(date.split("-"))
  
  if dateArray[0] < year
    invalidDate = true
    console.log "Entered Year =" + dateArray[0] + ". Current Year =" + year
  if dateArray[1] < add0(month)
    invalidDate = true
    console.log "Entered Month =" + dateArray[1] + ". Current Month =" + add0(month)
  if dateArray[2] < add0(day) and dateArray[1] == add0(month)
    invalidDate = true
    console.log "Entered Day =" + dateArray[2] + ". Current Day =" + add0(day)
  
  if invalidDate != null or invalidDate != "" and _.isBoolean(invalidDate)
    return invalidDate
  else
    alert "ERROR: Please Try Again."

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
  
@displayData = (showBills, showForm) =>
  bills = (if showBills isnt null or showBills isnt "" then showBills else false)
  form  = (if showForm isnt null or showForm isnt "" then showForm else false)

  if form
    #Bills are visible, show form
    @showForm()
    return

  else if bills
    #Form is visible, show bills
    @showBills()
    return
    
  else if getViewState()
    #Bills are visible, show form
    @showForm()
    return
  
  else
    #Form is visible, show bills
    @showBills()
    return
    
@showForm = () ->
  setViewState(false)
  hideItems()
  viewBillForm()
  $("#displayData").text "Display Data"
  $("#displayData").css "padding", "0.65em 15px 0.6em 15px"
  return
  
@showBills = () ->
  setViewState(true)
  hideBillForm()
  viewItems()
  if getDataDisplayed() == false or getInvalidated()
    destroyDataSet()
    getData()
    setDataDisplayed(true)
    setInvalidated(false)
  $("#displayData").text "Display Form"
  $("#displayData").css "padding", "0.65em 15px 0.6em 15px"
  return
    
unBindClickListeners = () ->
  $(document).unbind("click")

###
Bind to jQueries mobileinit
###
$(document).bind "mobileinit", ->
  $.mobile.accounts = getAccounts
  $.mobile.date     = currentDate
  return

getAccounts = ->
  liSelect   = document.getElementById("selectAccounts")
  makeSelect = document.createElement("select")
  makeSelect.setAttribute("id", "payFrom")
  for account in billAccounts
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
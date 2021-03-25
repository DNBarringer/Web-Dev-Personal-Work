window.addEventListener("load", registerListeners, false);

function registerListeners() {

    SetupMouseEventsAdvanced("caption-img1");
    SetupMouseEventsAdvanced("caption-img2");
    SetupMouseEventsAdvanced("caption-img3");
    SetupMouseEventsAdvanced("caption-img4");
    SetupMouseEventsAdvanced("caption-img5");
    SetupMouseEventsAdvanced("caption-img6");
    SetupMouseEventsAdvanced("caption-img7");
    SetupMouseEventsAdvanced("caption-img8");
    SetupMouseEventsAdvanced("caption-img9");

}

function SetupMouseEventsAdvanced(id) {
    var imgElement = document.getElementById(id);
    if (imgElement) {
        imgElement.addEventListener("mouseover", GetContentUsingAJAXwithURL, false);
        imgElement.addEventListener("mouseout", clearContent, false);
    }
    else {
        console.log(`I could not find id of '${id}' so I could not attach a onmouseover and onmouseout event listener`);
    }
}
//#endregion

//#region function clearContent() 
// This founction will be called by the onmouseout event handler we setup to clear out the .innerHTML 
// when the mouse is no longer hovering over the element we 
function clearContent() {
    ToggleClassState('display-panel', 'hidden', true);
}
//#endregion




// The following classes and functions provide methods that you might 
// want to encorporate into your StandardJSFunctions.js file
//              |         |         |
//              |         |         |
//              |         |         |
//              |         |         |
//              V         V         V 


//#region class AJAXCalls
// This object is used to control what is updated by the GetContentUsingAJAX method
var AJAXCalls = AJAXCalls || {};
AJAXCalls.async = true;
AJAXCalls.options = AJAXCalls.options || {};
AJAXCalls.options.displayPanel = 'display-panel';
AJAXCalls.options.webPanelId = 'html-info';
AJAXCalls.options.hiddenClass = 'hidden';
//#endregion

//#region function GetContentUsingAJAXwithURL(event)
// This method respondes to a onmouseover event, and gets the event object that triggered the
// mouseover.  From the event, we can figure out which element triggered the vent,
// the event.currentTarget.  Now that we know t
function GetContentUsingAJAXwithURL(event) {
    // Which element on the screen triggered the event?
    var whoWasMousedOver = event.currentTarget;
    // Does that element have an id property so we can examine the element to see 
    // if it has a attribute called data_LoadFile="urlOrFilename" that tells us what file
    // to load via AJAX
    if (whoWasMousedOver && whoWasMousedOver.id !== undefined) {
        var element = document.getElementById(whoWasMousedOver.id);
        if (element && element.getAttribute('data_LoadFile') !== undefined) {
            var loadFileUrl = element.getAttribute('data_LoadFile');
            if (loadFileUrl) {
                GetContentUsingAJAX(loadFileUrl);
            }
        }
        else {
            console.log(`Could not find the target id of '${whoWasMousedOver.id}' so I could not determine which file to load using AJAX`);
        }
    }
    else {
        console.log("Could not determine the target that triggered the event");
    }
}
//#endregion

//#region function GetContentUsingAJAX(infoPageURL)
// This is the method that will make the AJAX call, and load the page specified in 
// the param to the .innerHTML of the element with the id specified by AJAXCalls.options.webPanelId
function GetContentUsingAJAX(infoPageURL) {

    // Create the XMLHttpRequest object
    var asynchrequest = new XMLHttpRequest();

    // Define a callback function that will get called whenever the state changes on the 
    // async request.  This can be called repeatedly (whenever the status changes)
    //
    // Note:  The creation and assignment of the function does not mean that the code inside
    //        the function runs immediately.  It simply defines the function, and what code
    //		  will be executed when the callback event occurs
    //
    asynchrequest.onreadystatechange = function () {
        // This callback function gets called 4 times, with .readyState == 1 through 4
        //  When this function gets called, we need to check the .readyState and wait until
        //  it reaches state 4 which indicates the async process is completed
        //  Once we have a .readyState == 4, then we can check the .status to determine 
        //  how to process the response
        if (asynchrequest.readyState == 4) {

            // Find the element we are supposed to update
            var elementToUpdate = document.getElementById(AJAXCalls.options.webPanelId);
            if (elementToUpdate && elementToUpdate.innerHTML !== undefined) {
                // Ok, the request completed, and we have the response in the .responseText
                // or the .responseHTML property of the variable we created as an XMLHttpRequest
                switch (asynchrequest.status) {
                    case 200:
                        var htmlFragment = ParseTextAsHTML(asynchrequest.responseText, 'body',true);
                        if (htmlFragment) {
                            elementToUpdate.innerHTML = htmlFragment;
                        } else {
                            elementToUpdate.innerHTML = asynchrequest.responseText;
                        }
                        ToggleClassState(AJAXCalls.options.displayPanel, AJAXCalls.options.hiddenClass, false);
                        break;

                    // Check the common status codes of 404 and 500 next
                    case 404:
                        elementToUpdate.innerHTML = `
<span id='errmessage' class='problem-description'>
${asynchrequest.status}: Server indicated file <em>${infoPageURL}</em> does not exist. 
Please check the URL or file path is correct
</span>`;
                        ToggleClassState(AJAXCalls.options.displayPanel, AJAXCalls.options.hiddenClass, false);
                        break;

                    case 500:
                        elementToUpdate.innerHTML = `
<span id='errmessage' class='problem-description'>
${asynchrequest.status}: Server indicated a server error occurred - try again later
</span>`;
                        ToggleClassState(AJAXCalls.options.displayPanel, AJAXCalls.options.hiddenClass, false);
                        break;

                    // Handle any other status codes
                    default:
                        elementToUpdate.innerHTML = `
<span id='errmessage' class='problem-description'>
${asynchrequest.status}: Server indicated status code ${asynchrequest.status} - Not sure how to handle it
</span>`;
                        ToggleClassState(AJAXCalls.options.displayPanel, AJAXCalls.options.hiddenClass, false);
                        break;
                }
            }
            else {
                console.log(`Could not find element '${AJAXCalls.options.webPanelId}' to update it`);
            }
        }
        else {
            console.log(`Async callback to our logic but .readyState == ${asynchrequest.readyState} && .status == ${asynchrequest.status}`);
        }
    };

    // Now that we have setup our "callback" function

    // Lets tell the XMLHttpRequest object which URL we want to retrieve (the user is in infoPageURL),
    // and which method we want to request it (a GET request), and if we want to wait for the
    // request (a synchronous request would pass false as the 3rd parameter) or if we want to
    // continue to execute code so that the request operates asynchronously
    asynchrequest.open("GET", infoPageURL, AJAXCalls.async);

    // This sends the request off to the URL indicated in the .open, using the method requested
    asynchrequest.send();

    // Since we said it was allowed to run Asynchronously, we'll exist this function
    // and the "callback" will occur at a later point in time (which may be sub-seconds or several
    // minutes depending on network traffic, how busy the web server is, etc.)

}
//#endregion

//#region function ParseTextAsHTML(rawXML, id)
// Given some text that represents XML, load it as XML, then extract the elements that are
// the child nodes of a specific node the XML as a string
function ParseTextAsHTML(rawHTML, id, stripJavaScript) {
    var returnString = "";
    // see https://www.w3schools.com/xml/xml_parser.asp 
    // and see https://www.w3schools.com/xml/dom_intro.asp
    var parser = new DOMParser();
    if (parser) {
        var xmlDoc = parser.parseFromString(rawHTML, "text/html");
        if (xmlDoc && xmlDoc.body !== undefined && id !== undefined) {
            switch (id) {
                case 'body':
                    returnString = xmlDoc.body.innerHTML;
                    break;
                case 'head':
                    returnString = xmlDoc.head.innerHTML;
                    break;
                default:
                    var XMLFragment = xmlDoc.getElementsByTagName(id);
                    if (XMLFragment && XMLFragment.length > 0) {
                        returnString = XMLFragment[0].innerHTML;
                    }
                    else {
                        // XML has an error in it
                        console.log(`HTML document has an improperly closed tag such as a <br>, an <img> etc.`);
                    }
                    break;
            }
        }
    }
    else {
        console.log(`Cannot parse fragment as XML`);
        console.log(rawXML);
    }
    if (stripJavaScript) {
        const scriptTagClose = '</script>';
        // see https://www.w3schools.com/jsref/jsref_search.asp
        var startPoint = returnString.search(/<script/i);
        while (startPoint > 0) {
            // see https://www.w3schools.com/jsref/jsref_indexof.asp
            var endPoint = returnString.toLowerCase().indexOf(scriptTagClose,startPoint +2) ;
            // see https://www.w3schools.com/jsref/jsref_substring.asp
            if (endPoint > 0){
                returnString = returnString.substring(0,startPoint) + returnString.substring(endPoint +scriptTagClose.length +1);
            }
            else {
                returnString = returnString.substring(0,startPoint)
            }
            // Are there any more script tags in the HTML?
            startPoint = returnString.search(/<script>/i);
        }
    }
    return returnString;
}
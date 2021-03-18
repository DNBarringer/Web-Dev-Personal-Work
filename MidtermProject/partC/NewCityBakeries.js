function CalculateOrder() {
    var cakeType = RetrieveRadioButtonValue("CakeType");
    var layers = RetrieveRadioButtonValue("CakeLayers");
    var additionalChoices = RetrieveCheckBoxValues("AdditionalChoice");

    var invoiceElement = document.getElementById("invoice");


    if (IsFormValid()) {
        //personal details
        var firstName = GetValue("firstname");
        var lastName = GetValue("lastname");
        var address = GetValue("address");
        var postalCode = GetValue("postalcode");
        var phoneNumber = GetValue("phone");
        var email = GetValue("email");

        //price variables
        var fragmentHTMLOrders = "";
        var fragmentHTMLOrderItemLine = "";
        const SheetBasePrice = 18;
        const RoundBasePrice = 15;
        var cakeLayersModifier = 1;
        var cakeArea = 0;
        var cakeExtraPrice = 0;
        var cakePrice = 0;
        var CakeDimensions = "";

        //prepares the cake layers multiplier that adds to the cost for extra size
        switch (layers) {
            case "2 layers":
                cakeLayersModifier = 1.5;
                break;
            case "3 layers":
                cakeLayersModifier = 2;
                break;
        }
        
        //calculates the cake price including extra size and layers
        switch (cakeType) {
            case "Sheet":
                CakeDimensions = GetValue("SheetWidth") + "cm x " + GetValue("SheetLength") + "cm";
                cakeArea = Math.floor(GetValue("SheetWidth") * GetValue("SheetLength"));
                cakeExtraPrice = (cakeArea - 900) * 0.02;
                cakePrice = (SheetBasePrice + cakeExtraPrice) * cakeLayersModifier;
                break;
            case "Round":
                CakeDimensions = GetValue("RoundRadius") + "cm";
                cakeArea = Math.floor(GetValue("RoundRadius") * GetValue("RoundRadius") * Math.PI);
                cakeExtraPrice = (cakeArea - 707) * 0.02;
                cakePrice = (RoundBasePrice + cakeExtraPrice) * cakeLayersModifier;
                break;
        }
        cakePrice = Math.round(cakePrice * 100) / 100;
        var totalPrice = cakePrice;
        


        


        //handles the printout and pricing of the additional choices
        var AdditionalChoicePrice = 0;
        if (additionalChoices !== undefined) {
            for (let idx = 0; idx < additionalChoices.length; idx++) {
                switch (additionalChoices[idx]) {
                    case "Cream Cheese icing":
                        AdditionalChoicePrice = 5;
                        break;
                    case "Fruit and Almond topping":
                        AdditionalChoicePrice = 7;
                        break;
                    case "Fruit Jam filling":
                        AdditionalChoicePrice = 4;
                        break;
                }
                fragmentHTMLOrderItemLine = `
                <span class="alignleft">${additionalChoices[idx]}</span>
                <span class="alignright">$${AdditionalChoicePrice}</span><br>
                `
                fragmentHTMLOrders += fragmentHTMLOrderItemLine;
                totalPrice += AdditionalChoicePrice;
                totalPrice = parseFloat(totalPrice).toFixed(2);
            }
        }

        //assembles the invoice
        invoiceElement.innerHTML = `
        <span class="alignleft">${firstName} ${lastName}</span><br>
        <span class="alignleft">${address}</span><br>
        <span class="alignleft">${postalCode}</span><br>
        <span class="alignleft">${phoneNumber}</span><br>
        <span class="alignleft">${email}</span><br>

        <br>

        <span class="alignleft">Your order:</span><br>

        <br>
        
        <span class="alignleft">${cakeType} cake ${CakeDimensions} with ${layers}:&emsp;</span>
        <span class="alignright">$${cakePrice}</span><br>
        ${fragmentHTMLOrders}
        <hr>
        <span class="alignleft">Total:</span>
        <span class="alignright">$${totalPrice}</span>
        `
    }
}

function IsFormValid() {
    var isValid = true;

    isValid = ValidateInputField('firstname', 'errmessage');

    if (isValid) {
        isValid = ValidateInputField('lastname', 'errmessage');
    }
    if (isValid) {
        isValid = ValidateInputField('address', 'errmessage');
    }
    if (isValid) {
        isValid = ValidateInputField('postalcode', 'errmessage');
    }
    if (isValid) {
        isValid = ValidateInputField('phone', 'errmessage');
    }
    if (isValid) {
        isValid = ValidateInputField('email', 'errmessage');
    }


    return isValid;
}

function ValidateInputField(id, errId) {
    var isFieldValid = true;
    // see https://www.w3schools.com/js/js_validation_api.asp

    // Test the field based upon the id and if it fails, we set the isValidForm to false
    var testInputElement = document.getElementById(id);
    if (testInputElement && testInputElement.checkValidity() !== undefined) {
        if (testInputElement.checkValidity() == false) {
            // Tell the user what is wrong by highlighting the field with a different color background
            /// and update the error message display area to describe the actual error
            testInputElement.classList.toggle("InputInError", true);
            var validationProblem = GetValidationMessage(id);
            var updateElement = document.getElementById(errId);
            if (updateElement && updateElement.innerHTML !== undefined) {
                updateElement.classList.toggle('hidden', false);
                updateElement.innerHTML = `<div>Please check the field indicated
            <p class='problem-description'>${validationProblem}</p></div>`;
            }
            isFieldValid = false;
        }
        else {
            // There is no error so we need to remove any background color that indicated the error
            // to show that the error has gone away, and we need to blank out the error message display area
            testInputElement.classList.toggle("InputInError", false);
            var updateElement = document.getElementById(errId);
            if (updateElement && updateElement.innerHTML !== undefined) {
                updateElement.classList.toggle('hidden', true);
                updateElement.innerHTML = "";
            }
        }
    }
    else {
        console.log(`Element '${id}' cannot be found or doesn't support validation checking`);
    }

    return isFieldValid;
}

function GetValidationMessage(id) {
    var msg = "";
    var elementWithError = document.getElementById(id);
    if (elementWithError && elementWithError.validationMessage !== undefined) {
        msg = elementWithError.validationMessage;
    }
    return msg;
}


function CakeChoice(choice) {

    var updateElement = document.getElementById("CakeDimensions");
    if (choice === sheet) {
        updateElement.innerHTML = `
        <label>Cake size (cm)</label><br>
        <input type="number" id="SheetLength" min="30" max="60" required>
        <label class="form-label required">cm Length</label><br>
        <input type="number" id="SheetWidth" min="30" max="45" required>
        <label class="form-label required">cm Width</label>
        `
    } else {
        updateElement.innerHTML = `
        <label>Cake size</label><br>
        <input type="number" id="RoundRadius" min="15" max="30" required>
        <label class="form-label required">cm Radius</label>
        `
    }
}

function GetValue(id) {
    var valueElement = document.getElementById(id);
    var stringValue = "";
    
    if (valueElement && valueElement.value !== undefined) {
        try {
            if (valueElement.value != "") {
                stringValue = valueElement.value;
            } else {
                stringValue = "";
            }
        }
        catch {
            stringValue = "";
        }  
    }
    return stringValue;
}

function FormatAsCurrency (number) {
    var currencyFormattingOptions = {
        style: "currency",
        currency: "CAD"
    }
    return number.toLocaleString("en-ca", currencyFormattingOptions);
}

function RetrieveRadioButtonValue(groupName) {
    // debugger;
    var value = "";
    var radioButtonGrouping = document.getElementsByName(groupName);
    if (radioButtonGrouping && radioButtonGrouping.length > 0) {
        // We need to search for which radio button was selected
        // by looking at the checked value https://www.w3schools.com/jsref/prop_radio_checked.asp
        for (let idx = 0; idx < radioButtonGrouping.length; idx++) {
            if (radioButtonGrouping[idx]
                && radioButtonGrouping[idx].value !== undefined
                && radioButtonGrouping[idx].checked !== undefined) {
                if (radioButtonGrouping[idx].checked) {
                    value = radioButtonGrouping[idx].value;
                    break;  // No use looking at the next checkboxes because only one can be checked
                }
            }
        }
    }
    else {
        console.log("Could not find radio button group named '" + groupName + "'");
    }
    return value;
}

function RetrieveCheckBoxValues(groupName) {
    // debugger;
    var value = [];
    var checkboxGrouping = document.getElementsByName(groupName);
    if (checkboxGrouping && checkboxGrouping.length > 0) {
        // We need to search for which checkbox was selected
        // by looking at the checked value https://www.w3schools.com/jsref/prop_checkbox_checked.asp
        for (let idx = 0; idx < checkboxGrouping.length; idx++) {
            if (checkboxGrouping[idx]
                && checkboxGrouping[idx].value !== undefined
                && checkboxGrouping[idx].checked !== undefined) {
                if (checkboxGrouping[idx].checked) {
                    value.push(checkboxGrouping[idx].value);
                }
            }
        }
    }
    else {
        console.log("Could not find checkbox group named '" + groupName + "'");
    }
    return value;
}
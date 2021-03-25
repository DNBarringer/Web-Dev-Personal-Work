function CalculateOrder() {
    var invoiceElement = document.getElementById("invoice");

    var fragmentHTMLOrders = "";

    //price in dollars per unit
    const veggiePrice = 30;
    const fruitPrice = 20;
    const chickenPrice = 4;
    const porkPrice = 5;

    //per unit weight
    const veggieWeight = 20;
    const fruitWeight = 10;
    const chickenWeight = 1.2;
    if (IsFormValid()) {
        //personal details
        var clientName = GetValue("clientname");
        var address = GetValue("address");
        var postalCode = GetValue("postalcode");
        var phoneNumber = GetValue("phone");
        var email = GetValue("email");
        var deliveryType = RetrieveRadioButtonValue("DeliveryType");


        var veggieQty = GetValue("vegetablehamper");
        var fruitQty = GetValue("fruithamper");
        var chickenQty = GetValue("freshchickens");
        var porkQty = GetValue("pork");

        var totalPrice = 0;
        var totalWeight = 0;
        var price = 0;

        if (veggieQty > 0) {
            var veggieTotalWeight = veggieWeight * veggieQty;
            price = veggieQty * veggiePrice;
            totalPrice += price;
            totalWeight += veggieTotalWeight;
            fragmentHTMLOrders += `
            <tr>
            <td>${veggieQty} Vegetable Hampers</td>
            <td>${veggieTotalWeight} kg</td>
            <td>$${veggiePrice}</td>
            <td>$${price}</td>
            </tr>
            `
        }
        if (fruitQty > 0) {
            var fruitTotalWeight = fruitWeight * fruitQty;
            price = fruitQty * fruitPrice;
            totalPrice += price;
            totalWeight += fruitTotalWeight;
            fragmentHTMLOrders += `
            <tr>
            <td>${fruitQty} Fruit Hampers</td>
            <td>${fruitTotalWeight} kg</td>
            <td>$${fruitPrice}</td>
            <td>$${price}</td>
            </tr>
            `
        }
        if (chickenQty > 0) {
            var chickenTotalWeight = chickenWeight * chickenQty;
            price = chickenQty * chickenPrice;
            totalPrice += price;
            totalWeight += chickenTotalWeight;
            fragmentHTMLOrders += `
            <tr>
            <td>${chickenQty} Fresh Chickens</td>
            <td>${chickenTotalWeight} kg</td>
            <td>$${chickenPrice}</td>
            <td>$${price}</td>
            </tr>
            `
        }
        if (porkQty > 0) {
            var porkTotalWeight = porkQty;
            price = porkQty * porkPrice;
            totalPrice += price;
            totalWeight += porkTotalWeight;
            fragmentHTMLOrders += `
            <tr>
            <td>${porkQty} kg Pork</td>
            <td>${porkTotalWeight} kg</td>
            <td>$${porkPrice}</td>
            <td>$${price}</td>
            </tr>
            `
        }







        invoiceElement.innerHTML = `
        <span class="alignleft"><strong>Order Details</strong></span><br><br>
        <span class="alignleft">${clientName}</span><br>
        <span class="alignleft">${address}</span><br>
        <span class="alignleft">${phoneNumber}</span><br>

        <br>

        <span class="alignleft">Your order:</span><br>

        <br>

        <table>
        <tr>
        <th>Item</th>
        <th>Weight</th>
        <th>Unit Price</th>
        <th>Item Total</th>
        </tr>
        ${fragmentHTMLOrders}
        <tr>
        <td></td>
        <td>-------</td>
        <td></td>
        <td>-------</td>
        </tr>
        <tr>
        <td>Your ${deliveryType} comes to</td>
        <td>${totalWeight} kg</td>
        <td></td>
        <td>$${totalPrice}</td>
        </tr>
        </table>
        `


    }
}





function HasFocus(id, helperId) {
    switch (id) {
        case "clientname":
            ToggleClassState(helperId, 'hidden', false);
            break;
        case "address":
            ToggleClassState(helperId, 'hidden', false);
            break;
        case "postalcode":
            ToggleClassState(helperId, 'hidden', false);
            break;
        case "phone":
            ToggleClassState(helperId, 'hidden', false);
            break;
        case "email":
            ToggleClassState(helperId, 'hidden', false);
            break;
    }
}

function LostFocus(id, helperId) {
    switch (id) {
        case "clientname":
            ToggleClassState(helperId, 'hidden', true);
            break;
        case "address":
            ToggleClassState(helperId, 'hidden', true);
            break;
        case "postalcode":
            ToggleClassState(helperId, 'hidden', true);
            break;
        case "phone":
            ToggleClassState(helperId, 'hidden', true);
            break;
        case "email":
            ToggleClassState(helperId, 'hidden', true);
            break;
    }
}

function ToggleClassState(id, toggleClass, force) {
    var inputElement = document.getElementById(id);
    if (inputElement) {
        // Toggle the Class 
        inputElement.classList.toggle(toggleClass, force);
    }
}

// Remove a class from the element on the screen
function RemoveClassState(id, toggleClass) {
    var inputElement = document.getElementById(id);
    if (inputElement) {
        // For the Class to be removed
        inputElement.classList.remove(toggleClass, true);
    }
}

// Add a class to an element on the screen
function AddClassState(id, toggleClass) {
    var inputElement = document.getElementById(id);
    if (inputElement) {
        // Force the Class to be added
        inputElement.classList.toggle(toggleClass, true);
    }
}

function IsFormValid() {
    var isValid = true;

    isValid = ValidateInputField('clientname', 'errmessage');

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
        console.log(`Element '${id}' cannot be found or doesn't suppork validation checking`);
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
//xe.com
var EURtoUSD = 1.19280627292;
var CADtoUSD = 0.79249637160806;

//https://finance.yahoo.com/
var BTCtoUSD = 56728.605;
var ETHtoUSD = 1823.23;


function updatePage() {
    var currencyA = document.getElementById("menu_A").value;
    var currencyB = document.getElementById("menu_B").value;
    var currencyAmount = document.getElementById("currencyAmount").value;
    var ratio = conversionRatio(currencyA, currencyB);
    var amountInUSD = ConvertToUSD(currencyA,currencyAmount);
    var outputAmount = ConvertFromUSD(currencyB,amountInUSD);

    //this part appends an s to the end of the name of the currency if needed
    if (currencyAmount !== "1" && currencyA !== "Bitcoin Digital Currency" && currencyA !=="Ethereum Digital Currency") {
        currencyA += "s";
    }
    if (outputAmount != "1" && currencyB !== "Bitcoin Digital Currency" && currencyB !=="Ethereum Digital Currency") {
        currencyB += "s";
    }

    var htmlFragment = `
    <label for="output">${currencyAmount} ${currencyA} is</label>
    <input type="text" id="output" value="${Math.round(outputAmount * 100) / 100} (${Math.round(ratio * 1000) / 1000}:1)" readonly>
    <span>${currencyB}</span>
    `;

    var outputElement = document.getElementById("converter-output");

    if (outputElement && outputElement.innerHTML !== undefined && currencyAmount !== "0") {
        outputElement.innerHTML = htmlFragment;
    }

}

function ConvertToUSD(currencyType, amount) {
    switch (currencyType) {
        case "Euro":
            return amount * EURtoUSD;
            break;
        case "Canadian Dollar":
            return amount * CADtoUSD;
            break;
        case "Bitcoin Digital Currency":
            return amount * BTCtoUSD;
            break;
        case "Ethereum Digital Currency":
            return amount * ETHtoUSD;
            break;
        default:
            return amount;
    }
}

function ConvertFromUSD(currencyType, amount) {
    switch (currencyType) {
        case "Euro":
            return amount / EURtoUSD;
            break;
        case "Canadian Dollar":
            return amount / CADtoUSD;
            break;
        case "Bitcoin Digital Currency":
            return amount / BTCtoUSD;
            break;
        case "Ethereum Digital Currency":
            return amount / ETHtoUSD;
            break;
        default:
            return amount;
    }
}


function conversionRatio(currencyA, currencyB) {
    var ratio = 0;
    switch (currencyA) {
        case "Euro":
            ratio = EURtoUSD;
            break;
        case "Canadian Dollar":
            ratio = CADtoUSD;
            break;
        case "Bitcoin Digital Currency":
            ratio = BTCtoUSD;
            break;
        case "Ethereum Digital Currency":
            ratio = ETHtoUSD;
            break;
        default:
            ratio = 1;
    }
    switch (currencyB) {
        case "Euro":
            ratio /= EURtoUSD;
            break;
        case "Canadian Dollar":
            ratio /= CADtoUSD;
            break;
        case "Bitcoin Digital Currency":
            ratio /= BTCtoUSD;
            break;
        case "Ethereum Digital Currency":
            ratio /= ETHtoUSD;
            break;
    }

    return ratio;
}
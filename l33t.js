const url = require("url");

module.exports = function(text, req) {
    
    const queryObject = url.parse(req.url, true).query;
    
    const unpacked = text.split("");
    for (const u in unpacked) {
        switch((queryObject.mode)) {
            case "heavy":
                unpacked[u] = translate_(unpacked[u]);
                break;

            case "mild":
            default:
                unpacked[u] = translate(unpacked[u]);
                break;
        }
    }

    return unpacked.join("");
}

function translate_(c) {
    switch (c.toUpperCase()) {
        case "A":
            return "4";

        case "B":
            return "8";

        case "C":
            return "(";

        case "D":
            return "|)";
        
        case "E":
            return "3";

        case "F":
            return "ph";

        case "G":
            return "6";

        case "H":
            return "|-|";

        case "I":
            return "!";

        case "J":
            return "_|";

        case "K":
            return "|<";

        case "L":
            return "|_";

        case "M":
            return "/\\/\\";

        case "N":
            return "|\\|";

        case "O":
            return "0";

        case "P":
            return "9";

        case "Q":
            return "0_";

        case "R":
            return "2";

        case "S":
            return "z";

        case "T":
            return "7";

        case "U":
            return "V";

        case "V":
            return "\\/";

        case "W":
            return "VV";

        case "X":
            return "><";
        
        case "Y":
            return "¥";

        case "Z":
            return "2";
    }

    return c;
}

function translate(c) {
    switch (c.toUpperCase()) {
        case "A":
            return "4";

        case "O":
            return "0";

        case "E":
            return "3";

        case "I":
            return "!";

        case "T":
            return "7";

        case "L":
            return "1";
    }

    return c;
}
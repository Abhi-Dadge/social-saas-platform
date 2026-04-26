const twitter = require("../integrations/twitter");
const linkedin = require("../integrations/linkedin");

function getPlatform(name) {
    switch (name) {
        case "twitter":
            return twitter;
        case "linkedin":
            return linkedin;
        default:
            throw new Error("Platform not supported");
    }
}

module.exports = { getPlatform };
function makeFirstLetterLowercase(string){
    const stringParts = string.split("")
    stringParts[0] = stringParts[0].toLowerCase()
    return stringParts.join("")
}

module.exports = makeFirstLetterLowercase
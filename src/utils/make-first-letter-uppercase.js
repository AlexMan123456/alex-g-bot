function makeFirstLetterUppercase(string){
    const stringParts = string.split("")
    stringParts[0] = stringParts[0].toUpperCase()
    return stringParts.join("")
}

module.exports = makeFirstLetterUppercase
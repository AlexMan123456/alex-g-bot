function getRandomNumber(lowerBound, upperBound){
    return Math.floor((Math.random()*upperBound)+lowerBound)
}

module.exports = getRandomNumber
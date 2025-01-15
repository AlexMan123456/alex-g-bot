function getRandomNumber(lowerBound, upperBound){
    return Math.floor(Math.random() * (upperBound - lowerBound + 1) + lowerBound)
}

module.exports = getRandomNumber
function turnNestedArrayIntoObject(array){
    const newObject = {}
    for(const subArray of array){
        newObject[subArray[0]] = subArray[1]
    }

    return newObject
}

module.exports = turnNestedArrayIntoObject
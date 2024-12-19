function findChannel(channels, channelToFind){
    for(const channel of channels){
        if(channel[1].name === channelToFind){
            return channel
        }
    }
}

module.exports = findChannel
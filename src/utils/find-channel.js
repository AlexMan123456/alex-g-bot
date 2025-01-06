function findChannel(client, channelToFind){
    return client.guild.channels.fetch().then((channels) => {
        for(const channel of [...channels]){
            if(channel[1].name === channelToFind){
                return channel
            }
        }
    })
}

module.exports = findChannel
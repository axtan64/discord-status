const fetch = require("node-fetch");
const { token, time_emojis } = require("./config.json");
let PreviousMinute = -1;

const GetEmojiStatusPair = () => {
    const date = new Date();

    const RawHour = date.getHours();

    let Hours = RawHour;
    let Minutes = date.getMinutes();

    Hours = Hours % 12;
    Hours = Hours ? Hours : 12;
    Minutes = Minutes < 10 ? '0' + Minutes : Minutes;

    let Emoji, Status
    if(RawHour <= 4 || RawHour >= 21) {
        [Emoji, Status] = [time_emojis.night, "Good Night!"]
    } else if(RawHour < 12) {
        [Emoji, Status] = [time_emojis.morning, "Good Morning!"]
    } else if(RawHour < 18) {
        [Emoji, Status] = [time_emojis.afternoon, "Good Afternoon!"]
    } else {
        [Emoji, Status] = [time_emojis.evening, "Good Evening!"]
    }
    Status = `${Status} (${Hours + ":" + Minutes + (RawHour >= 12 ? 'PM' : 'AM')})`

    return [Emoji, Status]
}

setInterval(function(){
    const ThisDate = new Date();
    const ThisMinute = ThisDate.getMinutes();

    if(ThisMinute != PreviousMinute) {
        PreviousMinute = ThisMinute

        const [Emoji, Status] = GetEmojiStatusPair();

        fetch("https://ptb.discordapp.com/api/v6/users/@me/settings", {
            method: "PATCH",
            headers: { 
                'Content-Type': 'application/json',
                'authorization': token
            },
            body: JSON.stringify({
                'custom_status': {
                    "text": Status, 
                    "emoji_name": Emoji 
                }
            })
        })
        .then(res => res.json())
        .then(json => {
            console.log("changed status");
        })
    }
}, 1000)
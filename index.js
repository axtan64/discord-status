const fetch = require("node-fetch");
const { token, time_emojis } = require("./config.json");
let PreviousMinute = -1;

const GetEmojiStatusPair = () => {
    const date = new Date();

    let Hours = date.getHours();
    let Minutes = date.getMinutes();
    const AMPM = Hours >= 12 ? 'PM' : 'AM';

    Hours = Hours % 12;
    Hours = Hours ? Hours : 12;

    Minutes = Minutes < 10 ? '0' + Minutes : Minutes;
    
    const AMPMTime = Hours + ':' + Minutes + AMPM;

    if(Hours <= 4 || Hours >= 9) {
        return [time_emojis.night, "Good Night! (" + AMPMTime + ")"]
    } else if(Hours < 12) {
        return [time_emojis.morning, "Good Morning! (" + AMPMTime + ")"]
    } else if(Hours < 18) {
        return [time_emojis.afternoon, "Good Afternoon! (" + AMPMTime + ")"]
    } else {
        return [time_emojis.evening, "Good Evening! (" + AMPMTime + ")"]
    }
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
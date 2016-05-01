(function () {

    var audio;
        audio = new Audio('https://dl.dropboxusercontent.com/s/t3xqbmi7jw5vy8v/glass_ping-Go445-1207030150.mp3');
        audio.volume = 0.4;

    var socketAction = function () {
        socket.on("message", function (data) {
            if (typeof data === "object" && data.action && data.action == "message" && data.data.type == "whisper"
                && data.data.name !== players[0].name)
                audio.play();
        });//socket end
    }

    socketAction();
    var switchWorldBugFixOld = switchWorldBugFix;
    switchWorldBugFix = function () {
        audio = new Audio('https://dl.dropboxusercontent.com/s/t3xqbmi7jw5vy8v/glass_ping-Go445-1207030150.mp3');
        audio.volume = 0.4;
        switchWorldBugFixOld();
        socketAction();
    }
})();
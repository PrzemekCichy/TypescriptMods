(function () {
    var socketAction = function () {
        socket.on("message", function (data) {
            selectAction(data);
        });//socket end
    }

    socketAction();
    var switchWorldBugFixOld = switchWorldBugFix;
    switchWorldBugFix = function () {
        switchWorldBugFixOld();
        socketAction();
    }

    function selectAction(data) {
        if (!(typeof data === "object" && data.action)) {
            return;
        }

        var date = new Date(timestamp());
        if (data.action == "message") {
            if (data.data.type == "chat") {
                console.log("(" + date.toLocaleTimeString() + ") [" + data.data.message.lang + "] <" + data.data.message.user + ">:\t" + data.data.message.text + "\n");
            } else if (data.data.type == "whisper") {
                console.log("(" + date.toLocaleTimeString() + ") <" + data.data.name + "> to <" + data.data.to + ">:" + data.data.message + " \n");
            }
        } else if (data.action === "join") {
            console.log(data.name + " has joined World " + data.world + " at " + date.toLocaleTimeString());
        } else if (data.action === "leave") {
            console.log(data.name + " left at " + date.toLocaleTimeString());
        }
    }

})();


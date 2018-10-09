var EF = (function(ef) {

    var notifyObj = function() {
        this.stompClient = null;
        this.connected = false;
        this._startserver();
    }
    notifyObj.prototype._startserver = function() {
        // var socket = new SockJS('http://pro.beilie.com:12315/platform-messaging');
        var socket = new SockJS('http://192.168.5.153:12315/platform-messaging');
        this.stompClient = Stomp.over(socket);
    }
    notifyObj.prototype._setConnected = function(arg) {
        this.connected = arg;
    }
    notifyObj.prototype.send = function(userName, hunterName, num, text, type) {
        this.stompClient.send(`/app/chat/${userName}`, { 'type': num }, JSON.stringify({ 'from': hunterName, 'to': userName, 'message': { 'text': text, 'type': type } }));
    }
    notifyObj.prototype.connect = function(userName, hunterName, callback) {
        if (this.connected) {
            return;
        }

        if (typeof callback != 'function') {
            return;
        }
        var self = this;
        this.stompClient.connect({ login: userName }, function() {
            self._setConnected(true);
            self.stompClient.subscribe(`/user/${hunterName}/chat/receive`, callback);
        });
    }
    notifyObj.prototype.disConnect = function() {
        if (this.stompClient != null) {
            this.stompClient.disconnect();
        }
        this._setConnected(false);
    }

    ef.Notification = notifyObj;
    return ef;
}(EF || {}));

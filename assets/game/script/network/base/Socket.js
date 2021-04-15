
/**-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/**
    New socket create by DuongNguyen

 */
cc.Class({
    _socket: null,
    _url: null,
    open: function (url, callback) {
        this._url = url;
        
            this.createNewSocket(callback, url);
    

    },
    close: function () {
        cc.log("vao close");
        this.activeClose = true;
        if (this._socket && cc.sys.isObjectValid(this._socket)) {
            cc.log("vao close data");
            clearInterval(cc.Global.Reconnectinterval);
            require('Linker').logoutSocket = true;
            require('Linker').isLogin = false;
            this._socket.close();
        }
    },

    closeToReconnect(){
        this.activeClose = true;
        if (this._socket && cc.sys.isObjectValid(this._socket)) {
            this._socket.close();
        }
    },

    createNewSocket: function (callback, url) {
        if (this._socket) {
            this._socket.onopen = undefined;
            this._socket.onmessage = undefined;
            this._socket.onclose = undefined;
            this._socket.onerror = undefined;
        }
        this._socket = new WebSocket(url);
        this._socket.binaryType = "arraybuffer";
        this._socket.onopen = () => {
            this.activeClose = false;
            require('Linker').pongtime=new Date().getTime();
            if(cc.director.getScene().getChildByName('Loading')){
                cc.director.getScene().getChildByName('Loading').active=false;
            }
            if (require('Linker').GameManager) {
                require('Linker').countReconnect=0;
                clearInterval(cc.Global.Reconnectinterval);
                //require('Linker').GameManager.PingPong();
            }
            if (callback) {
                callback(true);
            }
        };
        this._socket.onclose = (event) => {
            cc.log("CLOSE_SOCKET");
            if (callback) {
                callback(false);
            }
        };

        this._socket.onerror = (event) => {
            cc.log("OPEN_ERROR");
            if (callback) {
                callback(false);
            }
        }
    },

    onMessage(callback) {
        this._socket.onmessage = function (message, a) {
            if (callback) {
                callback(message);
            } else {
                cc.log("NULL");
            }
        };
    },

    send(message) {
        if (this.isOpen() && message != undefined) {
            this._socket.send(message);
            cc.log("SEND_OK", message);
        } else {
            cc.log("SEND_ERROR", message);
        }
    },

    isOpen() {
        if (this._socket && cc.sys.isObjectValid(this._socket)) {
            return this._socket.readyState === WebSocket.OPEN;
        } else {
            return false;
        }
    },

    isConnecting() {
        if (this._socket && cc.sys.isObjectValid(this._socket)) {
            return this._socket.readyState === WebSocket.CONNECTING;
        } else {
            return false;
        }
    },

    safeSend(message) {
        this.connect(this._url, () => {
            this._socket.send(message);
            cc.log("SEND_OK", message);
        });
    },
});
// module.exports = NetControl;
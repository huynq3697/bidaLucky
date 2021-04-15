var Api = {
    get(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                if (callback) {
                    callback(JSON.parse(response));
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    },
    post(url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var json = JSON.parse(xhr.responseText);
                if (callback) {
                    callback(json);
                }
            }
        };

        xhr.send(JSON.stringify(data));
        cc.log("URL", url, "SENT", data);
    },
    postNoJson(url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var json = JSON.parse(xhr.responseText);
                cc.log(xhr.responseText);
                if (callback) {
                    callback(json);
                }

            } else {
                //cc.log("ERROR")
            }
        }
      
        // xhr.send(JSON.stringify(data));
        xhr.send(data);
        cc.log("URL", url, "SENT", data);
    }
    
};
module.exports = Api;
/**
 * Created by Airma on 2017/3/13.
 */
/**
 * jquery的extend
 */
const extend = function () {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;

        // Skip the boolean and the target
        target = arguments[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object") {
        target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {

        // Only deal with non-null/undefined values
        if (( options = arguments[i] ) != null) {

            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep && copy && ( ( ( copyIsArray = ( copy instanceof Array) )  || copy instanceof Object)  )) {

                    if (copyIsArray && copy !== undefined) {
                        copyIsArray = false;
                        target[name] = copy;
                        // clone = src && ( src instanceof Array ) ? src : [];

                    } else {
                        clone = src && ( src instanceof Object ) ? src : {};
                        // Never move original objects, clone them
                        target[name] = extend(deep, clone, copy);
                    }
                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};



/**
 * 封装webSocket
 * @param url
 * @param health_timeout
 * @param keepaliveTime
 * @constructor
 */
const WebSocketIo = function (url ,health_timeout ,keepaliveTime) {
    var socket = this;
    this.url = url;
    this.socket = new WebSocket(url);
    this.eventFc = {
        "heartbeat":[function () {
            var time = new Date();
            socket.heartbeat.last_health = time.getTime();
        }]
    };
    this.heartbeat = {
        last_health : -1,
        heartbeat_timer:0,
        health_timeout:health_timeout || 60000,
        keepaliveTime : keepaliveTime || 30000
    };
    this.keepalive = function () {
        var time = new Date(),
            last_health = socket.heartbeat.last_health,
            health_timeout = socket.heartbeat.health_timeout;
        // console.log("last_health:"+last_health+"----:"+(time.getTime() - last_health))
        if( last_health != -1 && ( time.getTime() - last_health > health_timeout ) ){
            //此时即可以认为连接断开，可是设置重连或者关闭
            clearInterval( socket.heartbeat.heartbeat_timer );
            socket.socket.close();
        }
        else{
            if( socket.socket.bufferedAmount == 0 ){
                socket.socket.send(JSON.stringify({eventName:"heartbeat",data:"heartbeat!"}));
            }
        }
    };
    clearInterval( this.heartbeat.heartbeat_timer );
    this.socket.onerror = function () {
        clearInterval( socket.heartbeat.heartbeat_timer );
    };
    this.socket.onclose = function () {
        clearInterval( socket.heartbeat.heartbeat_timer );
    }
};
WebSocketIo.prototype = {
    onopen : function (callback) {
        this.socket.onopen = callback;
    },
    onerror : function (callback) {
        this.socket.onerror = callback;

    },
    onclose : function (callback) {
        this.socket.onclose = callback;
    },
    /**
     * socket封装后的onmessage事件。可根据返回data.eventName字段来自动触发事件
     * @param eventName 事件名称
     * @param callback 业务逻辑
     */
    onMessageEvent : function (eventName,callback) {
        var socket = this;
        this.eventFc[eventName] = this.eventFc[eventName] || [];
        this.eventFc[eventName].push(callback);
        if(socket.socket.onopen == null) socket.socket.onopen = function (event) {
            console.log('socket is opened!')
        };
        clearInterval( socket.heartbeat.heartbeat_timer );
        socket.heartbeat.last_health = new Date().getTime();
        socket.heartbeat.heartbeat_timer = setInterval( socket.keepalive,socket.heartbeat.keepaliveTime);
        socket.socket.onmessage = socket.socket.onmessage || function (event) {
                var data = JSON.parse(event.data);
                var time = new Date();
                socket.heartbeat.last_health = time.getTime();
                if(data.eventName && socket.eventFc[data.eventName]){
                    for(var i = 0; i < socket.eventFc[data.eventName].length; i ++){
                        socket.eventFc[data.eventName][i](data.data);
                    }
                } else {
                    console.error("socket事件不存在");
                }
            };
    },
    sendEvent : function (eventName,message) {
        this.socket.send(JSON.stringify({eventName:eventName,data:message}));
    },
    close : function () {
        this.socket.close();
    }
};


const get_unix_time = (dateStr)=> {
    let newstr = dateStr.replace(/-/g,'/');
    let date =  new Date(newstr);
    let time_str = date.getTime().toString();
    return time_str.substr(0, 10);
};

export {extend ,WebSocketIo ,get_unix_time}
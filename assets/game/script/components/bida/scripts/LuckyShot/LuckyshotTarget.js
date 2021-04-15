var BiDaConstant = require("BiDaConstant");
var BiDaSend = require('BiDaSend');
var Linker = require('Linker');
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,
    properties: {
        round1: cc.Node,
        round2: cc.Node,
        round3: cc.Node,
        round4: cc.Node,
        round5: cc.Node,
        listRoundLose: [cc.Node],
        effectWin: sp.Skeleton,
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        this.round1.zIndex = 40;
        this.round2.zIndex = 30;
        this.round3.zIndex = 20;
        this.round4.zIndex = 10;
        this.round5.zIndex = 0;
        this.circleColiderCircleTarget = this.node.getComponent(cc.CircleCollider);
        this.addSocketEvent();
        // Utils.Malicious.setMouseJointTest(this.node.parent);
        this.effectWin.node.active = false;
    },
    onEnable() {
        this.isCheckedNoHu = false;
    },
    setBallTarget: function (ball) {
        if (ball && cc.isValid(ball)) {
            this.rigidBodyBallTarget = ball.getComponent(cc.RigidBody);
            this.circleColiderBallTarget = ball.getComponent(cc.CircleCollider);
            this.circleColiderCircleTarget = this.node.getComponent(cc.CircleCollider);
            if (this.rigidBodyBallTarget && this.circleColiderBallTarget && this.circleColiderCircleTarget) {
                this.ballTarget = ball;
            } else {
                this.rigidBodyBallTarget = null;
                this.ballTarget = null;
                this.circleColiderBallTarget = null;
            }
        }
    },
    setBallWhite: function (ball) {
        if (ball && cc.isValid(ball)) {
            this.ballWhite = ball;
        }
    },
    setBeginCheckBallTarget: function (isCheck) {
        this._isCheckBallPredict = isCheck;
    },
    onSpinResponse: function (message) {
        if (parseInt(message.status) == 1) {
            if (message.idSpin && message.line && Array.isArray(message.line)) {
                if (message.idSpin) {
                    var _tmpIdTurnLuotDanhLuckyShot = parseInt(message.idSpin);
                    //message free spin ở đây là loại kết quả trả về chứ k phải lượt miễn phi của Slot
                    if (this.idTurnLuotDanhLuckyShot == _tmpIdTurnLuotDanhLuckyShot && parseInt(message.freeSpin) == 2) {
                        //xu ly phan line win
                        // //cc.error("Xu ly phan check line win")
                        this.xuLyLineWin(message);
                        // if (this.BillardsGameTable && this.BillardsGameTable.isValid) {
                        //     this.BillardsGameTable.taoLuckyShotVanMoi();
                        // }
                    } else if (parseInt(message.freeSpin) == 1) {
                        // //cc.error("Xu ly phan check max win")
                        this.xuLyCheckMaxWin(message);
                        //xu ly phan check max win
                    }
                } else {
                    this.resetLuckyConfigGame();
                }
            } else {
                this.resetLuckyConfigGame();
            }
        } else {
            this.resetLuckyConfigGame();
        }
    },
    xuLyLineWin: function (message) {
        //phần này để xử lý kết quả của một lượt đánh thành công
        //cần reset các tham số để được một lượt đánh mới nếu đủ điều kiện
        //if(đủ điều kiện){resetLuckyConfigGame, phát tín hiệu cho phép bi da controller hiện cây cơ và cho phép người chơi đánh bi}
        Linker.LuckyShotGame.setLineWin(message, this.BillardsGameTable);
        // debugger
    },
    xuLyCheckMaxWin: function (message) {
        if (parseInt(message.status) == 1) {
            if (message.idSpin && message.line && Array.isArray(message.line)) {
                if (message.idSpin) {
                    this.idTurnLuotDanhLuckyShot = parseInt(message.idSpin);
                    var _maxRoundArr = message.line;
                    // this.maxRoundArr cac index round co the an duoc
                    this.maxRoundArr = [];
                    for (let i = 0; i < _maxRoundArr.length; i++) {
                        if (Utils.Malicious.isJsonString(_maxRoundArr[i])) {
                            var numObj = JSON.parse(_maxRoundArr[i]);
                            var num = parseInt(numObj.maxround);
                            if (isNaN(num) == false) {
                                this.maxRoundArr.push(num);
                            }
                        }
                    }
                    if (this.maxRoundArr.length > 0 && this.idTurnLuotDanhLuckyShot) {
                        this.unschedule(this.resetRequestMaxRound);
                    } else {
                        this.resetLuckyConfigGame();
                    }
                } else {
                    this.resetLuckyConfigGame();
                }
            } else {
                this.resetLuckyConfigGame();
            }
        } else {
            this.resetLuckyConfigGame();
        }
    },
    resetLuckyConfigGame: function () {
        this.maxRoundArr = [];
        this.idTurnLuotDanhLuckyShot = null;
    },
    addSocketEvent() {
        Linker.Event.addEventListener(901, this.onSpinResponse, this);
    },
    removeSocketEvent() {
        Linker.Event.removeEventListener(901, this.onSpinResponse, this);
    },
    getFiveRoundsCheckObj: function () {
        return {
            round5: { radius: this.round5.getComponent(cc.CircleCollider).radius, position: this.round5.parent.convertToWorldSpaceAR(this.round5.position) },
            round4: { radius: this.round4.getComponent(cc.CircleCollider).radius, position: this.round4.parent.convertToWorldSpaceAR(this.round4.position) },
            round3: { radius: this.round3.getComponent(cc.CircleCollider).radius, position: this.round3.parent.convertToWorldSpaceAR(this.round3.position) },
            round2: { radius: this.round2.getComponent(cc.CircleCollider).radius, position: this.round2.parent.convertToWorldSpaceAR(this.round2.position) },
            round1: { radius: this.round1.getComponent(cc.CircleCollider).radius, position: this.round1.parent.convertToWorldSpaceAR(this.round1.position) }
        };
    },
    getResultByPositionAndRadius: function (obj) {
        var roundsObjPosition = this.getFiveRoundsCheckObj();
        // //cc.error(obj)
        var obj5 = roundsObjPosition.round5;
        var isInRound5 = cc.Intersection.circleCircle(obj, obj5);
        if (isInRound5) {
            // var isLoseRound = this.isLoseRound(obj);//vong cấm
            var isLoseRound = false;
            if (isLoseRound == false) {
                var obj4 = roundsObjPosition.round4;
                var isInRound4 = cc.Intersection.circleCircle(obj, obj4);
                if (isInRound4) {
                    var obj3 = roundsObjPosition.round3;
                    var isInRound3 = cc.Intersection.circleCircle(obj, obj3);
                    if (isInRound3) {
                        var obj2 = roundsObjPosition.round2;
                        var isInRound2 = cc.Intersection.circleCircle(obj, obj2);
                        if (isInRound2) {
                            // var obj1 = roundsObjPosition.round1;
                            // var isInRound1 = cc.Intersection.circleCircle(obj, obj1);
                            var isInRound1 = cc.Intersection.pointInPolygon(obj.position, this.round1.getComponent(cc.BoxCollider).world.points);
                            if (isInRound1) {
                                return { roundWin: 1 };
                            }
                            return { roundWin: 2 };
                        }
                        return { roundWin: 3 };
                    }
                    return { roundWin: 4 };
                }
                return { roundWin: 5 };
            }
            return { roundWin: 0 };
        }
        return { roundWin: 0 };
    },
    isLoseRound: function (obj) {
        if (obj) {
            for (let i = 0; i < this.listRoundLose.length; i++) {
                var _dataIntersect = {
                    radius: this.listRoundLose[i].getComponent(cc.CircleCollider),
                    position: this.listRoundLose[i].position
                }
                if (cc.Intersection.circleCircle(_dataIntersect, obj)) {
                    return true;
                }

            }
            return false;
        }
        return true;
    },
    requestMaxRound: function (tableComponent) {
        this.BillardsGameTable = tableComponent;
        this.scheduleOnce(this.resetRequestMaxRound, 5);
        this.requestMaxRoundNow();
    },
    resetRequestMaxRound: function () {
        // //cc.error(this.idTurnLuotDanhLuckyShot)
        // //cc.error(this.maxRoundArr)
        if (!this.idTurnLuotDanhLuckyShot && (!this.maxRoundArr || this.maxRoundArr.length == 0)) {
            this.resetLuckyConfigGame();
        }
    },
    requestMaxRoundNow: function () {
        //neu chua request max round thi phai request max round dau tien
        //de xem nguoi choi co the an duoc bao nhieu line
        var typePlay = BiDaConstant.LUCKY_SHOT_TYPE.TYPE_PLAY_CHECK_ROUND;
        var mucCuoc = (Linker.LuckyShotGame && Linker.LuckyShotGame.currCuoc) ? Linker.LuckyShotGame.currCuoc : 100;
        var lines = "1#";
        var idSpin = 0;
        var data = BiDaSend.sendRequestLuckyShot(typePlay, mucCuoc, lines, idSpin);
        Linker.Socket.send(data);
    },
    getResult: function (allBallInTable) {
        if (allBallInTable) {
            if (allBallInTable.hasOwnProperty("ballObj")) {
                var p = allBallInTable.ballObj;
                var result = [];
                for (var key in p) {
                    if (p.hasOwnProperty(key)) {
                        var ball = p[key];
                        var ballComponent = ball.getComponent("Ball");
                        if (ballComponent) {
                            var idBi = ballComponent.getIdBi();
                            var ballColider = ball.getComponent(cc.CircleCollider);
                            idBi = parseInt(idBi);
                            if (isNaN(idBi) == false && ballColider) {
                                if (idBi != 0 && idBi != 8) {
                                    var d = {
                                        radius: ballColider.radius,
                                        position: ball.parent.convertToWorldSpaceAR(ball.position)
                                    }
                                    var r = this.getResultByPositionAndRadius(d);
                                    // //cc.error("xfinal", d.position);
                                    // //cc.error("round", r);
                                    result.push(r);
                                }
                            }
                        }
                    }
                }
                return result;
            }
        }
        return [];
    },
    convertToStringRoundWins: function (roundWins) {
        if (Array.isArray(roundWins)) {
            //phần này phát để phát triển bắn 3 bi thay vì 2 bi trên bàn
            //tạm thời chỉ có bi cái và bi mục tiêu
            var strKetqua = ""
            for (let i = 0; i < roundWins.length; i++) {
                strKetqua += roundWins[i].roundWin + "#";
            }
            return strKetqua;
        }
        return "0#";
    },
    sendResult: function (roundWin, component) {
        Linker.LuckyShotGame.setLineWin(roundWin, component);
    },
    setEffect(roundWin, cb) {
        if (roundWin > 0) {
            this.effectWin.node.active = true;
            var animations = this.effectWin._skeleton.data.animations;
            var animation = null;
            switch (roundWin) {
                case 1:
                    animation = animations[0];
                    break;
                case 2:
                    animation = animations[1];
                    break;
                case 3:
                    animation = animations[2];
                    break;
                case 4:
                    animation = animations[3];
                    break;
                case 5:
                    animation = animations[4];
                    break;
                default:
                    break;
            }
            if (animation) {
                this.effectWin.animation = animation.name;
                this.scheduleOnce(function(){
                    cb();
                }.bind(this), 3);
            } else {
                cb();
            }
            
        }
    },
    predictBallStop: function (dt) {
        if (this._isCheckBallPredict && this.ballWhite && cc.isValid(this.ballWhite) && this.ballTarget && cc.isValid(this.ballTarget)) {
            var _ballPosObj = { position: this.ballTarget.parent.convertToWorldSpaceAR(this.ballTarget.position), radius: this.circleColiderBallTarget.radius };
            var _circleTargetPosObj = { position: this.node.parent.convertToWorldSpaceAR(this.node.position), radius: this.circleColiderCircleTarget.radius };
            if (cc.Intersection.circleCircle(_ballPosObj, _circleTargetPosObj)) {
                var velocity = this.rigidBodyBallTarget.linearVelocity;
                var v = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
                var start = this.ballTarget.parent.convertToWorldSpaceAR(this.ballTarget.position);
                if (v >= 230) {
                    // //cc.error("Không cần check, impulse vượt vòng tròn...")
                } else if (v < 230) {
                    // //cc.error("Cần check, impulse trong vòng tròn...");
                    var dst = {
                        x: start.x,
                        y: start.y,
                        vx: velocity.x,
                        vy: velocity.y
                    }
                    var _interCept = this.intercept(this.getFiveRoundsCheckObj().round5.position, dst, v);

                    // debugger

                    // debugger
                    // x1 = start.x + velocity.x * t;
                    // y1 = start.y + velocity.y * t - 1 / 2 * (-9.8) * t * t;
                    // var finish = cc.v2(x1, y1);
                    // // sau một giây xem nếu nằm trong vùng khác bi mục tiêu thì để tự nhiên không cần tác động vào
                    // var d = {
                    //     radius: this.circleColiderBallTarget.radius,
                    //     position: finish
                    // };
                    // // //cc.error("start", start);
                    // // //cc.error("finish", finish);
                    // if (this.isNeedImpulse(this.getResultByPositionAndRadius(d))) {
                    //     var vantocbiHientai = this.rigidBodyBallTarget.linearVelocity;
                    //     // var vantocbiTacDong = vantocbiHientai.normalize().scale()
                    // }
                    this._isCheckBallPredict = false;

                }
                // //cc.error(this.ballTarget.position.x);
            }
        }
    },
    intercept: function (src, dst, v) {
        //src: tọa độ ban đầu
        //dst: tọa độ đích
        //velocity: vận tốc ban đầu
        var tx = dst.x - src.x;
        var ty = dst.y - src.y;
        var tvx = dst.vx;
        var tvy = dst.vy;
        //
        var a = tvx * tvx + tvy * tvy - v * v;
        var b = 2 * (tvx * tx + tvy * ty);
        var c = tx * tx + ty * ty;

        var ts = this.quad(a, b, c);
        var sol = null;
        if (ts) {
            var t0 = ts[0];
            var t1 = ts[1];
            var t = Math.min(t0, t1);
            if (t < 0) t = Math.max(t0, t1);
            if (t > 0) {
                sol = {
                    x: dst.x + dst.vx * t,
                    y: dst.y + dst.vy * t
                };
            }
        }
        return sol;
    },
    quad: function (a, b, c) {
        var sol = null;
        if (Math.abs(a) < 1e-6) {
            if (Math.abs(b) < 1e-6) {
                sol = Math.abs(c) < 1e-6 ? [0, 0] : null;
            } else {
                sol = [-c / b, -c / b];
            }
        } else {
            var disc = b * b - 4 * a * c;
            if (disc >= 0) {
                disc = Math.sqrt(disc);
                a = 2 * a;
                sol = [(-b - disc) / a, (-b + disc) / a];
            }
        }
        return sol;
    },
    isNeedImpulse: function (roundWinObj) {
        if (this.maxRoundArr && Array.isArray(this.maxRoundArr)) {
            // //cc.error("du doan", roundWinObj)
            this.maxRoundArr[0] = 5;
            var roundWin = roundWinObj.roundWin;
            var roundWinValid = [];
            for (let i = this.maxRoundArr[0]; i <= 5; i++) {
                roundWinValid.push(i);
            }
            if (roundWin == this.maxRoundArr[0] || roundWinValid.indexOf(roundWin) != -1 || roundWin == 0) {
                return false;
            }
            return true;
        }
        return true;
    },
    setIDBallTarget: function (id) {
        this.idBiTarget = Number(id);
    },
    getIDBallTarget: function () {
        return this.idBiTarget;
    },
    update: function (dt) {
        this.predictBallStop(dt);
        // mục đích để test va chạm vòng tròn luckytarget.
        // this.checkCollider(dt);
    },
    checkCollider: function (dt) {
        if (this._isCheckBallPredict && this.ballWhite && cc.isValid(this.ballWhite) && this.ballTarget && cc.isValid(this.ballTarget)) {
            var _ballPosObj = { position: this.ballTarget.parent.convertToWorldSpaceAR(this.ballTarget.position), radius: this.circleColiderBallTarget.radius };
            var _circleTargetPosObj = { position: this.node.parent.convertToWorldSpaceAR(this.node.position), radius: this.circleColiderCircleTarget.radius };
            if (cc.Intersection.circleCircle(_ballPosObj, _circleTargetPosObj)) {
                var roundWin = this.getResultByPositionAndRadius(_ballPosObj);
                cc.log("roundWin", roundWin);
            }
        }
    }
})


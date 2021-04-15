var BiDaConstant = require('BiDaConstant');
var Linker = require('Linker');
var Global = require("Global2");
var Utils = require('Utils');
var DataManger = require('DataManger');
cc.Class({
    extends: cc.Component,

    properties: {
        cueSpriteFrame: cc.SpriteAtlas,
        whiteBallLine: cc.Node,
        colorBallLine: cc.Node,
        circleCheck: cc.Node,
        circleShadow: cc.Node,
        lineCheck: cc.Node,
        inValidTargetFrameCircle: cc.SpriteFrame,
        validTargetFrameCircle: cc.SpriteFrame,
        cueUI: cc.Node,
        cueCheckColisionNode: cc.Node,
        circleGosh: cc.Node,
        spineArr: [sp.SkeletonData],
        effect: sp.Skeleton,
    },
    update: function (dt) {
        // this.updatePositionCueTime += dt;
        // if (this.updatePositionCueTime >= 5) {
        //     this.updatePositionCueTime = 0;
        //     cc.error("-------------------\nVi tri cue: x: " + this.node.position.x + ", y: " + this.node.position.y + "goc: a: " + this.node.angle);
        // }
    },
    start() {
        this.setCueRotateCueListener();
        this.lineCheck.opacity = 0;
        this.circleGosh.opacity = 0;
        //fake time counter
        this.updatePositionCueTime = 0;
        //ui
        this.radius = 13;
        this.isDebug = false;
        this.tickTime = 0;

        // if (Linker.userData.cueId) {
        //     this.setSpriteCue(Linker.userData.cueId);
        // }

        // cc.log(Linker.userData.cueId);
    },
    blockTouchEvent: function () {
        this.blockInputEventComponent = Utils.Malicious.addNewBlockInputEventNode(this.node);
        if (this.blockInputEventComponent && cc.isValid(this.blockInputEventComponent)) {
            this.blockInputEventComponent.enabled = true;
        }
    },
    unBlockTouchEvent: function () {
        this.blockInputEventComponent = Utils.Malicious.addNewBlockInputEventNode(this.node);
        if (this.blockInputEventComponent && cc.isValid(this.blockInputEventComponent)) {
            this.blockInputEventComponent.enabled = false;
        }
    },
    setCueRotateCueListener: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancle, this);
    },
    setSpriteCue() {
        var cueId = DataManger.UserData.getCurrentStick();
        var spriteFrame = this.cueSpriteFrame.getSpriteFrame(cueId);
        if (spriteFrame) {
            this.cueUI.getComponent(cc.Sprite).spriteFrame = this.cueSpriteFrame.getSpriteFrame(cueId);
        }
        this.setEffect(cueId);  
    },
    setEffect(index) {
        this.effect.node.active = false;
        if (index > 0) {
            this.effect.node.active = true;
            var skeletonData = this.spineArr[index-1];
            this.effect.skeletonData = skeletonData;
            this.effect.animation = "animation";
            // this.effect.clearTracks(0);
            // this.effect.addAnimation(0, "animation", true);
        }
    },
    setControllerBillardGame1vs4: function (node) {
        this.billardGameLayer1vs4 = node;
    },
    setCuePosByTouch: function (pos, isBegan, isEnd, angular, isTable, rotateTable) {
        this.node.setAnchorPoint(cc.v2(1, 0.5));
        if (isBegan) {
            this.tickTime = 0;
        }
        if (this.billardGameLayer1vs4) {
            var billardTable = this.billardGameLayer1vs4.getComponent("BillardsGameTable");
            if (billardTable) {
                var whiteball = billardTable.getWhiteBall();
                if (whiteball && cc.isValid(whiteball)) {
                    this.lineCheck.opacity = 0;
                    this.circleCheck.opacity = 0;
                    this.whiteBallLine.opacity = 0;
                    this.colorBallLine.opacity = 0;
                    var worldCoWhiteBallPosition = whiteball.parent.convertToWorldSpaceAR(whiteball.position);
                    var ballX = worldCoWhiteBallPosition.x;
                    var ballY = worldCoWhiteBallPosition.y;
                    if (!isNaN(angular) && (typeof angular !== "boolean")) {
                        if (Math.abs(angular) > 360) {
                            return;
                        }
                        let angle = angular;
                        let rotate = -angle;
                        // this.node.rotation = rotate;
                        this.node.angle = rotate;
                        this.drawRouteDetection(-rotate);
                        return;
                    }
                    if (!pos) {
                        return;
                    }
                    if (!this.billardGameLayer1vs4) {
                        return;
                    }

                    if (!whiteball) {
                        // this.node.parent.active = false;
                        this.node.position = cc.v2(99999, 99999);
                        // cc.log("White ball disappeared ...");
                        return;
                    }
                    var rotate;
                    if (!isTable) {
                        var rotateX = (pos.x - ballX);
                        var rotateY = (pos.y - ballY);
                        rotate = Math.atan(rotateY / rotateX) * 180 / Math.PI;
                        if (rotateX >= 0 && rotateY >= 0) {
                            rotate = 180 - rotate
                        } else if (rotateX <= 0 && rotateY <= 0) {
                            rotate = 360 - rotate
                        } else if (rotateX <= 0 && rotateY >= 0) {
                            rotate = Math.abs(rotate)
                        } else if (rotateX >= 0 && rotateY <= 0) {
                            rotate = 180 + Math.abs(rotate);
                        }
                    } else {
                        rotate = rotateTable;
                    }
                    var angle = -rotate;
                    // this.node.rotation = rotate;
                    this.node.angle = angle;
                    this.node.position = whiteball.position;
                    this.drawRouteDetection(rotate);
                    var dt = cc.director.getDeltaTime();
                    this.tickTime += dt;
                    if (this.tickTime >= 0.5) {
                        this.tickTime = 0;
                        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.DANG_XAC_LAP_VI_TRI_VA_GOC_QUAY, true);
                        customEvent.rotation = -this.node.angle;
                        customEvent.position = this.node.parent.convertToWorldSpaceAR(this.node.position);
                        customEvent.positionBall = this.node.parent.convertToWorldSpaceAR(whiteball.position);
                        this.node.dispatchEvent(customEvent);
                    }
                    if (isEnd) {
                        //end thì gửi luôn không cần chờ tick time 0.5s mới gửi.
                        this.tickTime = 0;
                        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.XAC_LAP_VI_TRI_GOC_BAN, true);
                        customEvent.rotation = -this.node.angle;
                        customEvent.position = this.node.parent.convertToWorldSpaceAR(this.node.position);
                        customEvent.positionBall = this.node.parent.convertToWorldSpaceAR(whiteball.position);
                        this.node.dispatchEvent(customEvent);
                    }
                }
            }

        }

    },
    getBillardTableComponent: function () {
        if (this.billardGameLayer1vs4 && cc.isValid(this.billardGameLayer1vs4)) {
            var _cmp = this.billardGameLayer1vs4.getComponent("BillardsGameTable");
            if (_cmp) {
                return _cmp;
            }
        }
        return null;
    },
    setPercent: function (_percent, _forcedSend) {
        var currentAngle = this.node.angle;
        var cueRotate = Utils.Malicious.changeAngleTo0to360(-currentAngle);
        var angle = -cueRotate;
        // this.node.rotation = cueRotate;
        this.node.angle = angle;
        var pos = Utils.Malicious.getCuePosByRotate(cueRotate, _percent);
        var whiteball = this.billardGameLayer1vs4.getComponent("BillardsGameTable").getWhiteBall();
        if (!whiteball || !whiteball.isValid) {
            // cc.log("Khong the tim thay white ball ...");
            return;
        }
        var posW = cc.v2(whiteball.position.x + pos.x, whiteball.position.y + pos.y);
        this.node.position = posW;
        var dt = cc.director.getDeltaTime();
        this.tickTime += dt;
        if (this.tickTime >= 0.15 || _forcedSend) {
            this.tickTime = 0;
            var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.DANG_XAC_LAP_LUC_BAN_BI, true);
            customEvent.rotation = BiDaConstant.TABLE_STATUS.DRAGGING_CUE_BOX;
            customEvent.position = this.node.parent.convertToWorldSpaceAR(this.node.position);
            this.node.dispatchEvent(customEvent);
        }
    },
    onTouchStart: function (event) {
        if (event) {
            if (this.blockInputEventComponent.enabled) {
                return;
            }
            var billardGameLayer1vs4View = this.getBillardTableComponent();
            if (billardGameLayer1vs4View) {
                billardGameLayer1vs4View.activeFineTurning();
                this.setCuePosByTouch(event.getLocation(), true, false, false);
            }
        }
    },
    onTouchMove: function (event) {
        if (event) {
            if (this.blockInputEventComponent.enabled) {
                return;
            }
            var billardGameLayer1vs4View = this.getBillardTableComponent();
            if (billardGameLayer1vs4View) {
                billardGameLayer1vs4View.activeFineTurning();
                this.setCuePosByTouch(event.getLocation(), false, false, false);
            }
        }
    },
    onTouchEnd: function (event) {
        if (event) {
            if(this.blockInputEventComponent.enabled){
                return;
            }
            var billardGameLayer1vs4View = this.getBillardTableComponent();
            if (billardGameLayer1vs4View) {
                this.setCuePosByTouch(event.getLocation(), false, true, false);
            };

        }
    },
    onTouchCancle: function (event) {
        if (event) {
            if(this.blockInputEventComponent.enabled){
                return;
            }
            this.onTouchEnd(event);
        }
    },
    setCircleByLegal: function (isLegal) {
        if (isLegal) {
            this.circleShadow.getComponent(cc.Sprite).spriteFrame = this.validTargetFrameCircle;
        } else {
            this.circleShadow.getComponent(cc.Sprite).spriteFrame = this.inValidTargetFrameCircle;
        }
    },
    getBoxColiderPosition: function (colider) {
        if (colider.hasOwnProperty("world") && colider.world.points && Array.isArray(colider.world.points) && colider.world.points.length > 0) {
            var posObj = {};
            var points = colider.world.points;
            for (let i = 0; i < points.length; i++) {
                posObj["pos_" + i + 1] = {
                    x: points[i].x,
                    y: points[i].y
                }
            }
            return posObj;
        }
        return { pos1: { x: 0, y: 0 } };
    },
    createRect: function (data) {
        if (data) {
            //local
            var offset = data.offset;
            var size = data.size;
            //convert ra anchor 0,0 do node hien tai la 0.5, 0.5
            offset.x = offset.x - size.width * 0.5;
            offset.y = offset.y - size.height * 0.5;
            //world
            var _center = this.node.parent.convertToWorldSpaceAR(offset);
            return new cc.Rect(_center.x, _center.y, size.width, size.height);
        }
        return null
    },
    drawRouteDetection: function (rotate, data) {
        var default_rotate = rotate;
        rotate = 360 - rotate;
        var whiteBall = this.billardGameLayer1vs4.getComponent("BillardsGameTable").getWhiteBall();
        if (whiteBall && cc.isValid(whiteBall) && whiteBall.parent) {
            var mainLayer = whiteBall.parent;
            var _tableBoxCollider = mainLayer.getComponent(cc.BoxCollider);//check chi huong co out ra khoi ban choi hay khong
            var _line = this.lineCheck;
            _line.angle = 0;
            var _circle = this.circleCheck;
            var _circleGosh = this.circleGosh;
            var _whiteBallLine = this.whiteBallLine;
            var _colorBallLine = this.colorBallLine;
            _line.opacity = 0;
            _circle.opacity = 0;
            _whiteBallLine.opacity = 0;
            _colorBallLine.opacity = 0;
            rotate = Utils.Malicious.toPositiveAngle(rotate);
            //current rotate
            var whiteBallPos = mainLayer.convertToWorldSpaceAR(whiteBall.position);
            var _whitePosX = whiteBallPos.x;
            var _whitePosY = whiteBallPos.y;
            var _whitePos = cc.v2(_whitePosX, _whitePosY);
            //
            var _tmpCollisionBall = [];
            var _ball;
            var _ballJS;
            var ballPos;
            var ballPosX;
            var ballPosY;
            var _ballId;
            var _isCircleIntersectPolygon;
            var _isCircleIntersectCircle;
            this.cueCheckColisionNode.width = this.node.parent.width;
            this.cueCheckColisionNode.height = this.radius * 2.1;
            var _height = this.cueCheckColisionNode.height;
            var _width = this.cueCheckColisionNode.width;
            var offsetCue = cc.v2(14, 0);//ban kinh vien bi 13
            this.cueCheckColisionNode.position = cc.v2(this.cueCheckColisionNode.width * 0.5 + offsetCue.x, 0);
            var _center = this.cueCheckColisionNode.parent.convertToWorldSpaceAR(this.cueCheckColisionNode.position);
            var _angle = cc.misc.degreesToRadians(rotate);
            var p1 = cc.v2(0, 0);
            var p2 = cc.v2(0, 0);
            var p3 = cc.v2(0, 0);
            var p4 = cc.v2(0, 0);
            // top
            p4.x = _center.x - ((_width / 2) * Math.cos(_angle)) - ((_height / 2) * Math.sin(_angle));
            p4.y = _center.y - ((_width / 2) * Math.sin(_angle)) + ((_height / 2) * Math.cos(_angle));
            p3.x = _center.x + ((_width / 2) * Math.cos(_angle)) - ((_height / 2) * Math.sin(_angle));
            p3.y = _center.y + ((_width / 2) * Math.sin(_angle)) + ((_height / 2) * Math.cos(_angle));
            //bottom
            p1.x = _center.x - ((_width / 2) * Math.cos(_angle)) + ((_height / 2) * Math.sin(_angle));
            p1.y = _center.y - ((_width / 2) * Math.sin(_angle)) - ((_height / 2) * Math.cos(_angle));
            p2.x = _center.x + ((_width / 2) * Math.cos(_angle)) + ((_height / 2) * Math.sin(_angle));
            p2.y = _center.y + ((_width / 2) * Math.sin(_angle)) - ((_height / 2) * Math.cos(_angle));
            var _polygon = [p1, p2, p3, p4];
            var _circleGoshRadius = _circleGosh.getComponent(cc.CircleCollider).radius;
            for (let i = 0; i < mainLayer.children.length; i++) {
                _ball = mainLayer.children[i];
                _ballJS = _ball.getComponent("Ball");
                if (_ballJS) {
                    ballPos = _ball.parent.convertToWorldSpaceAR(_ball.position);
                    ballPosX = ballPos.x;
                    ballPosY = ballPos.y;
                    _ballId = _ballJS.getIdBi();
                    if (isNaN(parseInt(_ballId)) == false && _ballId != 0) {
                        var _circleBallObj = { position: ballPos, radius: _ball.getComponent(cc.CircleCollider).radius };
                        //càng cao càng dễ trúng
                        _isCircleIntersectPolygon = cc.Intersection.polygonCircle(_polygon, _circleBallObj);
                        //xem circle gosh có giao với circle hay không đã
                        if (_isCircleIntersectPolygon) {
                            var _ballDistance = Utils.Malicious.twoDistance(_whitePos.x, _whitePos.y, ballPosX, ballPosY);
                            // var _tmpDistance = _ballDistance;
                            // var _tmpD = Utils.Malicious.getShortestDistanceBetweenPointAndLine(rotate, _circleBallObj.position, _whitePos, _circleBallObj.radius);
                            // var _tmpValue = _tmpD._value;
                            // var _circleGoshPosition = cc.v2(_tmpDistance - _tmpValue, 0);
                            // var _circleGoshPositionWorld = _circleGosh.parent.convertToWorldSpaceAR(_circleGoshPosition);
                            // var _circleGoshObj = { position: _circleGoshPositionWorld, radius: _circleGoshRadius };
                            // _isCircleIntersectCircle = cc.Intersection.circleCircle(_circleGoshObj, _circleBallObj);
                            // if (_isCircleIntersectCircle) {
                            _tmpCollisionBall.push({
                                tag: _ballId,
                                distance: _ballDistance,
                                ball: _ball,
                                color_tag: _ballJS.getColorTag()
                            });
                            // }
                        }
                    }

                }
            }

            var condt = _tmpCollisionBall.length > 0 && _tmpCollisionBall[0].tag != 0;
            if (condt) {
                _tmpCollisionBall.sort(function (a, b) {
                    return a.distance - b.distance;
                });
                //set legal color
                this.setCircleByLegal(true);
                //show target
                var _tmpCollisionBallS = _tmpCollisionBall[0];
                this.showtarget(_tmpCollisionBallS.tag);
                if (_tmpCollisionBallS.tag == Number(BiDaConstant.TAG.eight)) {
                    var _isFinalTurn = this.billardGameLayer1vs4.getComponent("BillardsGameTable").getFinalBall();
                    if (!_isFinalTurn) {
                        this.setCircleByLegal(false);
                    }
                } else if (_tmpCollisionBallS.color_tag == BiDaConstant.COLOR_TAG.OPPONENT) {
                    this.setCircleByLegal(false);
                }
                //sort distance
                var _ballPos = {};
                var wballPos = _tmpCollisionBallS.ball.parent.convertToWorldSpaceAR(_tmpCollisionBallS.ball.position);
                _ballPos.x = wballPos.x;
                _ballPos.y = wballPos.y;
                var d = Utils.Malicious.getShortestDistanceBetweenPointAndLine(rotate, _ballPos, _whitePos, this.radius);
                var _value = d._value;
                var _isUpOrDown = d._isUpOrDown;
                _line.width = _tmpCollisionBallS.distance - _value + this.radius * 0.4 - _line.height * 0.5;
                _line.height = _line.height;
                var _circlePosition = cc.v2(_tmpCollisionBallS.distance - _value, 0);
                var _circlePositionCheck = cc.v2(_tmpCollisionBallS.distance - _value + _circle.width * 0.5, 0);
                _circle.position = _circlePosition;
                if (_tableBoxCollider) {
                    var _dataRect = { offset: cc.v2(482.8, 269.3), size: cc.size(848.4, 415.3) };
                    if (Linker.ZONE != BiDaConstant.ZONE_ID.ZONEID_BIDA_LUCKY_SHOT) {
                        _dataRect.offset = cc.v2(549.9, 306.9);
                        _dataRect.size = cc.size(957.3, 469.9);
                    }
                    var tableRect = this.createRect(_dataRect);
                    if (tableRect) {
                        var _circlePositionWolrd = _circle.parent.convertToWorldSpaceAR(_circlePositionCheck);
                        if (tableRect.contains(_circlePositionWolrd)) {
                            var angle = Math.asin(_value / this.radius / 2) * 180 / Math.PI;
                            _whiteBallLine.position = cc.v2(_tmpCollisionBallS.distance - _value, 0);
                            var _rotation = _isUpOrDown * angle;
                            var _angle = -_rotation;
                            // _whiteBallLine.rotation = _rotation;
                            _whiteBallLine.angle = _angle;
                            _whiteBallLine.getChildByName("offset").width = 90 - angle;
                            _whiteBallLine.getChildByName("offset").height = _whiteBallLine.height;

                            var _cX = _tmpCollisionBallS.distance - _value;
                            var _cY = 0
                            _rotation = _isUpOrDown * angle - _isUpOrDown * 90;
                            _angle = -_rotation;
                            // _colorBallLine.rotation = _rotation;
                            _colorBallLine.angle = _angle;
                            _colorBallLine.getChildByName("offset").width = (angle-40);
                            _colorBallLine.position = cc.v2(_cX, _cY);
                            _colorBallLine.getChildByName("offset").height = _whiteBallLine.height;
                            // get collider box

                            var _colorBallLineOffset = _colorBallLine.getChildByName("offset");
                            var _colorBallLineBox = _colorBallLineOffset.getComponent(cc.BoxCollider);
                            if (_colorBallLineBox) {
                                var _lengthCheck = this.node.parent.width;
                                console.log("_lengthCheck:",_lengthCheck);
                                _colorBallLineBox.size = cc.size(_lengthCheck, 26);//13*2
                                _colorBallLineBox.offset = cc.v2(_lengthCheck / 2 - _colorBallLineOffset.position.x);
                                //
                                var _sixHoleInTable = this.node.parent.getComponents(cc.PhysicsCircleCollider);
                                if (_sixHoleInTable && Array.isArray(_sixHoleInTable) && _sixHoleInTable.length > 0) {
                                    for (let i = 0; i < _sixHoleInTable.length; i++) {
                                        //pending
                                        var _isHoleIntersectPolygon = cc.Intersection.polygonCircle(_colorBallLineBox.world.points, { position: this.node.parent.convertToWorldSpaceAR(_sixHoleInTable[i].offset), radius: _sixHoleInTable[i].radius });
                                        if (_isHoleIntersectPolygon) {
                                        }
                                    }
                                }
                            }
                            //thiết lập xong các tham số rồi mới hiện cue
                            _line.opacity = 255;
                            _circle.opacity = 255;
                            _whiteBallLine.opacity = 255;
                            _colorBallLine.opacity = 255;
                        } else {
                            this.drawRouteToWall(rotate, _whitePos, this.radius, this.node.parent);
                            this.showtarget(0);
                            // this.hideMenuPopUp(event);
                        }
                    } else {
                        this.drawRouteToWall(rotate, _whitePos, this.radius, this.node.parent);
                        this.showtarget(0);
                        // this.hideMenuPopUp(event);
                    }
                }

            } else {
                this.drawRouteToWall(rotate, _whitePos, this.radius, this.node.parent);
                this.showtarget(0);
                return null;
            }
            _circleGosh.position = cc.v2(0, 0);
        }
        return null;
    },
    showtarget: function (idBi) {
        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.HIEN_THI_BI_DANG_CHI_DEN, true);
        customEvent.idBi = idBi;
        this.node.dispatchEvent(customEvent);
    },
    drawRouteToWall: function (rotate, _whitePos, _radius, parent) {
        //danh cho va cham voi tuong nhe ae
        var lengthAndResult = Utils.Malicious.checkCollisionPointBetweenLines(rotate, _whitePos, _radius, parent);
        if (lengthAndResult) {
            var _value = Math.abs(lengthAndResult);
            this.circleCheck.opacity = 255;
            var _pos = cc.v2(_value, 0);
            this.circleCheck.position = _pos;
            this.lineCheck.width = _pos.x - _radius;
            this.lineCheck.height = this.lineCheck.height;
            //true cho mau trang, false cho mau do
            this.setCircleByLegal(true);
            this.colorBallLine.opacity = 0;
            this.whiteBallLine.opacity = 0;
            this.lineCheck.opacity = 255;
        }
    },
    onDestroy: function () {
        // debugger
    },
    bind(target) {
        this.node.position = target.position;
    }
});

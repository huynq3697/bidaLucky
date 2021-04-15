var RAY_CAST_TYPE = cc.Enum({
    T1: cc.RayCastType.Closest,
    T2: cc.RayCastType.Any,
    T3: cc.RayCastType.AllClosest
});
var Utils = require('Utils');

cc.Class({
    extends: cc.Component,

    properties: {
        radius: 1000,
        raycastCirclePrefab: cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        this.init();
    },
    init: function () {
        this.rayCastType = RAY_CAST_TYPE.T3;
        this.ctx = this.getComponent(cc.Graphics);
        this.addRaycastCircle();
    },
    addRaycastCircle: function () {
        this.node.removeAllChildren(true);
        this.raycastCircle = cc.instantiate(this.raycastCirclePrefab);
        this.raycastCircle.opacity = 0;
        this.node.addChild(this.raycastCircle);
        this.radius_colider = this.raycastCircle.getComponent(cc.CircleCollider).radius * 0.99;
    },
    onXacLapGocVaViTriRayCast: function (event) {
        this.centertmp = event.position_raycast;
        this.center = this.node.parent.convertToNodeSpace(this.centertmp);
        var direction = this.node.parent.convertToNodeSpace(event.loc);
        direction = direction.sub(this.center);
        direction = direction.normalize();
        var angleradian = direction.signAngle(cc.v2(-1, 0));
        this.angleradian = -angleradian;
        this.drawRaycast();
    },
    toPositiveAngle: function (angle) {
        angle = angle % 360;
        while (angle < 0) {
            angle += 360.0;
        }
        return angle;
    },
    onDaXacLapGocVaViTriRayCast: function (event) {
        this.ctx.clear();
        this.raycastCircle.opacity = 0;
    },
    drawRaycast: function () {
        var p1 = this.centertmp;
        var p2 = this.lineToAngle(this.centertmp.x, this.centertmp.y, this.radius, this.angleradian);
        this.ctx.clear();
        this.remainLength = this.radius;
        // var points = this.findOpositePoint(p1, p2);
        var points = this.findCO2positePoint(p1, p2);
        this.rayCast(points);
    },
    findOpositePoint: function (p1, p2) {
        var pc1 = p1;
        var pc2 = p2;
        var pa1 = cc.v2(0, 0);
        var pa2 = cc.v2(0, 0);
        var pb1 = cc.v2(0, 0);
        var pb2 = cc.v2(0, 0);
        //find pa
        pa1.x = pc1.x + (Math.cos(90 - this.angleradian) * this.radius_colider);
        pa1.y = pc1.y - (Math.sin(90 - this.angleradian) * this.radius_colider);
        pa2 = this.lineToAngle(pa1.x, pa1.y, this.radius, this.angleradian);
        //find pb
        // var x1 = pc1.x - this.radius_colider * Math.cos(this.angleradian);
        // var y1 = pc1.y - this.radius_colider * Math.cos(this.angleradian);
        pb1.x = pc1.x - (Math.cos(90 - this.angleradian) * this.radius_colider);
        pb1.y = pc1.y + (Math.sin(90 - this.angleradian) * this.radius_colider);
        pb2 = this.lineToAngle(pb1.x, pb1.y, this.radius, this.angleradian);
        return {
            pc1: pc1,
            pc2: pc2,
            pa1: pa1,
            pa2: pa2,
            pb1: pb1,
            pb2: pb2
        }
    },
    findCO2positePoint: function (center, rdis) {
        var x1 = center.x;
        var y1 = center.y;
        var x2 = rdis.x;
        var y2 = rdis.y;
        var a = y1 - y2;
        var b = x2 - x1;
        var norm = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        var dist = this.radius_colider;
        a = a / norm;
        b = b / norm;
        var x4 = x1 + a * dist;
        var y4 = y1 + b * dist;
        var nx4 = x1 - a * dist;
        var ny4 = y1 - b * dist;

        var pc1 = center;
        var pc2 = rdis;
        var pa1 = cc.v2(x4, y4);
        var pa2 = this.lineToAngle(pa1.x, pa1.y, this.radius, this.angleradian);
        var pb1 = cc.v2(nx4, ny4);
        var pb2 = this.lineToAngle(pb1.x, pb1.y, this.radius, this.angleradian);

        return {
            pc1: pc1,
            pc2: pc2,
            pa1: pa1,
            pa2: pa2,
            pb1: pb1,
            pb2: pb2
        }
    },
    lineToAngle: function (x1, y1, length, angle) {
        var x2 = x1 + length * Math.cos(angle);
        var y2 = y1 + length * Math.sin(angle);
        return cc.v2(x2, y2);
    },
    checkResultRaycast: function (resArr, tmp) {
        var point = null;
        var result = false;
        var idBi = null;
        var bi = null;
        var tmp = null;
        for (var i = 0; i < resArr.length; i++) {
            var node = resArr[i].collider.node;
            var ballJS = node.getComponent("Gball");
            if (ballJS && ballJS.getIdBi() != 0) {
                resArr[i].point = this.node.parent.convertToNodeSpace(resArr[i].point);
                point = resArr[i].point;
                idBi = ballJS.getIdBi();
                result = true;
                bi = node;
                tmp = resArr[i];
                break;

            } else {
                result = false;
                point = null;
                idBi = null;
                bi = null;
                tmp = null;
                // cc.log("Dang tro den ban bida roi ...");
            }
        }
        return { result: result, point: point, idBi: idBi, bi: bi, tmp: tmp };
    },
    rayCast: function (points) {
        this.ctx.clear();
        var pc1 = points.pc1;
        var pc2 = points.pc2;
        var pa1 = points.pa1;
        var pa2 = points.pa2;
        var pb1 = points.pb1;
        var pb2 = points.pb2;

        var manager = cc.director.getPhysicsManager();
        var resultsC = manager.rayCast(pc1, pc2, RAY_CAST_TYPE.T1);
        var resultsCT = resultsC;
        var resultsA = manager.rayCast(pa1, pa2, RAY_CAST_TYPE.T1);
        var resultsAT = resultsA;
        var resultsB = manager.rayCast(pb1, pb2, RAY_CAST_TYPE.T1);
        var resultsBT = resultsB;
        
        var results = { resultc: {}, resulta: {}, resultb: {} };
        if (resultsC && resultsC.length > 2) {
            resultsC.splice(1, resultsC.length - 3);
        }
        if (resultsA && resultsA.length > 2) {
            resultsA.splice(1, resultsA.length - 3);
        }
        if (resultsB && resultsB.length > 2) {
            resultsB.splice(1, resultsB.length - 3);
        }

        results.resultc = this.checkResultRaycast(resultsC, resultsCT);
        results.resulta = this.checkResultRaycast(resultsA, resultsAT);
        results.resultb = this.checkResultRaycast(resultsB, resultsBT);
        var idBi = 0;
        var point = null;
        var center = false;
        var offset = null;
        var result = null;
        
        if (results.resultc.result && results.resulta.result && results.resultb.result) {
            //o day dang test giao voi vi tri chinh giua
            let idBiArr = [];
            idBiArr.push(results.resulta.idBi, results.resultb.idBi, results.resultc.idBi);
            var counter = [];
            for (let i = 0; i < idBiArr.length; i++) {
                var d = Utils.Malicious.getOccurrence(idBiArr, idBiArr[i]);
                counter.push({ id: idBiArr[i], times: d });
            }
            var data = this.checkOffsetPosition(pc1, pc2, [results.resulta, results.resultb, results.resultc]);
            point = data.point
            idBi = data.idBi;
            pc2 = data.point;
            result = data.tmp;
            if (idBi == results.resultc.idBi) {
                center = true;
            }

        } else if (results.resulta.result && results.resultc.result) {
            // cc.log("ca 2 tia ben ngoai chi den");
            //phai xem xet la danh tiep giap voi bi nao da
            //o day dang test la giao voi vi tri ca a va b, phan nay can chinh sua mot cach chinh xac hon nua
            var data = this.checkOffsetPosition(pc1, pc2, [results.resulta, results.resultc]);
            point = data.point
            idBi = data.idBi;
            pc2 = data.point;
            result = data.tmp;
            if (idBi == results.resultc.idBi) {
                center = true;
            }

        } else if (results.resultb.result && results.resultc.result) {
            // cc.log("ca 2 tia ben ngoai chi den");
            //phai xem xet la danh tiep giap voi bi nao da
            //o day dang test la giao voi vi tri ca a va b, phan nay can chinh sua mot cach chinh xac hon nua
            var data = this.checkOffsetPosition(pc1, pc2, [results.resultb, results.resultc]);
            point = data.point
            idBi = data.idBi;
            pc2 = data.point;
            result = data.tmp;
            if (idBi == results.resultc.idBi) {
                center = true;
            }
        }else if (results.resulta.result && results.resultb.result) {
            // cc.log("chi co tia a");
            //phai xem xet la danh tiep giap voi bi nao da
            //o day dang test la giao voi vi tri a
            var data = this.checkOffsetPosition(pc1, pc2, [results.resulta, results.resultb]);
            point = data.point
            idBi = data.idBi;
            pc2 = data.point;
            result = data.tmp;
        } else if (results.resulta.result) {
            // cc.log("chi co tia a");
            //phai xem xet la danh tiep giap voi bi nao da
            //o day dang test la giao voi vi tri a
            point = results.resulta.point
            idBi = results.resulta.idBi;
            pc2 = results.resulta.point;
            result = results.resulta.tmp;
        } else if (results.resultb.result) {
            // cc.log("chi co tia b");
            //phai xem xet la danh tiep giap voi bi nao da
            //o day dang test la giao voi vi tri a
            point = results.resultb.point
            idBi = results.resultb.idBi;
            pc2 = results.resultb.point;
            result = results.resultb.tmp;
        }
        
        //ve dot hinh tron
        if (point) {
            // this.ctx.circle(point.x, point.y, 5);
            // this.ctx.fill();
            this.showtarget(idBi);
        }
        if (resultsC) {
            if (resultsC[0]) {
                pc2 = resultsC[0].point;
                // result = resultsCT[0];
                //tuong wall
            }
        }
        pc1 = this.node.parent.convertToNodeSpace(pc1);
        pc2 = this.node.parent.convertToNodeSpace(pc2);
        this.raycastCircle.opacity = 255;

        var rpc2 = (point) ? this.findRightPosition(pc1, point, pc2, center, offset) : this.findRightPosition(pc1, pc2, pc2, true, false);
        this.raycastCircle.position = rpc2;

        this.ctx.lineWidth = 2;
        this.ctx.moveTo(pc1.x, pc1.y);
        this.ctx.lineTo(rpc2.x, rpc2.y);
        this.ctx.strokeColor = cc.Color.WHITE;
        this.ctx.stroke();
        if(result){
            var gnode = result.collider.node;
            var gjs = gnode.getComponent("Gball");
            if(point && gjs){
                this.strokeReflectRay(pc1, rpc2, result);
            }
        }
    },
    strokeReflectRay: function (p1, p2, result) {
        if (result && result.hasOwnProperty("normal")) {
            //ve huong cua bi dich
            var gnode = result.collider.node;
            var r = this.raycastCircle.getComponent(cc.CircleCollider).radius * 3;
            var a = p2;
            var b = gnode.parent.convertToWorldSpaceAR(gnode.position);
            this.ctx.lineWidth = 2;
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.strokeColor = cc.Color.RED;
            this.ctx.stroke();
            //ve huong cua bi trang
            var a2 = p2;
            var b2 = this.lineToAngle(a2.x, a2.y, r, this.angleradian);
            this.ctx.lineWidth = 2;
            this.ctx.moveTo(a2.x, a2.y);
            this.ctx.lineTo(b2.x, b2.y);
            this.ctx.strokeColor = cc.Color.GRAY;
            this.ctx.stroke();
        }
    },
    checkCounterBi: function (arr) {
        let c = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].times > c) {
                c = arr[i].times;
            }
        }
        return c;
    },
    checkOffsetPosition: function (pc1, pc2, targets) {
        var segs = [];
        for (let j = 0; j < targets.length; j++) {
            var s = this.findIntersect(this.node.parent.convertToNodeSpace(pc1), targets[j].point, this.node.parent.convertToNodeSpace(pc2));
            var sl = this.node.parent.convertToNodeSpace(pc1).sub(s).mag();
            segs.push({ target: targets[j], distance: sl });
        }
        var shortest = segs[0].distance;
        var target = segs[0].target;
        for (let i = 0; i < segs.length; i++) {
            if (segs[i].distance < shortest) {
                shortest = segs[i].distance;
                target = segs[i].target;
            }
        }
        return {
            point: target.point,
            idBi: target.idBi,
            pc2: target.point,
            tmp: target.tmp
        }
    },
    findIntersect: function (p1, p2, p3) {
        var p4 = cc.v2(0, 0);
        if (p1.x == p3.x) {
            p4 = cc.v2(p1.x, p2.y);
        } else if (p1.y == p3.y) {
            p4 = cc.v2(p2.x, p1.y);
        } else {
            var slope = (p3.y - p1.y) / (p3.x - p1.x);
            var m = -1 / slope;
            p4.x = ((m * p2.x) - p2.y - (slope * p1.x) + p1.y) / (m - slope);
            p4.y = m * p4.x - m * p2.x + p2.y;
        }
        return p4;
    },
    findRightPosition: function (p1, p2, p3, center, offset) {
        var p4 = cc.v2(0, 0);
        if (p1.x == p3.x) {
            p4 = cc.v2(p1.x, p2.y);
        } else if (p1.y == p3.y) {
            p4 = cc.v2(p2.x, p1.y);
        } else {
            var slope = (p3.y - p1.y) / (p3.x - p1.x);
            var m = -1 / slope;
            p4.x = ((m * p2.x) - p2.y - (slope * p1.x) + p1.y) / (m - slope);
            p4.y = m * p4.x - m * p2.x + p2.y;
            //de vuong goc thi 
        }
        if (!center) {
            return p4;
        }
        var gap = this.raycastCircle.getComponent(cc.CircleCollider).radius;
        var length = p1.sub(p4).mag() - gap;
        var p4offset = cc.v2(0, 0);
        p4offset.x = (length * p4.x + gap * p1.x) / (length + gap);
        p4offset.y = (length * p4.y + gap * p1.y) / (length + gap);
        return p4offset;

    },
    getAngle: function (p1, p2) {
        var deltaY = (p2.y - p1.y);
        var deltaX = (p2.x - p1.x);
        var result = Math.atan(deltaY, deltaX);
        return result;
    },
    showtarget: function (idBi) {
        var customEvent = new cc.Event.EventCustom(BiDaConstant.GAME_TABLE_EVENT.HIEN_THI_BI_DANG_TRO_DEN, true);
        customEvent.idBi = idBi;
        this.node.dispatchEvent(customEvent);
    }
});

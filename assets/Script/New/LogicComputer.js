// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {

    // },
    // update (dt) {},
    checkDanhBai(lst,lastCard,firstTurn){
        
        // hàm trả về tất cả các lá có thể đánh
        var lstSuggest = [];
        if(firstTurn == null && lst.indexOf(12) > -1 && lastCard.length == 0){
            lstSuggest = this.findByRank(lst,12);
            var lstDanh = this.findByChain(lst,12);
            if(lstDanh.length > 2){
                lstDanh.forEach(item=>{
                    lstSuggest.push(item);
                });
            }
            lstSuggest.forEach(card=>{
                for (let k = 0; k < 4; k++) {
                    var value = parseInt(card/4) * 4 + k;
                    if(lst.indexOf(value) > -1){
                        lstSuggest.push(value);
                    }
                }
            });
        }else if(lastCard.length === 0){
            lstSuggest = lst;
        }else{
            var type = this.kiemTraTinhHopLeCuaBoBai(lastCard);
            //cc.log("Kiểm tra đánh bài",type,type2);
            // type = 0 -> không hợp lệ
            // type = 1 -> đánh dây
            // type = 2 -> đánh lẻ hoặc đánh đôi
            // type = 3 -> 3 đôi thông
            // type = 4 -> tứ quý

            if(type == 1){
                // đi từ trên xuống kiểm tra các dây có thể đánh chặn (trong dây sở hữu lá bài lớn hơn quân bài lớn nhất của lastCard)
                for (let i = lst.length -1; i >= 2 && lst[i] > lastCard[lastCard.length-1]; i--) {
                    if(parseInt(lst[i]/4) == 15) continue;
                    var lstDanh = []; // mảng tạm thời
                    var rank = parseInt(lst[i]/4);
                    for (let j = i; j >= 0; j--) {
                        if(parseInt(lst[j]/4) == rank){
                            rank--;
                            lstDanh.push(lst[j]);
                            if(lstDanh.length == lastCard.length){
                                lstDanh.forEach(value=>{
                                    lstSuggest.push(value);
                                });
                                break; // kết thúc 1 lần tìm
                            }
                        }
                    }               
                }
                lstSuggest.forEach(card=>{
                    for (let k = 0; k < 4; k++) {
                        var value = parseInt(card/4) * 4 + k;
                        if(lst.indexOf(value) > -1){
                            lstSuggest.push(value);
                        }
                    }
                });
                
            }else if(type ==2){
                if(lastCard.length == 1){
                    // đánh lẻ
                    lst.forEach(item=>{
                        if(item > lastCard[0]){
                            lstSuggest.push(item);
                        }
                    });
                }else{
                    // đánh đôi trở lên
                    var data = this.findRank(lst);
                    data.forEach(item=>{
                       if(item.lst.length >= lastCard.length && item.lst[item.lst.length -1] > lastCard[lastCard.length-1]){
                           item.lst.forEach(value=>{
                               lstSuggest.push(value);
                           })
                       }
                    });
                }
                if(parseInt(lastCard[0]/4) == 15 && lastCard.length < 3){
                    // Đánh heo
                    var findDoiThong = this.findDoiThong(lst,null);
                    var findTuQuy = this.findTuQuy(lst);
                    if(lastCard.length < 2 || (findDoiThong.length > 0 && findDoiThong[0].length >= 8)){
                        findDoiThong.forEach(lst=>{
                            lst.forEach(item=>{
                                lstSuggest.push(item);
                            });
                        });
                    }
                    findTuQuy.forEach(item=>{
                        for (let i = 0; i < 4; i++) {
                            lstSuggest.push(item*4+i);
                        }
                    });
                }
            }else if(type == 3){
                var findDoiThong = this.findDoiThong(lst,null);
                var findTuQuy = this.findTuQuy(lst);
                if(findDoiThong.length > 0 && (findDoiThong[0].length > lastCard.length||(findDoiThong[0].length == lastCard.length && findDoiThong[0][findDoiThong[0].length -1] > lastCard[lastCard.length -1]))){
                    findDoiThong[0].forEach(value=>{
                        lstSuggest.push(value);
                    });
                }
                lstSuggest.forEach(card=>{
                    for (let k = 0; k < 4; k++) {
                        var value = parseInt(card/4) * 4 + k;
                        if(lst.indexOf(value) > -1){
                            lstSuggest.push(value);
                        }
                    }
                });
                if(findTuQuy.length > 0 && lastCard.length < 8){
                    findTuQuy.forEach(item=>{
                        for (let i = 0; i < 4; i++) {
                            lstSuggest.push(item*4+i);
                        }
                    });
                }
            }else if(type == 4){
                var findDoiThong = this.findDoiThong(lst,null);
                var findTuQuy = this.findTuQuy(lst);
                if(findDoiThong.length > 0 && findDoiThong[0].length == 8){
                    findDoiThong[0].forEach(value=>{
                        lstSuggest.push(value);
                    });
                }
                lstSuggest.forEach(card=>{
                    for (let k = 0; k < 4; k++) {
                        var value = parseInt(card/4) * 4 + k;
                        if(lst.indexOf(value) > -1){
                            lstSuggest.push(value);
                        }
                    }
                });
                if(findTuQuy.length > 0){
                    findTuQuy.forEach(item=>{
                        if(item*4 > lastCard[0]){
                            for (let i = 0; i < 4; i++) {
                                lstSuggest.push(item*4+i);
                            }
                        }
                    });
                }
            }
        }
        return lstSuggest;
    },


    findTuQuy(lst){
        // hàm tìm ra tứ quý trong bộ bài
        //lst = [12, 13, 14, 15, 31, 32, 33, 34, 35, 59, 61, 62, 63];
        var lstRankTuQuy = [];
        var rank = parseInt(lst[0] / 4);
        var dem = 0;
        lst.forEach(item =>{
            if(dem == 4){
                lstRankTuQuy.push(rank);
            }
            if(parseInt(item / 4) === rank){
                dem++;
            }else{
                rank = parseInt(item / 4);
                dem = 1;
            }
        });
        if(dem == 4){
            lstRankTuQuy.push(rank);
        }
        //cc.log(lst,rank, dem,lstRankTuQuy);
        return lstRankTuQuy;
    },
    findDoiThong(lst,value){
        // hàm tìm ra đôi thông trong bộ bài
        //lst = [16, 17, 20, 23, 24, 25, 32, 33, 36, 37, 40, 42, 63];
        var lstDoiThong = [];
        var lst3 = [];
        var lstNew = this.findRank(lst);
        
        for (let i = 0; i < lstNew.length; i++) {
            if(i < lstNew.length - 1 && lstNew[i].rank + 1 === lstNew[i + 1].rank && lstNew[i].lst.length >= 2){
                for (let j = 0; j < 2; j++) {
                    // chỉ lấy 2 lá của 1 rank
                    lstDoiThong.push(lstNew[i].lst[j]);                                
                }
                if(value != null && lstNew[i].rank == parseInt(value/4) && lstDoiThong.indexOf(value) < 0){
                    lstDoiThong.splice(lstDoiThong.length -1,1,value);
                }
            }else{
                if(i > 0 && lstNew[i].rank === lstNew[i - 1].rank + 1 && lstNew[i].lst.length >= 2 && lstNew[i].rank < 15){
                    for (let j = 0; j < 2; j++) {
                        // chỉ lấy 2 lá của 1 rank
                        lstDoiThong.push(lstNew[i].lst[j]);                                
                    }
                    if(value != null && lstNew[i].rank == parseInt(value/4) && lstDoiThong.indexOf(value) < 0){
                        lstDoiThong.splice(lstDoiThong.length -1,1,value);
                    }
                }
                if(lstDoiThong.length > 5){
                    lst3.push(lstDoiThong);
                }
                lstDoiThong = [];
            }
        }
        return lst3;
    },
    kiemTraTinhHopLeCuaBoBai(lstDanh){
        var type = 0; 
        if(lstDanh.length === 0){
            type = 0;// nghĩa là bài ko hợp lệ
        }else{
            var lst1 = [],lst2 = [];
            var rank1 = parseInt(lstDanh[0]/4);
            var rank2 = rank1;
            lstDanh.forEach(item=>{
                if(parseInt(item/4) === rank2){
                    lst2.push(item);
                }
                if(parseInt(item/4) === rank1){
                    lst1.push(item);
                    rank1++;
                }
            });
            // kiểm tra là dây trước
            if(lst1.length === lstDanh.length && lst1.length >2 && lstDanh[lstDanh.length - 1] < 60) type = 1; // là dây 
            else if(lst2.length === lstDanh.length){
                if(lstDanh.length < 4) type = 2; // là đôi hoặc là đánh lẻ
                else type = 4; // là tứ quý
            }
            else {
                // kiểm tra xem có phải 3 đôi thông hay ko
                var lst3 = this.findDoiThong(lstDanh,null);
                if(lst3.length > 0 && lst3[0].length === lstDanh.length){
                    type = 3;
                }else{
                    type = 0;// nghĩa là bài ko hợp lệ
                }
            }; 
        }
        return type;
    },
    CheckDanhBaiPlayer(lastCard,lstDanh,is3Bich){
        var type = this.kiemTraTinhHopLeCuaBoBai(lstDanh);
        var type2 = this.kiemTraTinhHopLeCuaBoBai(lastCard);
        //cc.log("Kiểm tra đánh bài",type,type2);
        // type = 0 -> không hợp lệ
        // type = 1 -> đánh dây
        // type = 2 -> đánh lẻ hoặc đánh đôi
        // type = 3 -> 3 đôi thông
        // type = 4 -> tứ quý

        if(type === 0) return false;
        else if(type === type2){
            // 
            if(lastCard[lastCard.length - 1] > lstDanh[lstDanh.length - 1] || lstDanh.length !== lastCard.length) return false;
            else return true;
        }else if(type2 === 0){
            // trường hợp bắt đầu 1 vòng đánh
            if(is3Bich && lstDanh.indexOf(12) < 0) return false;
            else return true;    
            // return true;    

        }else{
            // trường hợp type != type2 -> các trường hợp đặc biệt
            if(type == 3 && type2 == 2 && parseInt(lastCard[0]/4) == 15 && lstDanh.length == (lastCard.length * 2 + 4)) return true; /// trường hợp các đôi thông chặt 2
            else if(type == 4 && type2 == 2 && parseInt(lastCard[0]/4) == 15 && lastCard.length <= 2) return true; /// trường hợp tứ quý chặt 2
            else if(type == 3 && type2 == 4 && lstDanh.length >= 8) return true; /// trường hợp 4,5 đôi thông chặt tứ quý
            else if(type == 4 && type2 == 3 && lastCard.length == 6) return true; /// trường hợp tứ quý chặt 3 đôi thông
            else return false;
        }

        // return false;
    },
    CheckAnTrang(lst,firstTurn){
        // các trường hợp ăn trắng
        var check = null;
        for (let i = 0; i < lst.length; i++) {
            var item = lst[i];
            var findDoiThong = this.findDoiThong(item,null);
            if(findDoiThong.length === 1 && findDoiThong[0].length === 12){
                check = [i,0]; // 6 đôi thông  
                break;         
            }else if(findDoiThong.length == 1 && findDoiThong[0].length === 10 && this.findByChain(findDoiThong[0],findDoiThong[0][0]).length === 5){
                check = [i,2]; // 5 đôi thông 
                break; 
            }else{
                var findRank = this.findRank(item);
                if(findRank.length === 7){
                    var dem = 0;
                    findRank.forEach(item => {
                        if(item.lst.length == 2){
                            dem++;
                        }
                    });
                    if(dem == 6){
                        check = [i,1]; // 6 đôi 
                        break; 
                    }
                }
                var findTuQuy = this.findTuQuy(item); // tứ quý
                if(firstTurn == null && findTuQuy.length > 0 && findTuQuy[0] === 3){
                    check = [i,3]; // tứ quý 3 ván đầu
                    break;  
                }else if(findTuQuy.length > 0 && findTuQuy[findTuQuy.length -1] === 15){
                    check = [i,4]; // tứ quý 2
                    break;  
                }else if(this.findByChain(item,item[0]).length === 12){
                    check = [i,5]; // sảnh rồng 12/13 cây liên tiếp
                    break; 
                }else{
                    var baiDo = 0, baiDen = 0;
                    item.forEach(card=>{
                        if(card % 4 < 2) baiDen++;
                        else baiDo++;
                    });
                    if(baiDen > 12 || baiDo >12){
                        check = [i,6]; // đồng chất
                        break; 
                    }
                }
            }
        }

        return check;
        // return [1, 0];
    },
    findChain(lst,lastCard){ // tìm ra dây của bộ bài lớn hơn của đối thủ
        // lst bộ bài đang có
        // lastCard các lá bài đánh ra của đối thủ
        var lstDanh = [];
        var rank;
        for (let i = 0; i < lst.length - lstDanh.length; i++) {
            rank = parseInt(lst[i] / 4);
            if(rank < parseInt(lastCard[0] / 4)){
                continue;
            }
            for (let j = i; j < lst.length - 1; j++) {
                if(parseInt(lst[j] / 4) == rank){
                    if(lstDanh.length === lastCard.length - 1 && lst[j] > lastCard[lastCard.length -1]){
                        // kiểm tra lá bài cuối cùng trong dây
                        lstDanh.push(lst[j]);
                        break;
                    }
                    if(lstDanh.length < lastCard.length - 1){
                        lstDanh.push(lst[j]);
                        rank++;
                    }
                    if(rank === 15){
                        break;
                    }
                }
            }
            if(lstDanh.length === lastCard.length){
                break;
            }else{
                lstDanh = [];
            }
        }
        return lstDanh;
    },
    findRank(lst){
        // hàm tìm ra các bộ ba trong bộ bài tránh các bộ 3 là tứ quý
        //lst = [19, 28, 29, 30, 31, 32, 33, 34, 35, 45, 55, 58, 63];
        var lstBoBai = [];
        var rank = parseInt(lst[0] / 4);
        var lstRank = [];
        lst.forEach(item =>{
            if(rank < parseInt(item / 4)){
                lstBoBai.push({rank:rank,lst:lstRank});
                rank = parseInt(item / 4);
                lstRank = [item];
            }else{
                lstRank.push(item);
            }
        });
        lstBoBai.push({rank:rank,lst:lstRank});
        //cc.log(lst,lstBoBai);
        //lstBoBai = [{rank : 3, lst = []},{rank : 4, lst = []}]
        return lstBoBai;
    },
    lstCardFind(lstDanh,lstCard){
        lstDanh.forEach(item =>{
            var index = lstCard.indexOf(item);
            if(index < 0){
                cc.log("Lỗi index");
            }else{
                lstCard.splice(index,1);
            }
        });
        return lstCard; 
    },
    xetHang(lst,kq){ 
        if(lst.indexOf(63) != -1) kq += 2;
        if(lst.indexOf(62) != -1) kq += 2;
        if(lst.indexOf(61) != -1) kq += 1;
        if(lst.indexOf(60) != -1) kq += 1;
        if(lst.indexOf(12) != -1 && lst.length === 1) kq += 3; // thối 3 bích
        kq +=  this.findTuQuy(lst).length * 3;
        kq += this.findDoiThong(lst,null).length * 3;
        return kq;
    },
    DanhBai(lst,lastCard){
        var lstDanh = []; // những lá bài sẽ đánh đi
        var type = this.kiemTraTinhHopLeCuaBoBai(lastCard);
        var TuQuy = this.findTuQuy(lst); // tìm tứ quý
        var DoiThong = this.findDoiThong(lst,null); // tìm đôi thông
        if(type < 3){
            if(lastCard.length === 0){
                // nghĩa là đây bắt đầu của 1 lượt đánh mới
                // đánh bất kỳ và ko được phép bỏ lượt
                lstDanh = this.firstTurn(lst);
            }
            else if(lastCard.length === 1){
                // đánh lẻ         
                if(parseInt(lastCard[0] / 4) == 15 && (TuQuy.length > 0 || DoiThong.length > 0)){
                    // chặt 2
                    if(TuQuy.length > 0){
                        var cardType = TuQuy[0] * 4;
                        while(lstDanh.length < 4){
                            lstDanh.push(cardType);
                            cardType++;
                        }
                    }else if(DoiThong.length > 0){
                        lstDanh = DoiThong[0];
                    }
                }else{
                    // tìm các lá bài lẻ để đánh
                    var data = this.findRank(lst);
                    for(var i = 0; i < data.length; i++){
                        // tìm ra đôi nhỏ nhất và hơn rank đánh luôn
                        var Danh = data[i].lst;
                        if(Danh.length === 1 && Danh[0] > lastCard[0]){
                            // cùng số lá bài
                            // đôi phải lớn hơn đôi của người đánh trước đó
                            lstDanh = Danh;
                            break;
                        }
                    }
                    // 1/2 tỷ lệ phá bộ ra đánh
                    if(lstDanh.length === 0 && (this.Random(0,3) > 0 || lst.length < 5)){
                        if(lst[lst.length -1] > lastCard[0]){
                            var card = lst[this.Random(0,parseInt(lst.length/4))];
                            while(card < lastCard[0]){
                                card = lst[this.Random(0,lst.length)];
                            }
                            lstDanh.push(card);
                        }
                    }
                    lstDanh = this.lstDanh_TuQuy_DoiThong(lstDanh,TuQuy,DoiThong);
                }
            }else if(parseInt(lastCard[0] /4) === parseInt(lastCard[1] /4)){ 

                if(parseInt(lastCard[0] / 4) == 15 && (TuQuy.length > 0 || DoiThong.length > 0) && lastCard.length == 2){
                    // chặt đôi 2
                    if(TuQuy.length > 0){
                        var cardType = TuQuy[0] * 4;
                        while(lstDanh.length < 4){
                            lstDanh.push(cardType);
                            cardType++;
                        }
                    }else if(DoiThong.length > 0 && DoiThong[0].length >= 8){
                        lstDanh = DoiThong[0];
                    }
                }else{
                    // đánh đôi
                    var data = this.findRank(lst);
                    for(var i = 0; i < data.length; i++){
                        // tìm ra đôi nhỏ nhất và hơn rank đánh luôn
                        var Danh = data[i].lst;
                        var rank = data[i].rank - parseInt(lastCard[0] /4);
                        if(Danh.length >= lastCard.length && Danh[lastCard.length -1] > lastCard[lastCard.length -1] && rank < 5){
                            if(Danh.length > lastCard.length && (this.Random(0,3) > 0 || lst.length < 4)){
                                for (let j = 0; j < lastCard.length; j++) {
                                    lstDanh.push(Danh[j]); 
                                }
                                break;
                            }else if(Danh.length == lastCard.length){
                                lstDanh = Danh;
                                break;
                            }
                        }
                    }
                    lstDanh = this.lstDanh_TuQuy_DoiThong(lstDanh,TuQuy,DoiThong);
                }
            }
            else{
                // đánh dây
                // đánh được thì đánh
                lstDanh = this.findChain(lst,lastCard);
                lstDanh = this.lstDanh_TuQuy_DoiThong(lstDanh,TuQuy,DoiThong);
            }
        }else{
            cc.log("Trường hợp đặc biệt",type);
            if(TuQuy.length > 0){
                if((type == 3 && lastCard.length == 6) || (type == 4 && lastCard[0] < TuQuy[0] * 4)){
                    var cardType = TuQuy[0] * 4;
                    while(lstDanh.length < 4){
                        lstDanh.push(cardType);
                        cardType++;
                    }
                }
            }else if(DoiThong.length > 0){
                if((type == 3 && ((DoiThong[0].length > lastCard.length) || (DoiThong[0].length == lastCard.length && DoiThong[0][DoiThong[0].length-1] > lastCard[lastCard.length-1]))) || (type == 4 && DoiThong[0].length >= 8)){
                    lstDanh = DoiThong[0];
                }
            }
        }
        return lstDanh;
    },
    lstDanh_TuQuy_DoiThong(lstDanh,TuQuy,DoiThong){
        if(this.Random(0,5) !== 1){
            if(TuQuy.length > 0){
                for (let i = 0; i < lstDanh.length; i++) {
                    if(TuQuy.indexOf(parseInt(lstDanh[i]/4)) > 0){
                        lstDanh = [];
                        break;
                    }
                }
            }
            if(DoiThong.length > 0){
                for (let i = 0; i < lstDanh.length; i++) {
                    if(DoiThong[0].indexOf(parseInt(lstDanh[i])) > 0){
                        lstDanh = [];
                        break;
                    }
                }
            }
        }
        return lstDanh;
    },

    firstTurn(lst,value){
        if(!value){
            var rd = this.Random(0,parseInt(lst.length/3));
            value = lst[0] == 12 ? 12: lst[rd];
        }
        var lstDanh = this.findByChain(lst,value);
        if(lstDanh.length < 3 || this.Random(0,2) > 0){
            lstDanh = this.findByRank(lst,value);
            if(lstDanh.length == 4) lstDanh = [lst[0]]; // tranh danh ra phai tu quy
        }     
        return lstDanh;
    },
    findByRank(lst, value){
        var rank = parseInt(value / 4);
        var lstDanh = [];
        lst.forEach(item => {
            if(parseInt(item / 4) === rank){
                lstDanh.push(item);
            }
        });
        return lstDanh;
    },
    findByChain(lst, value){
        var rank = parseInt(value / 4);
        var lstDanh = [];
        // tìm rank nhỏ nhất mà value có
        for (let i = lst.length -1; i >= 0; i--) {
           if(parseInt(lst[i] / 4) === rank -1){
               rank--; 
            }  
        }
        lst.forEach(item => {
            if(parseInt(item / 4) == rank && rank < 15){
                if(rank == parseInt(value/4)){
                    if(item == value){
                        lstDanh.push(item);
                        rank++;
                    }
                }else{
                    lstDanh.push(item);
                    rank++;
                }
            }
        });
        return lstDanh;
    },
    suggest(lst,lastCard,value){
        var lstSuggest = [];
        var findTuQuy = this.findTuQuy(lst);
        var findDoiThong = this.findDoiThong(lst,value);
        //debugger
        if(lastCard.length === 0){
            //lstSuggest = [];
            findTuQuy.forEach(item=>{
                if(item == parseInt(value/4)){
                    lstSuggest = [item*4,item*4+1,item*4+2,item*4+3];
                }
            }); 
            findDoiThong.forEach(item=>{
                if(item.indexOf(value) > -1){
                    if(lst.length < item.length + 2){
                        lstSuggest = item;
                    }else{
                        lstSuggest = [value];
                    }
                }
            });
            if(lstSuggest.length === 0){
                var lstSuggest = this.findByRank(lst,value); // bộ đôi
                var lstChain = this.findByChain(lst,value); // dây
                if((lstSuggest.length < 2 && lstChain.length > 2) || (lstChain.length > 3 && lstSuggest.length < 3)) lstSuggest = lstChain;
                if(findTuQuy.length > 0 || findDoiThong.length > 0){
                    for (let i = 0; i < lstSuggest.length; i++) {
                        var check = false;
                        for (let j = 0; j < findTuQuy.length; j++) {
                            if(parseInt(lstSuggest[i]/4) == findTuQuy[j]){
                                check = true;
                                break;
                            }
                        }
                        for (let k = 0; k < findDoiThong.length; k++) {
                            if(findDoiThong[k].indexOf(lstSuggest[i]) > -1){
                                check = true;
                                break;
                            }
                        }
                        if(check){
                            // bài định đánh có chứa lá của các trường hợp đặc biệt
                            lstSuggest = [value];
                            break;
                        }
                    }
                }
            }
            
        }else{
            var type = this.kiemTraTinhHopLeCuaBoBai(lastCard);
            //cc.log("Kiểm tra đánh bài",type,type2);
            // type = 0 -> không hợp lệ
            // type = 1 -> đánh dây
            // type = 2 -> đánh lẻ hoặc đánh đôi
            // type = 3 -> 3 đôi thông
            // type = 4 -> tứ quý

            if(parseInt(lastCard[0] /4) === 15 && lastCard.length < 3){
                // đối phương đánh 2
                findTuQuy.forEach(item=>{
                    if(item == parseInt(value/4)){
                        lstSuggest = [item*4,item*4+1,item*4+2,item*4+3];
                    }
                });
                findDoiThong.forEach(item=>{
                    if(item.indexOf(value) > -1){
                        lstSuggest = item;
                    }
                });
            }else if(type == 3){
                if(findTuQuy.length > 0 && lastCard.length === 6){
                    // tứ quý chặn 3 đôi thông
                    findTuQuy.forEach(item=>{
                        if(item == parseInt(value/4)){
                            lstSuggest = [item*4,item*4+1,item*4+2,item*4+3];
                        }
                    }); 

                }else if(findDoiThong.length > 0){
                    // đôi thông chặn đôi thông
                    findDoiThong.forEach(item=>{
                        if(item.indexOf(value) > -1 && (item.length > lastCard.length || (item.length == lastCard.length && item[item.length -1] > lastCard[lastCard.length-1]))){
                            lstSuggest = item;
                        }

                    });
                }                     
            }else if(type == 4){
                if(findTuQuy.length > 0){
                    // tứ quý chặn tứ quý
                    findTuQuy.forEach(item=>{
                        if(item == parseInt(value/4) && item > parseInt(lastCard[0]/4)){
                            lstSuggest = [item*4,item*4+1,item*4+2,item*4+3];
                        }
                    }); 

                }else if(findDoiThong.length > 0){
                    // 4 đôi thông chặn tứ quý
                    findDoiThong.forEach(item=>{
                        if(item.indexOf(value) > -1 && item.length > 6){
                            lstSuggest = item;
                        }
                    });
                } 
            }else if(type == 2 && lastCard.length > 1){
                var findByRank = this.findByRank(lst,value);
                if(findByRank.length >= lastCard.length && findByRank[lastCard.length - 1] > lastCard[lastCard.length - 1]){
                    if(findByRank.length == lastCard.length) lstSuggest = findByRank;

                    else{
                        var index = findByRank.length -1; // lấy lá lớn nhất
                        while(lstSuggest.length < lastCard.length){                 
                        lstSuggest.push(findByRank[index]);
                        index--;
                    }
                    if(lstSuggest.indexOf(value) < 0){
                        lstSuggest.splice(lstSuggest.length-1,1,value); // chèn vào vị trí 0 value
                    }
                }      
     
     
            }
        }else if(type == 1){
            var findByChain = this.findByChain(lst,value);
            if(findByChain.length >= lastCard.length){
                var index = findByChain.indexOf(value);
                while(lstSuggest.length < lastCard.length && index >= 0){
                    lstSuggest.push(findByChain[index]);
                    index--;
                }
                index = findByChain.indexOf(value) + 1;
                while(lstSuggest.length < lastCard.length){
                    lstSuggest.push(findByChain[index]);
                    index++;
                }
                lstSuggest = this.SapXep(lstSuggest);
                index = findByChain.indexOf(lstSuggest[lstSuggest.length -1]);
                while(lstSuggest[lstSuggest.length-1] < lastCard[lastCard.length -1] && index < findByChain.length-1){
                    lstSuggest.splice(0,1);
                    lstSuggest.push(findByChain[index + 1]);
                    index++;
                }
                if(lstSuggest.indexOf(value) < 0 || lstSuggest[lstSuggest.length -1] < lastCard[lastCard.length -1]) lstSuggest = [];
            }
        }           
        }

        
        return lstSuggest;
    },
    SapXep(listCard){
        var i = 0;
        while(i < listCard.length){
            var j =  i + 1;
            while( j < listCard.length){
                if(listCard[i] > listCard[j]){
                    var value = listCard[i];
                    listCard[i] = listCard[j];
                    listCard[j] = value;
                }
                j++;
            }
            i++;
        }
        return listCard;
    },

    Random(min, max) {
        var rd = Math.floor(Math.random() * (max - min) + min);
        //cc.log(rd);
        return rd;
    },
});

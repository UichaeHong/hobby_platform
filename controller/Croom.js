const Room = require('../models/Room')
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;

// 달력 및 인풋 위한 데이터 받아오기
exports.GetData = async (req,res) =>{
    const result = await Room.find({})
    res.send({ data: result })
}

// 메인페이지(초기 데이터 삽입)
exports.GetInitData = async (req, res) => {
    const result = await Room.find({})
    res.render("main", { data: result });
};

// 방 생성
exports.MakeRoom = async (req,res)=>{
    const r = req.body
    console.log(r)
    let img_src;
    switch (r.category) {
        case "축구":
            img_src = "../static/img/soccer.jpg";
            break;
        case "야구":
            img_src = "../static/img/baseball.jpeg";
            break;
        case "농구":
            img_src = "../static/img/basketball.jpeg";
            break;
        case "배구":
            img_src = "../static/img/volleyball.jpeg";
        default:
            break;
    }

    if(r.title=='' || r.date=='' || r.location=='' || r.personnel=='' || r.price=='' || r.category=='') {
        res.send("<script>location.href='/makeRoom'; alert('제대로 입력하세요!');</script>");
    }
    else{
        await Room.create({
            src: img_src,
            title: r.title,
            date: r.date,
            location: r.location,
            personnel: r.personnel,
            price: r.price,
            category: r.category,
        }).then((result)=>{
            console.log('방정보 저장')
            res.redirect('/main')
        }).catch((error)=>{
            console.log(error)
        })
    }    
}

// 방 정보 
exports.DetailPage = async (req, res) => {
    let getId = req.params.id;
    console.log("getId:", getId);
    await Room.findOne({ _id: ObjectId(getId)}).then((result)=>{
        console.log("방정보", res);
        res.render("DetailedPage", { data: result});
    })
};


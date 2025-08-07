import express from "express";
import multer from "multer";
import cors from "cors";
import {v4 as uuidv4} from "uuid";
import {resolve, extname} from "path";

// 定番, 只改filename中的重新命名規則
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, resolve(import.meta.dirname, "public", "uploads"));
  },
  filename: function(req, file, cb){
    const ext = extname(file.originalname);
    const newName = uuidv4();
    const newPath = `${newName}${ext}`;
    cb(null, newPath);
  }
});
const upload = multer({storage: storage});

// 定番, 一定是這麼寫, 只改whiteList
const whiteList = ["http://localhost:5500", "http://127.0.0.1:5500"];
const corsOptions = {
  credentials: true,
  origin(origin, cb){
    if(!origin || whiteList.includes(origin)) return cb(null, true);
    cb(new Error("不允許傳遞資料"));
  }
};

const app = express();
app.use(express.static(resolve(import.meta.dirname, "public"))); // 設定靜態資源目錄, AKA 根目錄
app.use(cors(corsOptions)); // 全域的 midleware

app.get("/", (req, res)=>{
  res.send("首頁");
});

app.post("/upload", upload.array("files",5), (req, res)=>{
  console.log(req.files);
  
  res.json({status: "success"});
});


app.listen(3005, ()=>{
  console.log("主機啟動於 http://localhost:3005");
  
});
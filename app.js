const express = require('express');
// const bodyParser = require('body-parser');
const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
const date = require(__dirname + '/date.js');
const _ = require('lodash');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set('view engine', 'ejs');

app.use(express.static(__dirname+"/public")); //sends static elements 

const mongoose = require('mongoose');
mongoose.connect("db",{useNewUrlParser:true});

const itemSchema = new mongoose.Schema({
    name:String
})


const item = mongoose.model("item", itemSchema); 

const t1 = new item({
    name:"Welcome to your TODO list."
});
const t2 = new item({
    name:"Hit + to add a new item"
});
const t3 = new item({
    name:"x to delete an item"
});

const listSchema = new mongoose.Schema({ //List schema 
    name:String,
    items:[itemSchema]
});

const List = mongoose.model("List",listSchema);


app.get('/', function(req, res){
    


    item.find({},(err,result)=>{

        if(result.length==0){ //insert default items if no items are present
            item.insertMany([t1,t2,t3],(err)=>{   //insert many method,functions data and callback
                if(err){console.log(err);}
                else{
                    // console.log("Success");
                    res.redirect("/");
                }
                
            });
        
        }
        
        if(err){console.log(err);}
        else{
            res.render('list',{List_Title:"Today",newItem:result});
        }
    })

     //object with variable and avalue
});


app.post("/", function(req, res){
    
    const customList = req.body.btn;
    // console.log(customList);
    var itemname = (req.body.nextItem);
    // console.log(req.body);
    const newItem = new item({
        name:itemname
    });
    if (customList === "Today"){
        newItem.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:customList}, function(err, flist){
            flist.items.push(newItem);
            flist.save();
            res.redirect("/"+customList);
        })
    }
    
     //when post req is generated then redirect to home route and gets us to app .get
});



app.post("/delete", function(req, res){
    const listname = req.body.listName;
    console.log(listname);
    if (listname==="Today"){
        item.deleteOne({_id:(req.body.check).replace(/ /g, "")},(err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("Deleted successfully")
                res.redirect("/");
            }
    
        });
        
    }
    else{
        List.findOneAndUpdate({name:listname},{$pull:{items:{_id:req.body.check}}},(err,result)=>{
            if(!err){
                res.redirect("/"+listname);
            }
            else{
                console.log(err);
            }
        });
    }
})

app.get("/:customListName",function(req, res){
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name:customListName},function(err,result){
        if(!result){
            // console.log("does not exist")
            const list = new List({
                name:customListName,
                items:[t1,t2,t3]
            });
            list.save();
            res.redirect("/"+customListName);
        }
        else{
            // console.log("exixts")
            res.render("list",{List_Title:result.name,newItem:result.items})
        }
    })
    
})


app.get("/about", function(req, res){

    res.render('about');
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port,function(){
    console.log("Server has started successfully");
});


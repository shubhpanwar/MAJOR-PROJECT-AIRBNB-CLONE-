const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine" ,"ejs");
app.set("views", path.join(__dirname,"views"));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));


app.get("/" , (req,res) => {
    res.send("Hi,I am root");
});

//Index route
   app.get("/listings" , async (req,res) => {
    const allListings = await Listing.find({});
     res.render("listings/index" , {allListings});
   })
   //New Route 
   app.get("/listings/new" , (req,res) => {
    res.render("listings/new");
   })

   //Edit route
   app.get("/listings/:id/edit" , async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit" , {listing});
   });

   //Show route
   app.get("/listings/:id" , async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show" , {listing});
   })
   //Create route
   app.post("/listings" , async (req,res) => {
    let listing = req.body;
    console.log(listing);
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
   })

   //Update route
   app.put("/listings/:id" , async (req,res) => {
    let {id} = req.params;
    let listing = req.body;
    await Listing.findByIdAndUpdate(id, listing);
    res.redirect("/listings");
   })

   //Update route (POST method for form submission)
   app.post("/listings/:id/update" , async (req,res) => {
    let {id} = req.params;
    let listing = req.body;
    await Listing.findByIdAndUpdate(id, listing);
    res.redirect("/listings");
   })

   //Delete route
   app.delete("/listings/:id" , async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
   })

   //Delete route (POST method for form submission)
   app.post("/listings/:id/delete" , async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
   })


// app.get("/testlisting" ,async (req,res) => {
// let samplelisting = new Listing({
//     title : "My New Villa",
//     decription:"By the beach",
//     price:1200,
//     location:"calangute , Goa",
//     country:"India",
// });
//  await samplelisting.save();
//  console.log("sample was saved");
//  res.send("succesful testing");
// });

app.listen(8080, () => {
    console.log("Server is listening");
});
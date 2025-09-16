var express = require('express');
var router = express.Router();
const ProductModel = require('../Models/Product');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/display-product');
});
router.get('/add-product', function (req, res, next) {
  res.render('add-product', { title: 'Express' });
});
router.post('/add-product-process', function (req, res, next) {
  var ProductData = {
    pname: req.body.text1,
    pdetails: req.body.text2,
    pprice: req.body.text3
  }
  //Assign Database
  var myData = ProductModel(ProductData);
  //Save Data in DB
  myData.save()
    .then(() => {
      res.redirect('/')
    })
    .catch((err) => res.send("Error: " + err))
});
router.get('/display-product', function (req, res, next) {
  ProductModel.find()
    .then((myData) => {
      console.log(myData);
      res.render('display-product', { myData: myData })
    })
    .catch((err) => console.log(err))
});

router.get("/delete-product/:id", function (req, res, next) {
  var myid = req.params.id;
  ProductModel.findByIdAndDelete(myid)
    .then(() => res.redirect("/display-product"))
    .catch((err) => console.log(err));
});
router.get("/edit-product/:id", function (req, res, next) {
  var myid = req.params.id;
  ProductModel.findById(myid)
    .then((myData) => res.render("edit-product", { myData: myData }))
    .catch((err) => console.log(err));
});

router.post("/update-product-process/:id", function (req, res, next) {
  var myid = req.params.id;
  const updatedData = {
    pname: req.body.text1,
    pdetails: req.body.text2,
    pprice: req.body.text3
  };

  ProductModel.findByIdAndUpdate(myid, updatedData)
    .then(() => res.redirect("/display-product"))
    .catch((err) => console.log(err));
});

router.get('/file-upload', function (req, res, next) {
  res.render('file-upload-form');
});

router.post('/file-upload', function (req, res, next) {
  console.log(req.files.file123);
  var myfile = req.files.file123;
  if (myfile.size < 2000000) {
    myfile.mv('public/uploads/' + myfile.name, function (err) {
      if (err) res.send(err);
      else res.send("file upload successfully");
    })
  } else {
    res.send("your file size is " + myfile.size/1000000 +" MB" + " please select file have 2 MB");
  }

});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  var a = req.body.text1;
  req.session.uname = a;
  res.redirect('/dashboard');
});

router.get('/dashboard', function (req, res, next) {
  if (req.session.uname) {
    var a = req.session.uname;
    res.render('dashboard', { mya: a });
  }
  else {
    res.redirect('/login');
  }
});

router.get('/logout', function (req, res, next) {
  req.session.destroy(function () {
    res.redirect('/login');
  })
});

module.exports = router;

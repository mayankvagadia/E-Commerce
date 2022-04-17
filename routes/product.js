var express = require('express');
var router = express.Router();

//Call User Database Model
var ProductModel = require('../models/product_table');
var SubCategoryModel = require('../models/sub_category_table.js');
var CartModel = require('../models/cart_table');


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("ggggggggggggg");
  res.render('index', { title: 'Express', layout: false });
});

router.get('/add', function (req, res, next) {

  SubCategoryModel.find(function (err, db_product_array) {
    if (err) {
      console.log("Error in Fetch Data " + err);
    } else {
      //Print Data in Console
      console.log("product array");
      console.log(db_product_array);
      //Render User Array in HTML Table
      res.render('product/add-product', { product_array: db_product_array });
    }
  }).lean();
});

//Add Form Processing using Post Method 
router.post('/add', function (req, res, next) {
  console.log("Body :- ", req.body);
  console.log("File :- ", req.files)
  // var fileobject = req.files.product_Image;
  // var filename = req.files.product_Image.name;
  //Create an Array 
  const mybodydata = {
    product_name: req.body.product_name,
    product_details: req.body.product_details,
    product_price: req.body.product_price,
    _subcategory: req.body._subcategory
  }
  console.log("Name is " + req.body.product_name);
  console.log("ID is " + req.body._subcategory);

  var data = ProductModel(mybodydata);

  data.save(function (err) {
    if (err) {
      console.log("Error in Insert Record");
      console.log(err);
    } else {
      res.redirect('add');
      //  fileobject.mv("public/productUploads/" + filename, function(err) {
      //             if (err) throw err;
      //             // res.send("File Uploaded");

      //  });
    }
  })
});
router.get('/display', function (req, res, next) {
  ProductModel.find(function (err, db_product_array) {
    console.log(db_product_array);
    if (err) res.json({ message: 'There are no posts here.' });

    ProductModel.find({}).lean()
      .populate('_subcategory')
      .exec(function (err, db_product_array) {
        console.log(db_product_array);
        res.render("product/display-product", { mydata: db_product_array });
      })
  });
});

//Get Single User By ID
router.get('/show/:id', function (req, res) {
  console.log(req.params.id);

  ProductModel.findById(req.params.id, function (err, db_product_array) {
    if (err) {
      console.log("Error in Single Record Fetch" + err);
    } else {
      console.log(db_product_array);
      ProductModel.findById({}).lean()
        .populate('_subcategory')
        .exec(function (err, db_sub_cat_array) {
          console.log(db_sub_cat_array);
          res.render('product/show', { mydata: db_product_array, subcat_array: db_sub_cat_array });
        })
    }
  }).lean();
});

//Delete User By ID
router.get('/delete/:id', function (req, res) {
  ProductModel.findByIdAndDelete(req.params.id, function (err, project) {
    if (err) {
      console.log("Error in Record Delete " + err);
      res.redirect('/display');
    } else {
      console.log("Record Deleted ");
      res.redirect('/admin/product/display');
    }
  });
});

//Get Single User for Edit Record
router.get('/edit/:id', function (req, res) {
  console.log(req.params.id);
  ProductModel.findById(req.params.id, function (err, db_product_array) {
    if (err) {
      console.log("Edit Fetch Error " + err);
    } else {
      console.log(db_product_array);
      SubCategoryModel.find(function (err, db_subcategory_array) {
        if (err) {
          console.log(err)
        } else {
          console.log("db_subcategory_array", db_subcategory_array);
          res.render('product/edit-product', { product_array: db_product_array, subcategory_array: db_subcategory_array });
        }
      }).lean();
    }
  }).lean();
});

router.post('/edit/:id', function (req, res) {
  console.log("Edit ID is" + req.params.id);
  const imgObject = req.files



  const id = req.params.id
  if (!req.files) {
    return ProductModel.findById(id).select("product_Image").then((product) => {

      const mybodydata = {
        product_name: req.body.product_name,
        product_details: req.body.product_details,
        product_price: req.body.product_price,

        _subcategory: req.body._subcategory
      }

      ProductModel.findByIdAndUpdate(id, mybodydata).then(() => {
        res.redirect("/admin/product/display")
      }).catch(err => next(err))

    }).catch((err) => {
      next(err);
    })
  } else {
    const mybodydata = {
      product_name: req.body.product_name,
      product_details: req.body.product_details,
      product_price: req.body.product_price,
      product_Image: req.files.product_Image.name,
      _subcategory: req.body._subcategory
    }

    ProductModel.findByIdAndUpdate(id, mybodydata).then(() => {
      res.redirect("/admin/product/display")
    }).catch(err => next(err))
  }
});

//Update Record Using Post Method
// router.post('/edit/:id', function(req, res) {
//   console.log("Edit ID is"+ req.params.id);
//    var fileobject = req.files.product_Image;
//     var filename = req.files.product_Image.name;
//     // var fileobject = req.files.product_Image;
//     // var filename = req.files.product_Image.name;
//     // console.log("image of product is : ", fileobject);
//     // console.log("imagename of product is : ", filename);


// console.log("my body data isss : ", mybodydata);
//   ProductModel.findByIdAndUpdate(req.params.id, mybodydata, function(err) {
//       if (err) {
//           console.log("Error in Record Update");
//           res.redirect('/admin/product/display');
//       } else {
//         if(req.files != null && typeof req.files == 'object') {
//           if(Object.keys(req.files).length != 0) // if user select file
//           {
//              var random = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
//              const image_name = random+file.name;
//              file.mv('public/upload/'+image_name, function(err){
//                  if (err)
//                  {
//                      return res.status(500).send(err);
//                  }
//              });
//              update_coupon.image = image_name;
//              console.log("if image_name is : ", image_name);
//          }
//          else
//          {

//              update_coupon.image = req.body.product_Image;  // if user didnot select file
//              console.log("else image_name is : ", image_name);
//              res.redirect('/admin/product/display');
//          }
//         }

//             // fileobject.mv("public/productUploads/" + filename, function(err) {
//             //         if (err) throw err;
//             //         // res.send("File Uploaded");
//             //     res.redirect('/admin/product/display');
//             //  });
//       }
//   });
// });


// router.get('/add-cart', function(req, res, next) {

//   CartModel.find(function(err, db_cart_array) {
//       if (err) {
//           console.log("Error in Fetch Data " + err);
//         } else {
//           //Print Data in Console
//           console.log("product array");
//           console.log(db_cart_array);
//           //Render User Array in HTML Table
//           res.render('cart/add', { cart_array : db_cart_array });
//         }
//     }).lean();
// });

router.get('/add-cart/:id', function (req, res) {
  console.log(req.params.id);
  ProductModel.findById(req.params.id, function (err, db_cart_array) {
    if (err) {
      console.log("Edit Fetch Error " + err);
    } else {
      console.log(db_cart_array);
      res.render('cart/add', { product_array: db_cart_array });
    }
  }).lean();
});

router.post('/add-cart', function (req, res) {
  console.log(req.body);
  // var fileobject = req.files.product_Image;
  // var filename = req.files.product_Image.name;
  //Create an Array 
  const mybodydata = {
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    // product_Image: filename
  }
  console.log("Name is " + req.body.product_name);
  // console.log("Image Name is "  + req.body.product_Image);

  var data = CartModel(mybodydata);

  data.save(function (err) {
    if (err) {
      console.log("Error in Insert Record");
    } else {
      res.redirect('display');
      //  fileobject.mv("public/cartUploads/" + filename, function(err) {
      //             if (err) throw err;
      //             // res.send("File Uploaded");
      //           res.redirect('add');
      //  });
    }
  })
});

router.get('/display-cart', function (req, res, next) {
  CartModel.find(function (err, db_cart_array) {
    console.log(db_cart_array);
    if (err) res.json({ message: 'There are no posts here.' });

    CartModel.find({}).lean()
      .populate('_user')
      .exec(function (err, db_cart_array) {
        console.log(db_cart_array);
        res.render("cart/display-cart", { mydata: db_cart_array });
      })
  });
});

router.get('/deletecart/:id', function (req, res) {
  CartModel.findByIdAndDelete(req.params.id, function (err, project) {
    if (err) {
      console.log("Error in Record Delete " + err);
      res.redirect('/display');
    } else {
      console.log("Record Deleted ");
      res.redirect('/product/display-cart');
    }
  });
});

module.exports = router;
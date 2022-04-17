var express = require('express');
var router = express.Router();

//Call User Database Model
var CategoryModel = require('../models/category_table');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/add', function(req, res, next) {
  res.render('category/add-category');
});


//Add Form Processing using Post Method 
router.post('/add', async function(req, res, next) {
  console.log(req.body);

  //Create an Array 
  const mybodydata = {
    category_name: req.body.category_name
    
   
}
try {
  var data = CategoryModel(mybodydata);
const category = await data.save() 
console.log(category);
res.render('category/add-category');
} catch (error) {
  next(error);
}
// data.save(function(err) {
//     if (err) {
//        console.log("Error in Insert Record");
//     } else {
//         
//     }
// })

});

router.get('/display', function(req, res, next) {
    CategoryModel.find(function(err, db_users_array) {
    if (err) {
        console.log("Error in Fetch Data " + err);
      } else {
        //Print Data in Console
        console.log(db_users_array);
        //Render User Array in HTML Table
        res.render('category/display-category', { mydata: db_users_array });
      }
  }).lean();
});


//Get Single User By ID
router.get('/show/:id', function(req, res) {
  console.log(req.params.id);
  CategoryModel.findById(req.params.id, function(err, db_categor_array) {
      if (err) {
          console.log("Error in Single Record Fetch" + err);
      } else {
          console.log(db_categor_array);

          res.render('category/single-category-record', { category_array: db_categor_array });
      }
  });
});



//Delete User By ID
router.get('/delete/:id', function(req, res) {
    console.log("hiii");
  //var deleteid = req.params.id;
    CategoryModel.findByIdAndDelete(req.params.id, function(err, project) {
      if (err) {
        console.log("Error in Record Delete " + err);
          res.redirect('/admin/category/display');
      } else {
        console.log(" Record Deleted ");
          res.redirect('/admin/category/display');
      }
  });
});



//Get Single User for Edit Record
router.get('/edit/:id', function(req, res) {
  console.log("edit id is : ",req.params.id);
  CategoryModel.findById(req.params.id, function(err, db_category_array) {
      if (err) {
          console.log("Edit Fetch Error " + err);
      } else {
          console.log(db_category_array);
          res.render('category/edit-category', { category_array: db_category_array });
      }
  }).lean();
});


//Update Record Using Post Method
router.post('/edit/:id', function(req, res) {

  console.log("Edit ID is"+ req.params.id);

  const mybodydata = {
    category_name: req.body.category_name 
  }

  CategoryModel.findByIdAndUpdate(req.params.id, mybodydata, function(err) {
      if (err) {
          console.log("Error in Record Update");
          res.redirect('/admin/category/display-category');
      } else {
        
          res.redirect('/admin/category/display');
      }
  });
});


module.exports = router;
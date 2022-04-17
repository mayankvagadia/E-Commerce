$(document).ready(function () {

    $("#form").validate({
      errorClass: 'validation_errors',
      debug: false,
      rules: {
        name: {
          required: true,
          alphabate : true
        },
        password: {
          required: true,
          minlength: 7
        },
        mobile:
        {
          required: true,
          minlength: 10,
          remote: {
            url: "/admin/validate/mobile",
            type: "post",
            async: false,
          }
        },
        email: {
          required: true,
          email: true,
          remote: {
            url: "/admin/validate/email",
            type: "post",
            async: false,
          }

        },
      },
      errorPlacement: function (error, element) {
          console.log('dd', element.attr("name"))
          if (element.attr("name") == "mobile") {
              error.appendTo(".jqueryMobileErr");
          } else if(element.attr("name") == "name"){
              error.appendTo(".jqueryNameErr");
          }else if(element.attr("name") == "email"){
              error.appendTo(".jqueryEmailErr");
          }else if(element.attr("name") == "password"){
              error.appendTo(".jqueryPasswordErr");
          }
      },
      messages: {
        name: {
          required: "Please enter a name.",
          alphabate : "Please enter only charactor."
        },
        mobile: {
          required: "Please enter the Mobile No.",
          remote: "Mobile is already in use.",
          errorElement: 'div',
          errorLabelContainer: '.mobile'
        },
        password: {
          required: "Please enter a password",
          minlength: "Your Password must contain atleast 7 character."
        },
        email: {
          required: "Please enter a valid email address",
          remote: "Email is already in use.",
          errorElement: 'div',
          errorLabelContainer: '.email'
        },

      },

    });
})

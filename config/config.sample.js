module.exports = {
  site_title: "maxy-media",
  datasource: {
    "username": 'maxy-media',
    "password": 'maxy-media',
    "database": 'maxy-media', // set name of centaral database
    //"host": "127.0.0.1",
    "host": "mongodb",
    "port": "27017",
    "root_user": "admin",
    "root_password": "admin"
  },
  do_not_sell_lead_degreezen:["", "", ""],
  blueshift : {
    username : "",
    password : "",
    testMode : true
  },
  ignoreFieldsInBlueshift : ["transactionId"],
  ignoreFieldsInLeadprosper: [],
  main_image_dir: "../public/uploads",
  dir_constants: {
    avatar: "/avatar/",
  },
  cookie: {
    "secret": "session",
    "key": "abhH4re5Uf4Rd0KnddS05f3V"
  },
  session: {
    secret: "abhH4re5Uf4Rd0KnddS05f3V",
    resave: true,
    saveUninitialized: true,
    maxAge: Date.now() + (30 * 86400 * 1000)
  },
  super_password: "123456",
  timezone: 'UTC',
  default_time_zone: '-06:00', // CST or CDT

  flashMessages: {
    "001": "Search Filter Fields",
    "002": "Internal server error",
    "003": "Lead data saved successfully",
  },
  all_scheduler: "on",
  schedulers: {
    example: {
      time: '1 * * * * *',
      file: 'example.js',
      active: true
    },
    store_lead: {
      time: '* * * * *',
      file: 'store_lead.js',
      active: true
    },
  },
  tiktok : {
    app_id : "",
    secret : "",
    access_token : ""
  },
  sources : {
    degreezen : {
      lp_supplier_id : "",
      lp_key : "",
      lp_campaign_id: "",
      testMode : true
    },
    loanjam : {
      lp_supplier_id : "",
      lp_key : "",
      lp_campaign_id: "",
      testMode : true
    }
  }

}

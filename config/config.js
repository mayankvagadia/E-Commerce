module.exports = {
  site_title: "adminTheme",
  datasource: {
    "username": 'e_commerence',
    "password": 'e_commeence',
    "database": 'e_commeence', // set name of centaral database
    "host": "127.0.0.1",
    //"host": "mongodb",
    // "host" : "https://6a1b-2409-4041-2e94-a37b-7804-2719-bb29-cc2b.ngrok.io",
    "port": "27017",
    "root_user": "admin",
    "root_password": "admin",
  },
  db: {
    "connection": "mongodb://127.0.0.1",
    "name": "testdb"
  },
  ignoreFieldsInBlueshift: ["transactionId"],
  ignoreFieldsInLeadprosper: ["transactionId"],
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
    // maxAge: Date.now() + (30 * 86400 * 1000)
  },
  super_password: "123456",
  timezone: 'UTC',
  default_time_zone: '-06:00', // CST or CDT

  all_scheduler: "off",
  schedulers: {
    // example: {
    //   time: '1 * * * * *',
    //   file: 'example.js',
    //   active: true
    // },
    store_lead: {
      time: '* * * * *',
      file: 'store_lead.js',
      active: true
    },
    // remove_leads: {
    //   time: '* * * * * *',
    //   file: 'remove_leads.js',
    //   active: true
    // },
  }

}
  // loanjam : {
  //   lp_campaign_id: "5720",
  //   lp_supplier_id: "11436",
  //   lp_key: "37myuvlob10y",
  //   testMode : true,
  // }
const crawler = require("../specs/crawler.spec");
const fs = require("fs");

var mysql = require("mysql");

var con = mysql.createConnection({
  host: "192.168.111.212",
  user: "root",
  password: "pass@123",
  database: "tpb_broker_migrated_qa"
});

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "dummDB"
// });

con.connect(function(err) {
  if (err) console.log(err);
  console.log("Connected!");
  {
    if (err) console.log(err);
    // console.log(result);
  }
  });

async function insertDriver(currentDate, cid, driver_Data) {
  console.log("driver_CID************************************", cid);
  // var bindings = {
  // systemDate: currentDate,
  // firstname: driver_Data.driver_value2,
  // lastname: driver_Data.driver_value3,
  // licensenumber: driver_Data.driver_value4,
  // expirationdate: driver_Data.driveractualexpdate,
  // isactive: driver_Data.driver_value1,
  // transportationid: cid
  // };

  // console.log(bindings);

  var sql =
    "INSERT INTO driver (isdeleted, createddate, firstname, lastname, licensenumber, expirationdate,transportationid, corporateaccountid, " +
    "isactive)VALUES(0,str_to_date('" +
    currentDate +
    "','%m/%d/%Y'),'" +
    driver_Data.driver_value2 +
    "'," +
    "'" +
    driver_Data.driver_value3 +
    "'," +
    "'" +
    driver_Data.driver_value4 +
    "', str_to_date('" +
    driver_Data.driveractualexpdate +
    "','%m/%d/%Y')," +
    cid +
    ",'1'," +
    driver_Data.driver_value1 +
    " )";

  fs.appendFileSync("DriverLOGS.txt", JSON.stringify(sql));

  con.query(sql, function(err, result) {
    if (err) {
      fs.appendFileSync(
        "executeDriverLogsBindingserrr.txt",
        JSON.stringify(err)
      );
    }
    // console.log("DB result", result);
    // fs.appendFileSync("cid.txt",JSON.stringify(cid));
    // fs.appendFileSync("DriverLOGS.txt", JSON.stringify(sql));
    // fs.appendFileSync("executeDriverLogs2.txt", JSON.stringify(bindings));
  });
  fs.appendFileSync("DriverLOGSAfterEXEC.txt", JSON.stringify(sql));
  // await executeDriverQuery(sql);
}

async function insertVehicle(currentDate, cid, vehicle_Data) {
  var bindings = {
    systemDate: currentDate,
    isactive: vehicle_Data.vehicle_value1,
    vehicletype: vehicle_Data.vehicle_value2,
    vehiclenumber:
      vehicle_Data.vehicle_value3 + " " + vehicle_Data.vehicle_value4,
    licenseplatenumber: vehicle_Data.vehicle_value5,
    expirationdate: vehicle_Data.vehiclerawexpdate,
    transportationid: cid
  };
  console.log("vehcile************************************", cid);
  await executeVehicleQuery(bindings);
}

async function getCredentials(callback) {
  var sql =
    "select  tba.CorporateAccountId as accountid, tba.TransportBaseId as companyid, tba.username, tba.password from tpb_broker_migrated_qa.transportbaseaccount as tba join tpb_broker_migrated_qa.organization as oc On tba.corporateaccountid = oc.id where Trim(LOWER(oc.name)) = 'mas' && (username != '' && password != '')";
  con.query(sql, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log(result);
    fs.appendFileSync("getCredentialLogs.txt", JSON.stringify(result));
    callback(err, result);
  });
}

async function executeVehicleQuery(bindings) {
  var sql =
    "INSERT INTO vehicle (isdeleted, createddate, licenseplatenumber ,expirationdate ,vehiclenumber ,isactive ,transportationid ,corporateaccountid)" +
    "VALUES ( 0,str_to_date('" +
    bindings.systemDate +
    "','%m/%d/%Y'),'" +
    bindings.licenseplatenumber +
    "', str_to_date('" +
    bindings.expirationdate +
    "','%m/%d/%Y')," +
    "'" +
    bindings.vehiclenumber +
    "'," +
    bindings.isactive +
    ",'" +
    bindings.transportationid +
    "','1')";
  console.log(sql);
  con.query(sql, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("DB result", result);
    fs.appendFileSync("executeVehicleLogs.txt", JSON.stringify(sql));
    fs.appendFileSync(
      "executeVehicleLogsBindings.txt",
      JSON.stringify(bindings.transportationid)
    );
  });
}

async function executeDriverQuery(sql) {
  fs.appendFileSync("executeDriverLogsBindings.txt", JSON.stringify(sql));
  var sql =
    "INSERT INTO driver (isdeleted, createddate, firstname, lastname, licensenumber, expirationdate,transportationid, corporateaccountid, " +
    "isactive)VALUES(0,str_to_date('" +
    bindings.systemDate +
    "','%m/%d/%Y'),'" +
    bindings.firstname +
    "'," +
    "'" +
    bindings.lastname +
    "'," +
    "'" +
    bindings.licensenumber +
    "', str_to_date('" +
    bindings.expirationdate +
    "','%m/%d/%Y'),'" +
    bindings.transportationid +
    "','1'," +
    bindings.isactive +
    " )";
  console.log(sql);
  con.query(sql, function(err, result) {
    if (err) {
      fs.appendFileSync(
        "executeDriverLogsBindingserrr.txt",
        JSON.stringify(err)
      );
    }
    console.log("DB result", result);
    // fs.appendFileSync("executeDriverLogs.txt", JSON.stringify(sql));
    // fs.appendFileSync("executeDriverLogs2.txt", JSON.stringify(bindings));
  });
}

module.exports = {
  insertDriver,
  executeDriverQuery,
  insertVehicle,
  executeVehicleQuery,
  getCredentials
};

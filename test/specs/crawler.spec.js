const assert = require("assert");
const driver = require("../Database/ tpbDB");
const fs = require("fs");
let credentialsInArray;

describe("Crawler", () => {
  browser.call(async () => {
    await driver.getCredentials(function(err, result) {
      if (err) {
        console.log(err);
      }
      credentialsInArray = result;
      console.log("array length", result.length);
    });
  });

  it("should fetched data properly like selenium", () => {
    browser.url("https://www.medanswering.com/login.taf?_function=check");
    let kk = 0;
    loopStart(kk);
    function loopStart(kk) {
      let ij;
      for (ij = kk; ij <= credentialsInArray.length; ij++) {
        console.log(
          "********************************************************************************************",
          credentialsInArray[ij].companyid
        );
        // fs.appendFileSync(
        //   "executeDriverLogsBindings.txt",
        //   JSON.stringify(credentialsInArray[ij].companyid)
        // );
        browser.$("#userName").setValue(credentialsInArray[ij].username);
        browser.$(`#password`).setValue(credentialsInArray[ij].password);
        browser.$('[name="eulaAgree"]').click();
        browser.$("#sub").click();
        browser.pause(3000);
        if (browser.$("#error").isDisplayed()) {
          browser.$('[name="eulaAgree"]').click();
          loopStart(++ij);
        }

        browser.$("*=ViewTransportation Provider Profile").click();
        browser.pause(3000);

        var i;
        for (i = 2; i <= 20; i++) {
          browser
            .$(
              "body > center > table > tbody > tr:nth-child(" +
                i +
                ") > td:nth-child(1) > a"
            )
            .click();

          //Getting Data from Driver Table
          var strdata_Raw_Driver = browser
            .$(
              "body > center > p:nth-child(7) > table > tbody > tr > td:nth-child(1)"
            )
            .getText();
          // console.log("\033[2J");
          var str_split_Driver = strdata_Raw_Driver.split("Edit ");
          var str_split_Driver_length = str_split_Driver.length;

          for (j = 1; j < str_split_Driver_length; j++) {
            function splittedData_Driver() {
              var splitted_data_driver = str_split_Driver[j].split(" ");
              var driver_data = {
                driver_value1: splitted_data_driver[0],
                driver_value2: splitted_data_driver[1],
                driver_value3: splitted_data_driver[2],
                driver_value4: splitted_data_driver[3],
                driver_value5: splitted_data_driver[4]
              };
              var driverrawexpdate = new Date(driver_data.driver_value5);
              var currentDate1 =
                driverrawexpdate.getMonth() +
                1 +
                "/" +
                driverrawexpdate.getDate() +
                "/" +
                driverrawexpdate.getFullYear();
              driver_data.driveractualexpdate = currentDate1;
              // console.log("ashish", currentDate1);

              if (driver_data.driver_value1 === "Active") {
                driver_data.driver_value1 = 1;
              } else {
                driver_data.driver_value1 = 0;
              }

              return driver_data;
            }
            browser.call(async () => {
              var today = new Date();
              var currentDate =
                today.getMonth() +
                1 +
                "/" +
                today.getDate() +
                "/" +
                today.getFullYear();
              await driver.insertDriver(
                currentDate,
                credentialsInArray[ij].companyid,
                splittedData_Driver()
              );
            });
          }

          //Getting Data from Vehicle Table
          var strdata_Raw_Vehicle = browser
            .$(
              "body > center > p:nth-child(7) > table > tbody > tr > td:nth-child(2)"
            )
            .getText();
          console.log("\033[2J");
          var str_split_Vehicle = strdata_Raw_Vehicle.split("Edit ");
          var str_split_Vehicle_length = str_split_Vehicle.length;

          for (k = 1; k < str_split_Vehicle_length; k++) {
            function splittedData_Vehicle() {
              var splitted_data_vehicle = str_split_Vehicle[k].split(" ");
              var vehicle_data = {
                vehicle_value1: splitted_data_vehicle[0],
                vehicle_value2: splitted_data_vehicle[1],
                vehicle_value3: splitted_data_vehicle[2],
                vehicle_value4: splitted_data_vehicle[3],
                vehicle_value5: splitted_data_vehicle[4],
                vehicle_value6: splitted_data_vehicle[5]
              };
              var vehiclerawexpdate = new Date(vehicle_data.vehicle_value6);
              var currentDate2 =
                vehiclerawexpdate.getMonth() +
                1 +
                "/" +
                vehiclerawexpdate.getDate() +
                "/" +
                vehiclerawexpdate.getFullYear();
              vehicle_data.vehiclerawexpdate = currentDate2;
              // console.log("prashant", currentDate2);

              if (vehicle_data.vehicle_value1 === "Active") {
                vehicle_data.vehicle_value1 = 1;
              } else {
                vehicle_data.vehicle_value1 = 0;
              }
              return vehicle_data;
            }
            browser.call(async () => {
              var today = new Date();
              var currentDate =
                today.getMonth() +
                1 +
                "/" +
                today.getDate() +
                "/" +
                today.getFullYear();
              console.log(
                "131324124124***************************************",
                credentialsInArray[ij].companyid
              );
              console.log(currentDate);
              await driver.insertVehicle(
                currentDate,
                credentialsInArray[ij].companyid,
                splittedData_Vehicle()
              );
            });
          }
          browser.back();
        }
        browser.$("*=Logout").click();
        browser.url("https://www.medanswering.com/login.taf?_function=check");
      }
    }
  });
});

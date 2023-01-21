/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//

var token = "90932363|-31949271683288482|90953920";
var database = "COLLEGE-DB";
var relation = "PROJECT-TABLE";
var baseUrl = "http://api.login2explore.com:5577";
var imlUrl = "/api/iml";
var irlUrl = "/api/irl";


$("#roll_no").focus();
$("#save").prop("disabled", true);
$("#change").prop("disabled", true);
$("#reset").prop("disabled", true);

//
function resetForm() {
    $("#std_name").val("")
    $("#std_class").val("")
    $("#std_bod").val("");
    $("#std_enrollment_date").val("");
    $("#std_addr").val("");
    $("#roll_no").val("");
    $("#roll_no").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true)
    $("#roll_no").focus();
}


//validateion of data 
function validateAndGetFormData() {
    var roll_no = $("#roll_no").val();
    if (roll_no === "") {
        $("#rollNoMsg").html("Roll number is required !!");
        $("#roll_no").focus();
        return "";
    } else {
        $("#rollNoMsg").html("");
    }

    var std_name = $("#std_name").val();
    if (std_name === "") {
        $("#nameMsg").html("Student name is required !!");
        $("#std_name").focus();
        return "";
    } else {
        $("#nameMsg").html("");
    }

    var std_class = $("#std_class").val();
    if (std_class === "Select the class" || std_class === null) {
        $("#classMsg").html("Please select the class !!");
        $("#std_class").focus();
        return "";
    } else {
        $("#classMsg").html("");
    }

    var std_bod = $("#std_bod").val();
    if (std_bod === "") {
        $("#bodMsg").html("Birth of date is required !!");
        $("#std_bod").focus();
        return "";
    } else {
        $("#bodMsg").html("");
    }

    var std_enrollment_date = $("#std_enrollment_date").val();
    if (std_enrollment_date === "") {
        $("#enMsg").html("Enrollment date is required !!");
        $("#std_enrollment_date").focus();
        return "";
    } else {
        $("#enMsg").html("");
    }

    var std_addr = $("#std_addr").val();
    if (std_addr === "") {
        $("#addrMsg").html("Address is required !!");
        $("#std_addr").focus();
        return "";
    } else {
        $("#addrMsg").html("");
    }
    //create the json object
    var jsonStrObj = {
        rollNo: roll_no,
        studentName: std_name,
        studentClass: std_class,
        studentBod: std_bod,
        studentEnrollmentDate: std_enrollment_date,
        studentAddress: std_addr
    };

    return JSON.stringify(jsonStrObj);
}


//save the roll number into localsetion
function rollNumberSave2SS(jsonObj) {
    var object = JSON.parse(jsonObj.data).record;
    localStorage.setItem("rollNO", object.rollNo);
}


//roll number put on the json object
function getJsonObjectofRollNo() {
    var roll_no = $("#roll_no").val();
    var obj = {
        rollNo: roll_no
    }
    return JSON.stringify(obj);
}


//check the student allready exist or not
function getStudent() {
    var stdroll = getJsonObjectofRollNo();
    var getReq = createGET_BY_KEYRequest(token, database, relation, stdroll);
    jQuery.ajaxSetup({async: false});
    var jsonresponce = executeCommandAtGivenBaseUrl(getReq, "http://api.login2explore.com:5577", "/api/irl")
    jQuery.ajaxSetup({async: true});
    if (jsonresponce.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#std_name").focus();
    } else if (jsonresponce.status === 200) {
        $("#roll_no").prop("disabled", true);
        fillData(jsonresponce);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#std_name").focus();
    }
}

//fill the input field
function fillData(jsonObj) {
    //firstly save the roll number into session storage
    rollNumberSave2SS(jsonObj);
    var objData = JSON.parse(jsonObj.data).record;
    //set the value into fields
    $("#std_name").val(objData.studentName)
    $("#std_class").val(objData.studentClass)
    $("#std_bod").val(objData.studentBod);
    $("#std_enrollment_date").val(objData.studentEnrollmentDate);
    $("#std_addr").val(objData.studentAddress);
}

//save new student record here
function saveStudent() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }
    var putReqStr = createSETRequest(token, jsonStr, database, relation);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr, baseUrl, imlUrl+"/set");
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#save").prop("disabled",true)
    $("#reset").prop("disabled",true)
    $("#roll_no").focus();
    if(resultObj.status === 200)
        alert("New student information is saved.")
    else if(resultObj.status === 400)
        alert("Oops, Something went wrong...")
}


//create the set request for primary key
function createSETRequest(token, jsonStr, database, relation) {
    // This method is used to create PUT Json request.
    var setRequest = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + database
            + "\", \"cmd\" : \"SET\",\n"
            + "\"type\" : \"PUT\",\n"
            + "\"primaryKey\" : \"rollNo\",\n"
            + "\"rel\" : \""
            + relation + "\","
            + "\"jsonStr\": \n"
            + jsonStr
            + "\n"
            + "}";
    return setRequest;
}

//update button action here
function changeData() {
    $("#change").prop("disabled", true);
    var jsonstr = validateAndGetFormData();
    if (jsonstr === "") {
        return;
    }
    var updateReq = createUPDATERecordRequest(token, jsonstr, database, relation, localStorage.getItem("rollNO"));
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(updateReq, baseUrl, imlUrl);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#reset").prop("disabled",true)
    $("#roll_no").focus();
    
    if(resultObj.status === 200)
        alert("student information is updated.");
    else if(resultObj.status === 400)
        alert("Oops, Something went wrong...");

}
import React, { Component } from "react";
import myFirebase from "./myFirebaseConfig";
import Firebase from "firebase";

import icon_ED from "./icon-e.png";
import icon_DEL from "./icon-b.png";
import cheeseImage1 from "./lotsOfCheese.jpg";
import ReactTooltip from "react-tooltip";
import CheeseForm from "./CheeseForm";
import { usersArray } from "./users";
const usersLoginArray = usersArray;
// this is duplication - I will remove when I've time

// this is the main form in the app
// dropdowns are dynamically filled

const custArr = ["-", "ALD", "DNS", "SVU", "TSC", "LDL", "385"];

function getOfflineArrayNoNull(identifier) {
  var object = localStorage.getItem(identifier);
  //// console.log("ID:"+ identifier + "; OBJ:"+ object);
  if (object === null) {
    object = [];
  } else {
    object = JSON.parse(object);
  }
  return object;
}

function getLen_noNull(object) {
  if (object == null) {
    return 0;
  } else {
    return object.length;
  }
}

function getOfflineNoNull(identifier) {
  var item = localStorage.getItem(identifier);
  if (item === null) {
    item = 0;
  }
  return item;
}

//  for login email match:
function getIndex(value, array, prop) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][prop] === value) {
      return i;
    }
  }
  return -1; // if value doesn't exist
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortCol: "gradeID",
      sortAsc: 1,
      curLogin: -1,
      email: "",
      username: "",
      password: "",
      currentPage: 0,
      editingGrade: false,
      fv0: 0,
      fv1: "",
      fv2: "",
      fv3: "",
      fv4: "",
      fv5: "",
      fv6: "",
      fv7: "",
      fv8: "",
      fv9: "",
      fv10: "",
      fv11: "",
      fv12: "",
      fv13: "",
      fv14: "",
      fv15: "",
      fv16: "",
      fv17: "",
      fv18: "",
      fv19: "",
      fv20: "",
      formData: "",
      graderID: 0,
      simulateOffline: false,
      allowSimulateOffline: true,
      authenticated: false,
      currentUser: null,
      message: ""
    };

    //console.clear();

    this.buttonEditGrade = this.buttonEditGrade.bind(this);
    this.buttonGoNewGrade = this.buttonGoNewGrade.bind(this);
    this.callbackShowGradesOL = this.callbackShowGradesOL.bind(this);

    this.mainMenuButton = this.mainMenuButton.bind(this);

    this.updateDD_GID = this.updateDD_GID.bind(this);
    this.updateTB = this.updateTB.bind(this);

    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.sendEdits = this.sendEdits.bind(this);
    this.callbackGoOnline = this.callbackGoOnline.bind(this);
  } // end constructor

  componentDidMount() {
    Firebase.auth().onAuthStateChanged((user) => {
      var un;
      if (user !== null) {
        // // console.log("USER:" + user.email);
        un = getIndex(user.email, usersLoginArray, "email");

        // this just safeguards an index error on the array:
        // shouldn't happen anyway
        if (un < 0) {
          un = 0;
        }
        this.setState(() => ({
          authenticated: true,
          currentUser: user,
          curLogin: un,
          graderID: un
        }));
        // // console.log("LOGIn:" + user.email);
        // // console.log(un);
      } else {
        this.setState(() => ({
          authenticated: false,
          currentUser: null,
          curLogin: -1,
          graderID: -1
        }));
      }
    });
  }

  // ########################################################
  // CALL BACK FUNCTIONS

  callbackGoMMPage = (page) => {
    this.setState({
      currentPage: page
    });
  };
  // / /
  callbackShowgrades = (page) => {
    this.setState({
      currentPage: page
    });
  };

  callbackGoEditOrDelete_2 = (data, editOrDelete) => {
    // editOrDelete -> 0 = edit -1 = delete
    //// // console.log(data);
    // console.log("MC3:" + data);
    this.setState({
      //formData: data,
      //editOrDelete: editOrDelete,
      //currentPage: 5
    });
  };

  // IMPORTANT:
  // THE FOLLOWING DEALS WITH CHEESEFORM SUBMIT ...

  callbackGoEditOrDelete = (data, graderID, editOrDelete) => {
    // editOrDelete -> 0 = edit -1 = delete
    //// console.log(data);
    var testArray = [];
    testArray.push(data);
    if (editOrDelete === -1) {
      // console.log("DEl:CONF2:" + data + "; GID=" + graderID);
    } else {
      // console.log("ED:-" + data.description);
    }
    // CURRENT PAGE = 5, SENDFORM COMPONENT
    this.setState({
      formData: data,
      fv1: graderID,
      editOrDelete: editOrDelete,
      currentPage: 5
    });
  };

  callbackSortCols = (sortCol, sortAsc) => {
    this.setState({ sortCol: sortCol, sortAsc: sortAsc });
  };

  callbackIsOffline = (tof) => {
    this.setState({ isOffline: tof });
  };

  callbackEditRecord = (data) => {
    //// console.log(data);

    // console.log("CB2:" + data.description + " ; ");

    let customerNo = data.customer;

    //if ((customerNo>=0) &&
    //(customerNo<=custArr.length)) {
    const customer = custArr[customerNo];

    this.setState({
      fv0: data.gradeID,
      fv1: data.graderID,
      fv2: data.description,
      fv3: data.gradeDate,
      fv4: data.actionMonth,
      fv5: customer,
      fv6: data.texture,
      fv7: data.general,
      fv8: data.flavour,
      fv9: data.functionality,
      fv10: data.grade,
      fv11: data.store,
      fv12: data.manufLotNo,
      fv13: data.milkOrigin,
      fv14: data.product,
      fv15: data.rennetOrigin,
      fv16: data.rennetType,
      fv17: data.reserveUntil,
      fv18: data.saltOrigin,
      fv19: data.saltCultureOrigin,
      fv20: data.comment,
      editingGrade: true,
      currentPage: 2
    });
  }; // callback - EDIT record

  updateDD_GID(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
      currentPage: 0
    });
  }
  callbackGoOnline = () => {
    this.setState({
      currentPage: 8
    });
  };

  callbackShowGradesOL = () => {
    this.setState({
      currentPage: 1
    });
  };

  callbackSendOfflines = () => {
    this.setState({
      currentPage: 8
    });
  };

  callbackDeleteRecord = (id, graderID) => {
    //// console.log(data);

    // console.log("DELETE, TBC:" + id + " ; " + graderID);

    this.setState({
      fv0: id,
      fv1: graderID,
      currentPage: 6
    });
  };

  scramble(st) {
    // this is a placeholder function for a more complex algorithm
    var len = st.length;
    var i, n;
    var outStr = "";
    for (i = 0; i < len; i++) {
      n = 155 - st.charCodeAt(i);
      if (n < 0) {
        n = 255 + n;
      }
      outStr = String.fromCharCode(n) + outStr;
    }
    return outStr;
  }

  logIn(event) {
    //when user submits, it takes the state email and password and
    // sends to firebase auth and signin functions
    event.preventDefault(); //stop default behaviour and allow our error checking
    const { email, password } = this.state;
    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        // once successfully authenticated set state in the Parent
        // for the authenticated variable.
        // console.log("User logged on");
      })
      .catch((error) => {
        //if error occurs, push to error state
        this.setState({ loginMessage: error.message });
        //'No Internet and no log-in saved. You must stay logged in if you wish to work offline.' });
      });
  }

  logOut() {
    Firebase.auth().signOut();
    this.setState({ username: "", curLogin: -1 });
  }

  buttonEditGrade() {
    this.setState({ fv2: "2020-10-01", fv3: "4", fv4: "ALD", fv19: "HAAAAAA" });
    this.setState({ currentPage: 2 });
    // console.log("EG");
  }

  buttonGoNewGrade() {
    var graderID = this.state.graderID;
    // console.log("GNG:" + graderID);
    this.setState({
      fv0: 0,
      fv1: graderID,
      fv2: "",
      fv3: "",
      fv4: "",
      fv5: "",
      fv6: "",
      fv7: "",
      fv8: "",
      fv9: "",
      fv10: "",
      fv11: "",
      fv12: "",
      fv13: "",
      fv14: "",
      fv15: "",
      fv16: "",
      fv17: "",
      fv18: "",
      fv19: "",
      fv20: "",
      editingGrade: false
    });

    this.setState({ currentPage: 2 });
  }

  updateTB(event) {
    const target = event.target;
    var value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
    // console.log("UPDATETB:" + value);
  }

  sendEdits(message, fromPg8) {
    // check if unsent records exist

    var offlineForms = getOfflineArrayNoNull("offlineForms");
    var goToPage;
    // offlineForms.length

    ////
    var offlineDeletes = getOfflineArrayNoNull("offlineDeletes");

    // console.log("Offline forms to be sent: " + offlineForms.length);
    // console.log("Offline- forms to be deleted: " + offlineDeletes.length);

    // Avoid an infinite loop.. Jump to 1 if from page 8

    if (!fromPg8 && (offlineForms.length > 0 || offlineDeletes.length > 0)) {
      goToPage = 8;
    } else {
      goToPage = 1;
    }
    this.setState({ message: message, currentPage: goToPage });
  }

  // THIS DEALS WITH MAIN MENU SELECTIONS:

  mainMenuButton(event) {
    var value = parseInt(event.target.id, 10);

    if (value === 1 || value === 2) {
      // may need to be refreshed,
      // therefore swtich off and back on
      // for #2 - clear the form
      if (value === this.state.currentPage) {
        // console.log("same page");
        this.setState({
          pageToRefresh: value,
          currentPage: 9
        });
      } else if (value === 1) {
        this.sendEdits("", false); // will redirect to Showgrades after
      } else if (value === 2) {
        this.buttonGoNewGrade();
      }
    } else {
      // all other page selections
      this.setState({
        currentPage: value
      });
    }
  }

  render() {
    let ddList = usersLoginArray.map((item, i) => {
      return (
        <option key={i} value={item.id}>
          {item.id} {item.name}
        </option>
      );
    });

    if (this.state.curLogin >= 0) {
      return (
        <div className="App">
          <table>
            <tr>
              <td>
                <button
                  id="0"
                  className={
                    this.state.currentPage === 0 || this.state.currentPage === 3
                      ? "btn btn-dark btn-sm"
                      : "btn btn-primary btn-sm"
                  }
                  onClick={this.mainMenuButton}
                >
                  Home
                </button>
              </td>
              <td>
                <button
                  className={
                    this.state.currentPage === 1 ||
                    (this.state.currentPage === 2 &&
                      this.state.editingGrade !== false)
                      ? "btn btn-dark btn-sm"
                      : "btn btn-primary btn-sm"
                  }
                  id="1"
                  onClick={this.mainMenuButton}
                >
                  Grades
                </button>
              </td>
              <td>
                <button
                  className={
                    this.state.currentPage === 2 &&
                    this.state.editingGrade !== true
                      ? "btn btn-dark btn-sm"
                      : "btn btn-primary btn-sm"
                  }
                  id="2"
                  onClick={this.mainMenuButton}
                >
                  New Grade
                </button>
              </td>
              {this.state.curLogin == "0" && (
                <td>
                  <button
                    id="4"
                    className={
                      this.state.currentPage === 4
                        ? "btn btn-dark btn-sm"
                        : "btn btn-primary btn-sm"
                    }
                    onClick={this.mainMenuButton}
                  >
                    Admin
                  </button>
                </td>
              )}
              {this.state.isOffline === true && (
                <td>
                  <button
                    data-tip
                    data-for="offline-tip"
                    className="btn btn-danger btn-sm"
                    id="10"
                    onClick={this.mainMenuButton}
                  >
                    |
                  </button>
                  <ReactTooltip id="offline-tip" place="bottom">
                    YOU ARE OFFLINE
                  </ReactTooltip>
                </td>
              )}
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  id="99"
                  onClick={this.logOut}
                >
                  log out
                </button>
              </td>

              <td>
                {this.state.curLogin == "0" && (
                  <select
                    name="graderID"
                    value={this.state.graderID}
                    onChange={this.updateDD_GID}
                  >
                    {ddList}
                  </select>
                )}
              </td>
              <td>
                <small>LOG-IN: {this.state.curLogin}</small>
              </td>
              {this.state.allowSimulateOffline === true && (
                <td>
                  <input
                    type="checkbox"
                    name="simulateOffline"
                    checked={this.state.simulateOffline}
                    onChange={this.updateTB}
                  ></input>
                  <small> OFFLINE</small>
                </td>
              )}
            </tr>
          </table>
          &nbsp;
          <div className="container">
            {this.state.currentPage === 0 && (
              <ComponentHome
                goNewGrade={this.buttonGoNewGrade}
                cbfp_callbackGoMMPage={this.callbackGoMMPage}
              />
            )}
            {this.state.currentPage === 1 && (
              <ShowGrades
                message={this.state.message}
                callbackSortCols={this.callbackSortCols}
                sortCol={this.state.sortCol}
                sortAsc={this.state.sortAsc}
                simulateOffline={this.state.simulateOffline}
                graderID={this.state.graderID}
                goEditGrade={this.buttonEditGrade}
                goNewGrade={this.buttonGoNewGrade}
                callbackFromParentEditRecord={this.callbackEditRecord}
                callbackFromParentDeleteRecord={this.callbackDeleteRecord}
                cbFPIsOffline={this.callbackIsOffline}
              />
            )}
            {this.state.currentPage === 2 && (
              <CheeseForm
                callbackFromParentEdit={this.callbackGoEditOrDelete}
                graderID={this.state.graderID}
                usersList={usersLoginArray}
                fv0={this.state.fv0}
                fv1={this.state.fv1}
                fv2={this.state.fv2}
                fv3={this.state.fv3}
                fv4={this.state.fv4}
                fv5={this.state.fv5}
                fv6={this.state.fv6}
                fv7={this.state.fv7}
                fv8={this.state.fv8}
                fv9={this.state.fv9}
                fv10={this.state.fv10}
                fv11={this.state.fv11}
                fv12={this.state.fv12}
                fv13={this.state.fv13}
                fv14={this.state.fv14}
                fv15={this.state.fv15}
                fv16={this.state.fv16}
                fv17={this.state.fv17}
                fv18={this.state.fv18}
                fv19={this.state.fv19}
                fv20={this.state.fv20}
              />
            )}
            {this.state.currentPage === 3 && <AboutApp />}

            {this.state.currentPage === 4 && <AdminPage />}
            {this.state.currentPage === 10 && (
              <OfflinePage
                sendEdits={this.sendEdits}
                graderID={this.state.graderID}
              />
            )}
            {this.state.currentPage === 6 && (
              <DeleteRecord
                callbackFromParentDelete={this.callbackGoEditOrDelete}
                cbfp_callbackGoMMPage={this.callbackGoMMPage}
                recordToDelete={this.state.fv0}
                graderID={this.state.fv1}
              />
            )}

            {this.state.currentPage === 5 && (
              <SendForm
                simulateOffline={this.state.simulateOffline}
                editOrDelete={this.state.editOrDelete}
                data={this.state.formData}
                goEditGrade={this.buttonEditGrade}
                goNewGrade={this.buttonGoNewGrade}
                cbFPIsOffline={this.callbackIsOffline}
                sendEdits={this.sendEdits}
                graderID={this.state.fv1}
                // // //
                graderID_menu={this.state.graderID}
                callbackSortCols={this.callbackSortCols}
                sortCol={this.state.sortCol}
                sortAsc={this.state.sortAsc}
                callbackFromParentEditRecord={this.callbackEditRecord}
                callbackFromParentDeleteRecord={this.callbackDeleteRecord}
              />
            )}

            {this.state.currentPage === 8 && (
              <SendOfflineForms
                message={this.state.message}
                sendEdits={this.sendEdits}
                simulateOffline={this.state.simulateOffline}
                graderID={this.state.graderID}
                data={this.state.formData}
                cbfp_goOnline={this.callbackGoOnline}
                cbfpShowGradesOL={this.callbackShowGradesOL}
                goNewGrade={this.buttonGoNewGrade}
                cbFPIsOffline={this.callbackIsOffline}
                goEditGrade={this.buttonEditGrade}
                graderID_menu={this.state.graderID}
                callbackSortCols={this.callbackSortCols}
                sortCol={this.state.sortCol}
                sortAsc={this.state.sortAsc}
                callbackFromParentEditRecord={this.callbackEditRecord}
                callbackFromParentDeleteRecord={this.callbackDeleteRecord}
              />
            )}
            {this.state.currentPage === 9 && (
              <RefreshPage
                cbfp_callbackGoMMPage={this.callbackGoMMPage}
                goNewGrade={this.buttonGoNewGrade}
                pageToRefresh={this.state.pageToRefresh}
                sendEdits={this.sendEdits}
              />
            )}
          </div>
        </div>
      ); // end of return statement
    } else {
      let userList = usersLoginArray.map((item, i) => {
        return (
          <tr>
            <td>{item.id}</td>
            <td>{item.email}</td>
            <td>{item.pw}</td>
          </tr>
        );
      });
      return (
        <div className="App">
          <div className="container">
            <p></p>
            <h2>Please Log in:</h2>
            <p>
              <small>{this.state.loginMessage}</small>
            </p>
            <form onSubmit={this.logIn}>
              <p>
                <input
                  type="text"
                  name="email"
                  placeholder="user email"
                  value={this.state.email}
                  onChange={this.updateTB}
                ></input>
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={this.updateTB}
                ></input>
              </p>
              <p>
                <button
                  className="btn btn-primary btn-lg btn-block"
                  onClick={this.logIn}
                >
                  Log in
                </button>
              </p>
            </form>
            <p>
              {" "}
              <button
                name="clearStorage"
                className="btn btn-secondary btn-sm"
                onClick={() => localStorage.clear()}
              >
                clear local storage
              </button>
              <p>
                <input
                  type="checkbox"
                  name="allowSimulateOffline"
                  checked={this.state.allowSimulateOffline}
                  onChange={this.updateTB}
                ></input>{" "}
                <small>
                  Simulate Offline Option
                  <br />
                  <b>For testing purposes.</b>{" "}
                  <i>
                    This gives you the option to toggle the internet connection
                    to the app.
                  </i>
                </small>
              </p>
            </p>
            <p>
              <small>
                <table>
                  <tr>
                    <th>USER&nbsp;</th>
                    <th>email</th>
                    <th>password</th>
                    <th></th>
                  </tr>
                  {userList}
                </table>
              </small>
            </p>
          </div>
        </div>
      );
    }
  } // end of render function
} // end of class

//**************************************************//
class ComponentHome extends Component {
  goToAbout = () => {
    this.props.cbfp_callbackGoMMPage(3);
  };

  render() {
    const goNewGrade = this.props.goNewGrade;
    return (
      <div className="goNewGrade">
        <div>
          <p>
            <hr />
          </p>
        </div>
        <p>
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={goNewGrade}
          >
            Enter a new Grade
          </button>
        </p>
        <h1>Easy Cheesy Grader</h1>
        Welcome to our Cheese Grader
        <br />
        <h6>
          <small>FINAL VERSION</small>
        </h6>
        <button
          className="btn btn-dark btn-sm btn-block"
          id="3"
          onClick={this.goToAbout}
        >
          About the Cheese-Grader App
        </button>
      </div>
    );
  }
}

//**************************************************//
class ShowGrades extends Component {
  // MENU ITEM = 1
  constructor(props) {
    super(props);

    // Before ShowGrades is made visible
    // sendOfflineForms() is executed

    this.state = {
      apiData: [],
      apiResult: false,
      errorMsg: null,
      //fv2: "2019-12-01",
      sortCol: "gradeDate",
      sortAsc: -1,
      months: [
        "---",
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
      ]
    };

    this.addRecord = this.addRecord.bind(this);
    this.editRecord = this.editRecord.bind(this);
    this.superSort = this.superSort.bind(this);
    this.deleteRecord = this.deleteRecord.bind(this);
  }

  // NOW WE CONTACT OUT CUSTOM-BUILT API
  // GRADER_ID = 0 SHOWS ALL RECORDS,
  // OTHERWISE JUST THE RECORDS OF THAT PARTICULAR GRADER

  async componentDidMount() {
    var t;

    try {
      var API_URL = "";
      if (!this.props.simulateOffline) {
        API_URL =
          "https://cheese-grade.com/cheese/getGrades.php?graderID=" +
          this.props.graderID +
          "&";
      }

      // Fetch or access the service at the API_URL address
      const response = await fetch(API_URL);
      // wait for the response. When it arrives, store the JSON version
      // of the response in this variable.
      const jsonResult = await response.json();
      for (t = 0; t < jsonResult.results.length; t++) {
        jsonResult.results[t].status = 0;
        //// console.log("RES:" + jsonResult.results[t].gradeID);
      }
      // update state variables:
      // -----------------------------------------------

      // console.log("SAVING DB: " + jsonResult.results.length);
      var dbOffline = JSON.stringify(jsonResult.results);

      var t, tt, len;
      var db_split = [];

      if (this.props.graderID > 0) {
        localStorage.setItem("apiData_" + this.props.graderID, dbOffline);
        // console.log("691 SET : apiData_" + this.props.graderID);
      } else {
        len = jsonResult.results.length;

        for (t = 1; t < usersLoginArray.length; t++) {
          db_split = jsonResult.results.filter((results) => {
            return results.graderID == t;
          });
          localStorage.setItem("apiData_" + t, JSON.stringify(db_split));
        }
      }

      // -----------------------------------------------

      this.setState({ apiData: jsonResult.results });

      this.setState({ apiResult: true, isOffline: 0 }); // 0 means false

      this.props.cbFPIsOffline(false);
    } catch (error) {
      // AN ERROR means that we are offline:

      // SHOW THE OFFLINE MENU ITEM:
      this.props.cbFPIsOffline(true);
      // console.log("OFFLINE DATA RETREVAL...");

      this.setState({ apiResult: true });

      var dbOffline = [],
        curObj;
      var len2; ////

      if (this.props.graderID > 0) {
        dbOffline = getOfflineArrayNoNull("apiData_" + this.props.graderID);
      } else {
        for (t = 1; t < usersLoginArray.length; t++) {
          curObj = localStorage.getItem("apiData_" + t);
          if (curObj !== null) {
            curObj = JSON.parse(curObj);
            len2 = curObj.length;
            // console.log("************  C-LEN:" + len2);
            dbOffline = [...dbOffline, ...curObj];
          } else {
            // console.log("#########  NULL:" + t);
          }
        }
      }
      // console.log("706 GET : adpData_" + this.props.graderID);
      var apiAlert = error;
      var apiAlert2 = "";

      var isOffline;
      if (dbOffline !== null) {
        isOffline = 1; // means offline with data
        // console.log("OLWD: " + dbOffline.length + ";");
      } else {
        dbOffline = [];
        apiAlert2 = "No data currently offline - Please add grades. ";
      }
      if (dbOffline.length < 1) {
        isOffline = -1; // means offline without data
        apiAlert2 = "No data currently offline - Please add grades. ";
      } else {
      }
      // OFFLINE DATABASE
      apiAlert = "";
      this.setState({
        apiData: dbOffline,
        isOffline: isOffline,
        apiAlert: apiAlert,
        apiAlert2: apiAlert2
      });
    } // try catch
    this.superSort(this.props.sortCol, false); // // the ZERO is insufficient
  } // componentDidMount()

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1; // if not found
  }

  compare(a, b, type) {
    // 0 = num 1 = rest
    if (type === 0) {
      if (parseInt(a, 10) > parseInt(b, 10)) {
        return -1;
      } else if (parseInt(a, 10) < parseInt(b, 10)) {
        return 1;
      } else {
        return 0;
      }
    } else {
      if (a > b) {
        return -1;
      } else if (a < b) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  superSort(key, toggleAscDesc) {
    var type = 0;
    var cols = [
      "gradeDate",
      "description",
      "texture",
      "flavour",
      "functionality",
      "comment"
    ];
    var apiData = this.state.apiData;
    var len = apiData.length;
    var i, ii;
    var asc;
    // //
    if (cols.indexOf(key) > -1) {
      type = 1;
    }

    if (toggleAscDesc) {
      if (this.props.sortCol === key) {
        asc = this.props.sortAsc * -1;
      } else {
        asc = 1;
      }
      this.props.callbackSortCols(key, asc);
    } else {
      key = this.props.sortCol;
      asc = this.props.sortAsc;
    }
    var highest;
    var temp;
    for (i = 0; i < len; i++) {
      highest = i;
      for (ii = i + 1; ii < len; ii++) {
        if (
          this.compare(apiData[highest][key], apiData[ii][key], type) === asc
        ) {
          highest = ii;
        }
      } // for (ii) inner loop

      temp = apiData[highest];
      apiData[highest] = apiData[i];
      apiData[i] = temp;
    } // for (i) outer loop

    this.setState({ apiData: apiData });
  } // supersort

  editRecord(id) {
    var apiData = this.state.apiData;
    var index = this.getIndex(id, apiData, "gradeID");

    // console.log("EDit:" + id + "; " + index);
    if (index >= 0) {
      var record = apiData[index];
    } else {
      record = null;
    }

    this.props.callbackFromParentEditRecord(record);
  }

  deleteRecord(id, graderID) {
    // console.log("DEL:" + id);

    this.props.callbackFromParentDeleteRecord(id, graderID);
  }

  addRecord() {
    // console.log("asdsad");
  }

  showTextSummary(text, maxLen) {
    // only want to see first 50 chars
    // when we are list it
    if (text === undefined) return "";

    if (text.length <= maxLen) {
      return text;
    } else {
      return text.substring(0, maxLen) + "...";
    }
  }

  showCleanDate(text) {
    if (text === undefined) return "";
    if (text === "0000-00-00") {
      return "-";
    } else if (text.length === 10) {
      return (
        text.substring(8, 10) +
        "/" +
        text.substring(5, 7) +
        "/" +
        text.substring(2, 4)
      );
    } else {
      return text;
    }
  }

  render() {
    const goNewGrade = this.props.goNewGrade;
    const months = [
      "---",
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JULY",
      "AUG",
      "SEPT",
      "OCT",
      "NOV",
      "DEC"
    ];

    if (this.state.apiResult === false) {
      return (
        <div className="contactingAPI">
          <p>
            <small>Loading Grades</small>
          </p>
        </div>
      ); // end of return
    } else {
      // have data
      return (
        <div className="ShowGrades">
          {this.state.apiData.length > 0 && (
            <div className="DBrecs">
              <table>
                <tr>
                  <td>
                    {" "}
                    <small>
                      <b>{this.state.isOffline === 1 && "DB offline "}</b>
                      USER ID = {this.props.graderID}
                      &nbsp; Records: {this.state.apiData.length}
                      {this.props.message !== "" && (
                        <p>
                          <b>{this.props.message}</b>
                        </p>
                      )}
                    </small>
                  </td>
                </tr>
              </table>
              <table class="table table-hover">
                <thead>
                  <tr class="thead-dark">
                    <th>
                      <button
                        className={
                          this.props.sortCol === "gradeID"
                            ? "AdminPagebtn btn btn-primary btn-xs"
                            : "AdminPagebtn btn btn-secondary btn-xs"
                        }
                        onClick={() => this.superSort("gradeID", true)}
                      >
                        ID
                        {this.props.sortCol === "gradeID"
                          ? this.props.sortAsc === 1
                            ? "🠟"
                            : "🠝"
                          : ""}
                      </button>
                    </th>
                    <th>&nbsp;</th>
                    <th>&nbsp;</th>
                    {this.props.graderID == "0" && (
                      <th>
                        <button
                          className={
                            this.props.sortCol === "graderID"
                              ? "AdminPagebtn btn btn-primary btn-xs"
                              : "AdminPagebtn btn btn-secondary btn-xs"
                          }
                          onClick={() => this.superSort("graderID", true)}
                        >
                          Grader
                          {this.props.sortCol === "graderID"
                            ? this.props.sortAsc === 1
                              ? "🠟"
                              : "🠝"
                            : ""}
                        </button>
                      </th>
                    )}

                    <th>
                      <button
                        className={
                          this.props.sortCol === "gradeDate"
                            ? "AdminPagebtn btn btn-primary btn-xs"
                            : "AdminPagebtn btn btn-secondary btn-xs"
                        }
                        onClick={() => this.superSort("gradeDate", true)}
                      >
                        Date
                        {this.props.sortCol === "gradeDate"
                          ? this.props.sortAsc === 1
                            ? "🠟"
                            : "🠝"
                          : ""}
                      </button>
                    </th>
                    <th>
                      <button
                        className={
                          this.props.sortCol === "description"
                            ? "AdminPagebtn btn btn-primary btn-xs"
                            : "AdminPagebtn btn btn-secondary btn-xs"
                        }
                        onClick={() => this.superSort("description", true)}
                      >
                        Desc
                        {this.props.sortCol === "description"
                          ? this.props.sortAsc === 1
                            ? "🠟"
                            : "🠝"
                          : ""}
                      </button>
                    </th>

                    <th>
                      <button
                        className={
                          this.props.sortCol === "actionMonth"
                            ? "AdminPagebtn btn btn-primary btn-xs"
                            : "AdminPagebtn btn btn-secondary btn-xs"
                        }
                        onClick={() => this.superSort("actionMonth", true)}
                      >
                        AMth
                        {this.props.sortCol === "actionMonth"
                          ? this.props.sortAsc === 1
                            ? "🠟"
                            : "🠝"
                          : ""}
                      </button>
                    </th>
                    <th>
                      <button
                        className={
                          this.props.sortCol === "texture"
                            ? "AdminPagebtn btn btn-primary btn-xs"
                            : "AdminPagebtn btn btn-secondary btn-xs"
                        }
                        onClick={() => this.superSort("texture", true)}
                      >
                        Txr
                        {this.props.sortCol === "texture"
                          ? this.props.sortAsc === 1
                            ? "🠟"
                            : "🠝"
                          : ""}
                      </button>
                    </th>
                    <th>
                      <button
                        className={
                          this.props.sortCol === "flavour"
                            ? "AdminPagebtn btn btn-primary btn-xs"
                            : "AdminPagebtn btn btn-secondary btn-xs"
                        }
                        onClick={() => this.superSort("flavour", true)}
                      >
                        Flv
                        {this.props.sortCol === "flavour"
                          ? this.props.sortAsc === 1
                            ? "🠟"
                            : "🠝"
                          : ""}
                      </button>
                    </th>
                    <th>
                      <button
                        className={
                          this.props.sortCol === "functionality"
                            ? "AdminPagebtn btn btn-primary btn-xs"
                            : "AdminPagebtn btn btn-secondary btn-xs"
                        }
                        onClick={() => this.superSort("functionality", true)}
                      >
                        Fn
                        {this.props.sortCol === "functionality"
                          ? this.props.sortAsc === 1
                            ? "🠟"
                            : "🠝"
                          : ""}
                      </button>
                    </th>
                    <th>
                      <button
                        className={
                          this.props.sortCol === "comment"
                            ? "AdminPagebtn btn btn-primary btn-xs"
                            : "AdminPagebtn btn btn-secondary btn-xs"
                        }
                        onClick={() => this.superSort("comment", true)}
                      >
                        Comments
                        {this.props.sortCol === "comment"
                          ? this.props.sortAsc === 1
                            ? "🠟"
                            : "🠝"
                          : ""}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.apiData.map((element, index) => (
                    <tr
                      key={index}
                      bgcolor={element.status === 1 && "lightblue"}
                    >
                      <td>{element.gradeID}</td>
                      <td>
                        <button>
                          <img
                            src={icon_ED}
                            alt="ED"
                            onClick={() => this.editRecord(element.gradeID)}
                          />
                        </button>
                      </td>
                      <td>
                        <button>
                          <img
                            src={icon_DEL}
                            alt="DEL"
                            onClick={() =>
                              this.deleteRecord(
                                element.gradeID,
                                element.graderID
                              )
                            }
                          />
                        </button>
                      </td>
                      {this.props.graderID == 0 && <td>{element.graderID}</td>}
                      <td>{this.showCleanDate(element.gradeDate)}</td>
                      <td>{this.showTextSummary(element.description, 30)}</td>
                      <td>{months[element.actionMonth]}</td>
                      <td>{element.texture}</td>
                      <td>{element.flavour}</td>
                      <td>{element.functionality}</td>
                      <td>{this.showTextSummary(element.comment, 50)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {this.state.isOffline !== -1 && this.state.apiData.length < 1 && (
            <p>
              {this.state.apiAlert} Grader ID {this.props.graderID} currently
              has no grades.
            </p>
          )}
          {this.state.isOffline === -1 && (
            <p>
              {this.state.apiAlert2} {this.state.apiAlert}
            </p>
          )}
          <p>
            <div className="spacer">
              <p>
                <hr />
              </p>
            </div>
            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={goNewGrade}
            >
              Enter a NEW Grade
            </button>
          </p>
        </div>
      ); // return
    } // else
  } // render
} // shoGrades

//#############################################

class AboutApp extends Component {
  render() {
    return (
      <div className="AboutApp">
        <div className="spacer">
          <p>
            <hr />
          </p>
        </div>
        <h2>About Cheese Grader</h2>
        <p>
          <b>
            This cheese grading app was designed by the Calcium Team for their
            CS385 project. We hope that it's functional and cheasy to use.
          </b>
        </p>
        <br />
        <img src={cheeseImage1} alt="DEL" />
      </div>
    );
  }
} // close the AboutApp component
//**************************************************//

class OfflinePage extends Component {
  constructor(props) {
    super(props);
    // console.log("SHOW OFFLINE: " + this.props.graderID);

    var offlineForms = [],
      offlineForms = localStorage.getItem("offlineForms");
    if (offlineForms !== null) {
      offlineForms = JSON.parse(offlineForms);
    }

    if (offlineForms === null) {
      offlineForms = [];
    }
    var olf_len = offlineForms.length;

    // Do same for deletes:

    var ol_del_len = localStorage.getItem(
      "offlineDeletes_len_" + this.props.graderID
    );
    var offlineDeletes = JSON.parse(localStorage.getItem("offlineDeletes"));
    if (offlineDeletes === null) {
      offlineDeletes = [];
    }
    ol_del_len = offlineDeletes.length;

    this.state = {
      offlineForms: offlineForms,
      olf_len: olf_len,
      offlineDeletes: offlineDeletes,
      ol_del_len: ol_del_len
    };
  } // constructor

  tryOnline = () => {
    this.props.sendEdits("", false);
  };

  showCleanDate(text) {
    if (text === undefined) return "";
    if (text === "0000-00-00") {
      return "-";
    } else if (text.length === 10) {
      return (
        text.substring(8, 10) +
        "/" +
        text.substring(5, 7) +
        "/" +
        text.substring(2, 4)
      );
    } else {
      return text;
    }
  }

  render() {
    return (
      <div className="AdminPage">
        <div className="spacer">
          <p>
            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={this.tryOnline}
            >
              CHECK FOR AN INTERNET CONNECTION
            </button>
          </p>
          <p>
            <h4>Offline Edits to be sent: {this.state.olf_len}</h4>
            <br />
          </p>
          {this.state.olf_len > 0 && (
            <p>
              They will be inserted next time we get an Internet connection,
              <br />
              and you click "Grades".
              <br />
              <b>Offline edits to be sent:</b>
              {this.state.offlineForms.map((c) => (
                <li key={c.gradeID}>
                  {c.gradeID} {c.graderID} {c.description}{" "}
                  <b>{this.showCleanDate(c.gradeDate)}</b>
                </li>
              ))}
            </p>
          )}
          <p>
            <h4>Offline Grades to be deleted: {this.state.ol_del_len}</h4>
            <br />
          </p>
          {this.state.ol_del_len > 0 && (
            <p>
              <small>
                They will be deleted next time we get an Internet connection,
                and you click "Grades".
              </small>
              <p></p>
              <b>Offline grades to be deleted:</b>
              {this.state.offlineDeletes.map((c) => (
                <li key={c.gradeID}>
                  {c.gradeID} {c.graderID} {c.description}{" "}
                  <b>{this.showCleanDate(c.gradeDate)}</b>
                </li>
              ))}
            </p>
          )}
        </div>
      </div>
    );
  }
} // close the Offline component

//**************************************************//
class AdminPage extends Component {
  render() {
    return (
      <div className="AboutApp">
        <div className="spacer">
          <p>
            <hr />
          </p>
        </div>
        <h2>Admin Page</h2>
        <p>
          <b>This page is accessable only on the administrator account.</b>
        </p>
        <br />
      </div>
    );
  }
} // close the AdminPage component
//**************************************************//

class DeleteRecord extends Component {
  confirmDelete = () => {
    this.props.callbackFromParentDelete(
      this.props.recordToDelete,
      this.props.graderID,
      -1
    );
  };

  dontDelete = () => {
    this.props.cbfp_callbackGoMMPage(1);
  };

  render() {
    const recordToDelete = this.props.recordToDelete;
    return (
      <div className="AdminPage">
        <hr />
        <h1>Delete Cheese Grade Record</h1>
        Are you sure you want to delete the record (# {recordToDelete}) ?
        <br />
        <p>
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={this.confirmDelete}
          >
            YES
          </button>
        </p>
        <p>
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={this.dontDelete}
          >
            NO
          </button>
        </p>
      </div>
    );
  }
} // close the AdminPage component

function getUniqueID(offlineForms) {
  var t;
  var smallest = 1;
  for (t = offlineForms.length; t > 0; t--) {
    if (offlineForms[t - 1].gradeID < smallest) {
      smallest = offlineForms[t - 1].gradeID;
    }
  }
  smallest--;
  if (smallest > -1) {
    smallest = -1;
  }

  // console.log("smallest: " + smallest);
  return smallest;
}

class SendForm extends Component {
  // Menu item 5
  constructor(props) {
    super(props);

    this.state = {
      apiData: [],
      apiResult: false,
      errorMsg: null
    };
    // console.log("SENDFORM CONSTR");
  }

  async componentDidMount() {
    var message = "";

    try {
      var urlData;
      var gradeID_forOnline, graderID;

      // grade ID zero tells the API
      // that this is a new grade

      gradeID_forOnline = this.props.data.gradeID;
      if (gradeID_forOnline < 0) {
        gradeID_forOnline = 0;
      }

      if (this.props.editOrDelete === -1) {
        urlData = "?d=1&gradeID=" + this.props.data + "&";
        graderID = this.props.graderID; // different if delete
      } else {
        graderID = this.props.data.graderID; // different
        urlData =
          "?gradeID=" +
          encodeURI(gradeID_forOnline) +
          "&" +
          "graderID=" +
          encodeURI(this.props.data.graderID) +
          "&" +
          "description=" +
          encodeURI(this.props.data.description) +
          "&" +
          "gradeDate=" +
          encodeURI(this.props.data.gradeDate) +
          "&" +
          "actionMonth=" +
          encodeURI(this.props.data.actionMonth) +
          "&" +
          "customer=" +
          encodeURI(this.props.data.customer) +
          "&" +
          "texture=" +
          encodeURI(this.props.data.texture) +
          "&" +
          "general=" +
          encodeURI(this.props.data.general) +
          "&" +
          "flavour=" +
          encodeURI(this.props.data.flavour) +
          "&" +
          "functionality=" +
          encodeURI(this.props.data.functionality) +
          "&" +
          "grade=" +
          encodeURI(this.props.data.grade) +
          "&" +
          "store=" +
          encodeURI(this.props.data.store) +
          "&" +
          "manufLotNo=" +
          encodeURI(this.props.data.manufLotNo) +
          "&" +
          "milkOrigin=" +
          encodeURI(this.props.data.milkOrigin) +
          "&" +
          "product=" +
          encodeURI(this.props.data.product) +
          "&" +
          "rennetOrigin=" +
          encodeURI(this.props.data.rennetOrigin) +
          "&" +
          "rennetType=" +
          encodeURI(this.props.data.rennetType) +
          "&" +
          "reserveUntil=" +
          encodeURI(this.props.data.reserveUntil) +
          "&" +
          "saltOrigin=" +
          encodeURI(this.props.data.saltOrigin) +
          "&" +
          "saltCultureOrigin=" +
          encodeURI(this.props.data.saltCultureOrigin) +
          "&" +
          "comment=" +
          encodeURI(this.props.data.comment) +
          "&";
      }

      var API_URL = "";
      if (!this.props.simulateOffline) {
        API_URL = "https://cheese-grade.com/cheese/ed_API.php" + urlData;
        // console.log(API_URL);
      }

      const response = await fetch(API_URL);
      // wait for the response.
      // store json version of response.
      // console.log("Marker");
      // console.log(API_URL);
      const jsonResult = await response.json();
      // console.log("Marker2");
      if (this.props.editOrDelete === -1) {
        message = "Record deleted successfully";
      } else if (this.props.data.gradeID < 1) {
        message = "Record added successfully";
      } else {
        message = "Record updated successfully";
      }
      // update the state variables
      this.setState({ apiData: jsonResult.results });
      this.setState({ message: message });
      this.setState({ apiResult: true });
      this.props.cbFPIsOffline(false);
    } catch (error) {
      // WE'RE OFFLINE - SAVE RECORD TO LOCAL STORAGE
      // console.log(error);
      // console.log("Marker4");
      this.props.cbFPIsOffline(true);
      //const offlineForms = [{description: 2},{description: 4},{description: 6}];

      var od_len = parseInt(
        getOfflineNoNull(localStorage.getItem("offlineForms_len_" + graderID)),
        10
      );
      var offlineForms = getOfflineArrayNoNull("offlineForms");

      // we're OFFLINE - SAVE EDIT OR DELETE
      // NB: NEW FORMS NEED A MINUS ID NO IN ORDER TO REFERENCE THEM

      var dbOffline = [],
        curObj;
      var t, len2;
      if (graderID > 0) {
        dbOffline = getOfflineArrayNoNull("apiData_" + graderID);
      } else {
        for (t = 1; t < usersLoginArray.length; t++) {
          curObj = localStorage.getItem("apiData_" + t);
          if (curObj !== null) {
            curObj = JSON.parse(curObj);
            len2 = curObj.length;
            // console.log("C-LEN:" + len2);
            dbOffline = [...dbOffline, ...curObj];
          }
        }
      }

      var dbol_len;
      if (dbOffline === null) {
        dbOffline = [];
        dbol_len = 0;
      } else {
        dbol_len = dbOffline.length;
      }
      // console.log("DOL:" + graderID);

      if (this.props.editOrDelete !== -1) {
        // -1 = EDIT
        message =
          "Your edit has been saved offline. The record will be updated when on-line.";
        var tempData = this.props.data;
        tempData.status = 1;
        od_len++;
        if (tempData.gradeID === 0) {
          // Get a tempropary ID. New offline edits are <0
          // to distinguish them from other reccords
          tempData.gradeID = getUniqueID(offlineForms);
        }
        var t;
        // take out previous offline of same rec
        if (offlineForms.length > 0) {
          for (t = offlineForms.length; t > 0; t--) {
            if (offlineForms[t - 1].gradeID === tempData.gradeID) {
              //// console.log(offlineForms[t-1].gradeID+"==="+tempData.gradeID);
              offlineForms.splice(t - 1, 1);
            }
          }
        }
        offlineForms.push(tempData);

        // CHECK RECORDS - UPDATE LOCAL storage

        for (t = dbOffline.length; t > 0; t--) {
          if (dbOffline[t - 1].gradeID === tempData.gradeID) {
            //// console.log(offlineForms[t-1].gradeID+"==="+tempData.gradeID);
            dbOffline.splice(t - 1, 1);
            od_len--;
          }
        }
        dbOffline = [tempData, ...dbOffline];
      } else {
        //  --- SAVE DELETE
        message =
          "Your delete has been saved offline. The record will be deleted when on-line.";
        // SAVE DELETES
        // We need a list of deletes too:
        var offlineDeletes = JSON.parse(localStorage.getItem("offlineDeletes"));
        if (offlineDeletes === null) {
          offlineDeletes = [];
        }
        // take from offline edits, if it is in list

        if (offlineForms.length > 0) {
          for (t = offlineForms.length; t > 0; t--) {
            if (offlineForms[t - 1].gradeID === this.props.data) {
              offlineForms.splice(t - 1, 1);
            }
          }
        }

        // put it in delete list
        // if id>-1 i.e. need further action.
        // delete from offline data

        for (t = dbOffline.length; t > 0; t--) {
          if (dbOffline[t - 1].gradeID === this.props.data) {
            // add to offline list
            if (dbOffline[t - 1].gradeID > -1) {
              offlineDeletes = [dbOffline[t - 1], ...offlineDeletes];
            }
            // take from offline data list
            dbOffline.splice(t - 1, 1);
            od_len--;
          }
        }

        // save deletes on local storage
        var offlineDeletesJSON = JSON.stringify(offlineDeletes);
        localStorage.setItem("offlineDeletes", offlineDeletesJSON);
      } // end of [SAVE DELETES]

      // SAVE FORM LIST OFFLINE
      var offlineFormsJSON = JSON.stringify(offlineForms);
      localStorage.setItem("offlineForms", offlineFormsJSON);

      // save data on local storage
      var dbOfflineJSON = JSON.stringify(dbOffline);
      // console.log("SAVING DB: " + dbOffline.length);
      localStorage.setItem("apiData_" + graderID, dbOfflineJSON);
      // console.log("1490 SET : adpData_" + graderID);

      this.setState({ offlineForms: offlineForms });
      this.setState({ message: message });
      this.setState({ apiResult: false });
      // This will be used to display error message.
      this.setState({ errorMsg: error });
    } // try catch

    // JUMP TO SENDFORMS COMPONENT:
    this.props.sendEdits(message, false);
  } // componentDidMount()

  showCleanDate(text) {
    if (text === undefined) return "";
    if (text === "0000-00-00") {
      return "-";
    } else if (text.length === 10) {
      return (
        text.substring(8, 10) +
        "/" +
        text.substring(5, 7) +
        "/" +
        text.substring(2, 4)
      );
    } else {
      return text;
    }
  }

  render() {
    if (this.state.errorMsg) {
      return (
        <div className="error">
          <div className="container">
            <p>
              <h2>{this.state.message}</h2>
            </p>
            <OfflinePage
              sendEdits={this.props.sendEdits}
              graderID={this.state.graderID}
            />
          </div>
        </div>
      ); // return
    } else if (this.state.apiResult === false) {
      return (
        <div className="contactingAPI">
          <h4>Loading Grades</h4>
        </div>
      ); // end of return
    } else {
      // have data
      return (
        <div className="SendForm">
          {this.state.apiData.success === "true" ? (
            <p>{this.state.message}</p>
          ) : (
            <p>{this.state.apiData.error}</p>
          )}
        </div>
      ); // return
    } // else
  } // render
} // shoGrades

//#############################################
// THIS COMPONENT CAN BE REFINED
//#############################################

class SendOfflineForms extends Component {
  // MENU ITEM # 8
  constructor(props) {
    super(props);
    var data;

    //this.cbfp_goOnline = this.props.cbfp_goOnline.bind(this);

    var od_len = localStorage.getItem(
      "offlineForms_len_" + this.props.graderID
    );
    var offlineForms = JSON.parse(localStorage.getItem("offlineForms"));
    if (offlineForms !== null && offlineForms.length < 1) {
      // show grades
      this.props.cbfpShowGradesOL();
      this.state = { offlineForms: [], apiData: [] };
      // console.log("OFFLINE List empty");
    } else {
      // // console.log("DATA: OFFLINE DATA TO BE SENT... " + offlineForms.length);
      if (offlineForms === null) {
        data = [];
      } else {
        data = offlineForms[0];
      }

      // post all our offline records for update:

      this.state = {
        offlineForms: offlineForms,
        data: data,
        apiData: [],
        apiResult: false,
        errorMsg: null
      };
    }
    // console.log("=CONSOLE===============================");
    // console.log("SENDING OFFLINE FORMS...");
    // console.log("data");
  }

  async componentDidMount() {
    var offlineForms = JSON.parse(localStorage.getItem("offlineForms"));
    var offlineDeletes = JSON.parse(localStorage.getItem("offlineDeletes"));
    var total_len = getLen_noNull(offlineForms) + getLen_noNull(offlineDeletes);
    var urlData = "?len=" + total_len + "&";
    var t;
    var message = "";

    // console.log("MOUNT: " + offlineForms.length);

    try {
      for (t = 0; t < offlineForms.length; t++) {
        urlData =
          urlData +
          "f_" +
          t +
          "_gradeID=" +
          encodeURI(offlineForms[t].gradeID) +
          "&f_" +
          t +
          "_graderID=" +
          encodeURI(offlineForms[t].graderID) +
          "&f_" +
          t +
          "_description=" +
          encodeURI(offlineForms[t].description) +
          "&f_" +
          t +
          "_gradeDate=" +
          encodeURI(offlineForms[t].gradeDate) +
          "&f_" +
          t +
          "_actionMonth=" +
          encodeURI(offlineForms[t].actionMonth) +
          "&f_" +
          t +
          "_customer=" +
          encodeURI(offlineForms[t].customer) +
          "&f_" +
          t +
          "_texture=" +
          encodeURI(offlineForms[t].texture) +
          "&f_" +
          t +
          "_general=" +
          encodeURI(offlineForms[t].general) +
          "&f_" +
          t +
          "_flavour=" +
          encodeURI(offlineForms[t].flavour) +
          "&f_" +
          t +
          "_functionality=" +
          encodeURI(offlineForms[t].functionality) +
          "&f_" +
          t +
          "_grade=" +
          encodeURI(offlineForms[t].grade) +
          "&f_" +
          t +
          "_store=" +
          encodeURI(offlineForms[t].store) +
          "&f_" +
          t +
          "_manufLotNo=" +
          encodeURI(offlineForms[t].manufLotNo) +
          "&f_" +
          t +
          "_milkOrigin=" +
          encodeURI(offlineForms[t].milkOrigin) +
          "&f_" +
          t +
          "_product=" +
          encodeURI(offlineForms[t].product) +
          "&f_" +
          t +
          "_rennetOrigin=" +
          encodeURI(offlineForms[t].rennetOrigin) +
          "&f_" +
          t +
          "_rennetType=" +
          encodeURI(offlineForms[t].rennetType) +
          "&f_" +
          t +
          "_reserveUntil=" +
          encodeURI(offlineForms[t].reserveUntil) +
          "&f_" +
          t +
          "_saltOrigin=" +
          encodeURI(offlineForms[t].saltOrigin) +
          "&f_" +
          t +
          "_saltCultureOrigin=" +
          encodeURI(offlineForms[t].saltCultureOrigin) +
          "&f_" +
          t +
          "_comment=" +
          encodeURI(offlineForms[t].comment) +
          "&";
      } // for loop (edits)

      for (t = offlineForms.length; t < total_len; t++) {
        urlData =
          urlData +
          "f_" +
          t +
          "_gradeID=" +
          encodeURI(offlineDeletes[t - offlineForms.length].gradeID) +
          "&d_" +
          t +
          "=1&";
      } // for loop (deletes)

      // urlData = this.state.urlData;
      var API_URL = "";
      // console.log(urlData);

      // console.log("================================");
      // console.log("SENDING OFFLINE FORMS...");
      if (!this.props.simulateOffline) {
        API_URL = "https://cheese-grade.com/cheese/CRUD_API2.php" + urlData;
      }

      const response = await fetch(API_URL);
      // wait for the response.
      // store json version of response.
      const jsonResult = await response.json();

      // update the state variables
      message = "Offline Grades updates successfully sent";
      this.setState({ apiData: jsonResult.results });
      this.setState({ message: message });
      this.setState({ apiResult: true });

      offlineForms = [];
      offlineDeletes = [];
      localStorage.removeItem("offlineForms");
      localStorage.removeItem("offlineDeletes");
      this.props.cbfp_goOnline();

      this.props.cbFPIsOffline(false);
    } catch (error) {
      this.props.cbFPIsOffline(true);
      //const offlineForms = [{description: 2},{description: 4},{description: 6}];

      // GO TO SHOWGRADES

      this.props.cbfpShowGradesOL();
      // console.log("8--- ERR");
      // console.log("E:" + error);
      message = this.props.message;
      this.setState({ message: message });
      this.setState({ apiResult: false });

      this.setState({ errorMsg: error });
    } // try catch

    // JUMP TO SENDFORMS COMPONENT:
    // true tells the method not to loop back to this component

    this.props.sendEdits(message, true);
  } // componentDidMount()

  render() {
    if (this.state.errorMsg) {
      return (
        <div className="error">
          <p>
            Your cheesegrade was stored off-line. It will be inserted next time
            we get an Internet connection. {this.API_URL}
          </p>
          {this.state.offlineForms.map((c) => (
            <li key={c.gradeID}>
              {c.gradeID} {c.description} {c.customer}
            </li>
          ))}
        </div>
      ); // return
    } else if (this.state.apiResult === false) {
      return (
        <div className="contactingAPI">
          <h4>Loading Grades</h4>
        </div>
      ); // end of return
    } else {
      // have data
      return (
        <div className="ShowGrades">
          {this.state.apiData.success === "true" ? (
            <p>{this.state.message}</p>
          ) : (
            <p>{this.state.apiData.error}</p>
          )}
        </div>
      ); // return
    } // else
  } // render
} // CLASS

//#############################################

class RefreshPage extends Component {
  constructor(props) {
    super(props);
    if (this.props.pageToRefresh === 1) {
      this.props.sendEdits("", false);
    } else if (this.props.pageToRefresh === 2) {
      this.props.goNewGrade();
    } else {
      this.props.cbfp_callbackGoMMPage(this.props.pageToRefresh);
    }
  }

  render() {
    return (
      <div className="RefreshPage">
        <div className="spacer">
          <p>
            <hr />
          </p>
        </div>
        <h1>Refresh</h1>
      </div>
    );
  }
} // close the RefreshPage component
//************************************//

export default App;

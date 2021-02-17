import React, { Component } from "react";
import { attributesObjectsArray } from "./data";
const attributesArray = attributesObjectsArray;

// lATEST EDIT 18/12 NOON

class CheeseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dbData: [],
      fv0: this.props.fv0,
      fv1: this.props.fv1,
      fv2: this.props.fv2,
      fv3: this.props.fv3,
      fv4: this.props.fv4,
      fv5: this.props.fv5,
      fv6: this.props.fv6,
      fv7: this.props.fv7,
      fv8: this.props.fv8,
      fv9: this.props.fv9,
      fv10: this.props.fv10,
      fv11: this.props.fv11,
      fv12: this.props.fv12,
      fv13: this.props.fv13,
      fv14: this.props.fv14,
      fv15: this.props.fv15,
      fv16: this.props.fv16,
      fv17: this.props.fv17,
      fv18: this.props.fv18,
      fv19: this.props.fv19,
      fv20: this.props.fv20
    };
    this.updateTB = this.updateTB.bind(this);
    this.updateTB_num = this.updateTB_num.bind(this);
    this.updateTB_2 = this.updateTB_2.bind(this);
  } // end CheeseForm constructor

  updateTB(event) {
    const target = event.target;
    var value = target.value;
    const name = target.name;
    var warning = 0;
    if (name === "fv2" && value.length > 100) {
      value = value.substring(0, 100);
      warning = 1;
    } else if (name === "fv20" && value.length > 200) {
      value = value.substring(0, 200);
      warning = 2;
    }
    this.setState({
      [name]: value,
      warning: warning
    });
  }

  updateTB_num(event) {
    const target = event.target;
    var value = target.value;
    var warning = 0;
    value = String(value);
    value = "" + value;
    oldValue = value;
    value = value.replace(/\D/g, "");
    if (oldValue !== value) {
      warning = 3;
    }

    const name = target.name;
    this.setState({
      [name]: value,
      warning: warning
    });
  }

  editGrade = () => {
    const custArr = ["-", "ALD", "DNS", "SVU", "TSC", "LDL", "385"];

    // console.log("SUBMIT: " + this.state.fv1);

    if (this.state.fv1 == 0) {
      this.setState({ warning: 4 });
    } else {
      var customer = custArr.indexOf(this.state.fv5);

      const formObject = {
        gradeID: this.state.fv0,
        graderID: this.state.fv1,
        description: this.state.fv2,
        gradeDate: this.state.fv3,
        actionMonth: this.state.fv4,
        customer: customer,
        texture: this.state.fv6,
        general: this.state.fv7,
        flavour: this.state.fv8,
        functionality: this.state.fv9,
        grade: this.state.fv10,
        store: this.state.fv11,
        manufLotNo: this.state.fv12,
        milkOrigin: this.state.fv13,
        product: this.state.fv14,
        rennetOrigin: this.state.fv15,
        rennetType: this.state.fv16,
        reserveUntil: this.state.fv17,
        saltOrigin: this.state.fv18,
        saltCultureOrigin: this.state.fv19,
        comment: this.state.fv20
      };

      // console.log("SFN:" + formObject.gradeID);
      this.props.callbackFromParentEdit(formObject, this.state.fv1, 0);
    }
  };

  updateTB_2(event) {
    this.setState({ fv3: event.target.value });
  }

  render() {
    let ddList2 = this.props.usersList.slice(1).map((item, i) => {
      return (
        <option key={i} value={item.id}>
          {item.id} {item.name}
        </option>
      );
    });

    let ddList = [];

    attributesArray.map(
      (element, index) =>
        (ddList[index] =
          attributesArray[index].length > 0 &&
          attributesArray[index].map((item, i) => {
            return (
              <option key={i} value={item.item}>
                {item.item} {item.desc}
              </option>
            );
          }, this))
    );

    return (
      <div className="CheeseForm">
        <p>
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={this.editGrade}
          >
            SUBMIT GRADE
          </button>
        </p>
        {this.state.warning === 4 && (
          <p>
            <small>Please choose a grader</small>
          </p>
        )}
        <table id="cgrades">
          <tr>
            <th></th>
            <th></th>
          </tr>
          <tr>
            {this.state.fv0 !== 0 ? (
              <p>
                <td>
                  <small>
                    <b>Edit Grade # {this.state.fv0}</b>
                  </small>
                  :
                </td>
              </p>
            ) : (
              <small>
                <b>ENTER NEW GRADE:</b>
              </small>
            )}
            <td></td>
          </tr>
          <tr>
            <td>Grader</td>
            {this.state.fv1 < 1 && (
              <select
                name="fv1"
                value={this.state.fv1}
                onChange={this.updateTB}
              >
                {" "}
                <option value="0">Pick a grader</option>
                {ddList2}
              </select>
            )}
            {this.state.fv1 > 0 && <td>GRADER: {this.state.fv1}</td>}
          </tr>
          <td>Description</td>
          <td>
            <input
              type="text"
              name="fv2"
              placeholder="Enter Description"
              value={this.state.fv2}
              onChange={this.updateTB}
            ></input>
            {this.state.warning === 1 && (
              <p>
                <small>Max 100 chars</small>
              </p>
            )}
          </td>
          <tr>
            <td>Date Array</td>
            <td>
              <input
                type="date"
                name="fv3"
                value={this.state.fv3}
                onChange={this.updateTB}
              ></input>
            </td>
          </tr>
          <tr>
            <td>Action Month</td>
            <td>
              <select
                name="fv4"
                value={this.state.fv4}
                onChange={this.updateTB}
              >
                <option value="0">select</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Customer</td>
            <td>
              <select
                name="fv5"
                value={this.state.fv5}
                onChange={this.updateTB}
              >
                {ddList[0]}
              </select>
            </td>
          </tr>
          <tr>
            <td>TEXTURE</td>
            <td>
              <select
                name="fv6"
                value={this.state.fv6}
                onChange={this.updateTB}
              >
                {ddList[1]}
              </select>
            </td>
          </tr>
          <tr>
            <td>GENERAL</td>
            <td>
              {" "}
              <select
                name="fv7"
                value={this.state.fv7}
                onChange={this.updateTB}
              >
                {ddList[2]}
              </select>
            </td>
          </tr>
          <tr>
            <td>FLAVOUR</td>
            <td>
              <select
                name="fv8"
                value={this.state.fv8}
                onChange={this.updateTB}
              >
                {ddList[3]}
              </select>
            </td>
          </tr>
          <tr>
            <td>FUNCTIONALITY</td>
            <td>
              <select
                name="fv9"
                value={this.state.fv9}
                onChange={this.updateTB}
              >
                {ddList[4]}
              </select>
            </td>
          </tr>
          <tr>
            <td>GRADE</td>
            <td>
              <select
                name="fv10"
                value={this.state.fv10}
                onChange={this.updateTB}
              >
                {ddList[5]}
              </select>
            </td>
          </tr>
          <tr>
            <td>STORE</td>
            <td>
              <select
                name="fv11"
                value={this.state.fv11}
                onChange={this.updateTB}
              >
                {ddList[6]}
              </select>
            </td>
          </tr>
          <tr>
            <td>Milk LOT NO</td>
            <td>
              <input
                type="text"
                name="fv12"
                value={this.state.fv12}
                placeholder="Enter Lot No..."
                onChange={this.updateTB_num}
              ></input>
              {this.state.warning === 3 && (
                <p>
                  <small>Numbers only</small>
                </p>
              )}
            </td>
          </tr>
          <tr>
            <td>MILK ORIGIN</td>
            <td>
              <select
                name="fv13"
                value={this.state.fv13}
                onChange={this.updateTB}
              >
                {ddList[9]}
              </select>
            </td>
          </tr>
          <tr>
            <td>PRODUCT</td>
            <td>
              <select
                name="fv14"
                value={this.state.fv14}
                onChange={this.updateTB}
              >
                {ddList[7]}
              </select>
            </td>
          </tr>
          <tr>
            <td>RENNET ORIGIN</td>
            <td>
              <select
                name="fv15"
                value={this.state.fv15}
                onChange={this.updateTB}
              >
                {ddList[9]}
              </select>
            </td>
          </tr>
          <tr>
            <td>RENNET TYPE</td>
            <td>
              <select
                name="fv16"
                value={this.state.fv16}
                onChange={this.updateTB}
              >
                <option value="REG">Regular</option>
                <option value="VEG">Vegetarian</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>RESERVE UNTIL</td>
            <td>
              <input
                type="date"
                name="fv17"
                value={this.state.fv17}
                onChange={this.updateTB}
              ></input>
            </td>
          </tr>
          <tr>
            <td>SALT ORIGIN</td>
            <td>
              <select
                name="fv18"
                value={this.state.fv18}
                onChange={this.updateTB}
              >
                {ddList[9]}
              </select>
            </td>
          </tr>
          <tr>
            <td>SALT CULT ORIGIN</td>
            <td>
              <select
                name="fv19"
                value={this.state.fv19}
                onChange={this.updateTB}
              >
                {ddList[9]}
              </select>
            </td>
          </tr>
          <tr>
            <td>COMMENT</td>
            <td>
              <textarea
                name="fv20"
                value={this.state.fv20}
                onChange={this.updateTB}
                placeholder="Enter Comment..."
              ></textarea>
              {this.state.warning === 2 && (
                <p>
                  <small>Max 200 chars</small>
                </p>
              )}
            </td>
          </tr>
        </table>
        <p>
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={this.editGrade}
          >
            SUBMIT GRADE
          </button>
        </p>
        {this.state.warning === 4 && (
          <p>
            <small>Please choose a grader</small>
          </p>
        )}
      </div>
    ); // return
  } // render
} // close cheeseForm component
export default CheeseForm;

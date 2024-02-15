import React, { useState } from "react";
import "./TodoPage.css";
import Button from "./Button";
import dayjs from "dayjs";
import moment from "moment";
import { TimePicker } from "antd";

const TodoPage = () => {
  const [inputData, setInputData] = useState({
    title: "",
    description: "",
    taskTime: 0,
    taskType: "todo",
    taskTimeOut: 0,
    id: Date.now(), //every time user adds task, the id cannot be same because Date.now() millisecinds will for sure change every time
  });

  const [listData, setListData] = useState([]);
  const [editIndex, setEditIndex] = useState("");
  const [editClick, setEditClick] = useState(false);
  const [taskTime, setTaskTime] = useState(0);

  const handleChange = (e) => {
    console.log("e", e);
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
    console.log(inputData);
  };
  const handleTimeChange = (e) => {
    console.log("e: ", e.target)

    let selectedTime = moment(dayjs(e).toJSON()).format("HH:mm:ss");
    let [hou, min, sec] = selectedTime.split(":");
    console.log("hou, min, sec", hou, min, sec);
    let totalMiliSecs =
      (Number(hou) * 60 * 60 + Number(min) * 60 + Number(sec)) * 1000;
    console.log("totalMiliSecs", totalMiliSecs);
    setTaskTime(setTimeout(()=>{

    },totalMiliSecs))


    setInputData({...inputData, taskTime: totalMiliSecs})
  };

  
  //single function for multiple button actions like - Add, Read, Edit, Delete

  const handleAction = (action, e, id) => {
    if (action === "add"  && inputData.title !== "" && inputData.description !== "") {
      if (editClick) {
        handleUpdate();

      } 
      else {
        console.log(" before set inputs: ", inputData);

        setListData([...listData, inputData]);

        setInputData({ title: "", description: "", taskType:"todo", taskTime:0, id: Date.now() });


      }
      setEditIndex(0);


    }
    if (action === "delete") {
      const filterData = listData.filter((item, i) => i !== id);
      setListData(filterData);
    }

  };
  console.log(listData);

  const handleEdit = (e, id)=>{
    console.log("id",id);

    const editData = listData.find(td => td.id == id);
      console.log("editData",editData);

      setInputData({
        title: editData.title,
        description: editData.description,
        taskType: editData.taskType,
        taskTime: editData.taskTime,
        id: editData.id
      });
      setTaskTime(clearTimeout(taskTime))
      setEditClick(true);
      setEditIndex(id);
  }

  const handleUpdate=()=>{
    let updateData = listData;
  

    let indexOfUpdateItem = updateData.findIndex(x=>x.id == editIndex)
    console.log("indexOfUpdateItem",indexOfUpdateItem);
    updateData.splice(indexOfUpdateItem, 1, inputData)


    setInputData({ title: "", description: "", taskType:"none", taskTime:0, id: Date.now() });
    
    setEditClick(false);

  }

  const handleSelect = (e)=>{
    console.log(e.target.value);
  
    setInputData({...inputData, taskType:e.target.value })
  }

  return (
    <>
      <div className="container">
        <div className="form">
          {editClick ? (
            <h1 id="addHead">Update Todo Task</h1>
          ) : (
            <h1 id="addHead">Add Todo Task</h1>
          )}
          <div>
            <input
              type="text"
              placeholder="Enter title"
              name="title"
              value={inputData.title}
              onChange={handleChange}
              id="title"
            />
            <br />
            <input
              type="text"
              placeholder="Enter description"
              name="description"
              value={inputData.description}
              onChange={handleChange}
              id="detail"
            />
            <br />
            {/* Antd timepicker always returns date in string format */}
            <TimePicker
              onChange={handleTimeChange}
          
            />

            <br />
            {editClick && (
              <select
                name="taskType"
                value={inputData.taskType}
                defaultValue={inputData.taskType}
                onChange={(e)=>{
                  handleSelect(e)
                }}
              >
                <option value="none">-- Select Task Status --</option>
                <option value="completed"> Completed </option>
              </select>
            )}
            <br />
            <Button
              id="yellowBtn"
              onClickAction={(e) => handleAction("add", e)}
            >
              {editClick ? (
                <i class="fa-solid fa-arrows-rotate"></i>
              ) : (
                <i class="fa-solid fa-plus"></i>
              )}{" "}
              {editClick ? "Update" : "Add "}
            </Button>
          </div>
        </div>
      </div>
      <div className="mainContainer">
        <div className="ListContainer">
          <h1 id="listHead">Todo List</h1>
          <div className="listData">
            {listData.length > 0 &&
              listData
                .filter((item) => item.taskType === "todo")
                .map((todo, id) => (
                  <div className="list">
                    <h2 id="titleP">
                      {id}. {todo.title}{" "}
                    </h2>
                    <br />
                    <h4 id="descriptionP">{todo.description}</h4>
                    <h3>{todo.taskType}</h3>
                    <h3>{moment().add(todo.taskTime, "milliseconds").format("hh:mm A")}</h3>
                    <div className="btn">
                      <Button
                        id="greenBtn"
                        onClickAction={(e) => handleEdit(e, todo.id)}
                      >
                        <i class="fa-regular fa-pen-to-square"></i> Edit
                      </Button>

                      <Button
                        id="redBtn"
                        onClickAction={(e) => handleAction("delete", e, id)}
                      >
                        <i class="fa-solid fa-trash"></i> Delete
                      </Button>
                    </div>
                  </div>
                ))}
            {listData.length === 0 && (
              <div>
                <h1 id="noTaskHead">
                  No todo task added yet{" "}
                  <i class="fa-solid fa-clipboard-list"></i>
                </h1>
              </div>
            )}
          </div>
        </div>

        <div className="ListContainer">
          <h1 id="listHead">Completed Task</h1>
          <div className="listData">
            {listData.length > 0 &&
              listData
                .filter((val) => val.taskType === "completed")
                .map((todo, id) => (
                  <div className="list">
                    <h2 id="titleP">
                      {id + 1}. {todo.title}{" "}
                    </h2>
                    <br />
                    <h4 id="descriptionP">{todo.description}</h4>
                    <h3>{todo.taskType}</h3>
                    <h3>
                      {moment().add(todo.taskTime, "milliseconds").format("hh:mm A")}
                      </h3>
                  </div>
                ))}
            {/* {listData.length === 0 && (
            <div>
              <h1 id="noTaskHead">
                No todo task added yet{" "}
                <i class="fa-solid fa-clipboard-list"></i>
              </h1>
            </div>
          )} */}
          </div>
        </div>

        <div className="ListContainer">
          <h1 id="listHead">Trash Tasks</h1>
          {/* <div className="listData">
          {listData.length > 0 &&
            listData.map((todo, id) => (
              <div className="list">
                <h2 id="titleP">
                  {id + 1}. {todo.title}{" "}
                </h2>
                <br />
                <h4 id="descriptionP">{todo.description}</h4>
                <h3>{todo.taskType}</h3>
                <h3>{todo.taskTime}</h3>
                <div className="btn">
                  <Button
                    id="greenBtn"
                    onClickAction={(e) => handleAction("edit", e, id)}
                  >
                    <i class="fa-regular fa-pen-to-square"></i> Edit
                  </Button>

                  <Button
                    id="redBtn"
                    onClickAction={(e) => handleAction("delete", e, id)}
                  >
                    <i class="fa-solid fa-trash"></i> Delete
                  </Button>
                </div>
              </div>
            ))}
          {listData.length === 0 && (
            <div>
              <h1 id="noTaskHead">
                No todo task added yet{" "}
                <i class="fa-solid fa-clipboard-list"></i>
              </h1>
            </div>
          )}
        </div> */}
        </div>
      </div>
    </>
  );
};

export default TodoPage;

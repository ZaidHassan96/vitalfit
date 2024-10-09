import React from "react";
import "../stylesheets/addClass.css";

const AddClass = ({ setAddClassPage }) => {
  // const addClassData = async ()
  return (
    <div className="add-class">
      <h3
        onClick={() => {
          setAddClassPage(false);
        }}
      >
        View Classes
      </h3>
      <h1>Add Class</h1>
      <form action="">
        <div className="class-type">
          <label htmlFor="class-type"></label>
          <select name="class-type" id="class-type">
            <option value="">Class Type</option>
            <option value="hit-mania">Hit Mania</option>
            <option value="spin-class">Spin Class</option>
            <option value="yoga">Yoga</option>
          </select>
        </div>
        <div>
          <label htmlFor="classSize"></label>
          <input
            type="number"
            id="classSize"
            name="classSize"
            min="1"
            max="100"
            placeholder="Enter class size"
            required
          />
        </div>
        <div>
          <label htmlFor="classDate"></label>
          <input type="date" id="classDate" name="classDate" required />
        </div>
        <div>
          <label htmlFor="startTime"></label>
          <input type="time" id="startTime" name="startTime" required />
        </div>
        <div className="excerpt">
          <label htmlFor="excerpt"></label>
          <input
            type="text"
            id="excerpt"
            name="excerpt"
            placeholder="Excerpt"
          />
        </div>
      </form>
    </div>
  );
};

export default AddClass;

import React from "react";

const LargeFilterContainer = ({ filterOptions, setFilterOptions }) => {
  //

  const handleChange = (event) => {
    const { name, value } = event.target; // Extract name and value from the event

    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      [name === "date"
        ? "classDate"
        : name === "class-name"
        ? "className"
        : "classTrainer"]: name === "date" ? formatDate(value) : value,
    }));
  };

  return (
    <div className="filter-container">
      {/* Filter Options */}
      <div className="filter-box">
        <label htmlFor="class-name">Classes:</label>
        <select id="class-name" name="class-name" onChange={handleChange}>
          <option value="All Classes">-</option>
          <option value="All Classes"> All Classes</option>
          <option value="Spin Class">Spin Class</option>
          <option value="Yoga">Yoga</option>
          <option value="Hiit Mania">Hiit Mania</option>
        </select>
      </div>
      <div className="filter-box">
        <label htmlFor="trainer">Trainer:</label>
        <select id="trainer" name="trainer" onChange={handleChange}>
          <option value="">All Trainers</option>
          <option value="Zaid Hassan">Zaid</option>
          <option value="Steve Hox">Steve</option>
          <option value="Sydney Beth">Sydney</option>
        </select>
      </div>
      <div className="filter-box">
        <label htmlFor="date">Date:</label>
        <input type="date" id="date" name="date" onChange={handleChange} />
      </div>
    </div>
  );
};

export default LargeFilterContainer;
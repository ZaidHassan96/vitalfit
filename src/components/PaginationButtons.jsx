import React from "react";

const PaginationButtons = ({
  setCurrentPage,
  currentPage,
  filteredClasses,
  classesPerPage,
}) => {
  return (
    <div className="pagination-controls">
      <p
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1} // back button disabled if on first page
      >
        {"<"}
      </p>
      <span>
        Page {currentPage} of{" "}
        {Math.ceil(filteredClasses.length / classesPerPage)}
      </span>
      <p
        onClick={() =>
          setCurrentPage((prev) =>
            Math.min(
              prev + 1,
              Math.ceil(filteredClasses.length / classesPerPage)
            )
          )
        }
        disabled={
          currentPage === Math.ceil(filteredClasses.length / classesPerPage)
        } // button disabled if on last page
      >
        {">"}
      </p>
    </div>
  );
};

export default PaginationButtons;

import "../stylesheets/SingleEventCard.css";

const SingleEventCard = () => {
  return (
    <>
      <div className="card">
        <img src="../images/projects.jpg" alt="" />
        <div className="info">
          <h1>Hit Mania</h1>
          <h3>Sun, 20 Oct, 10:00</h3>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
    </>
  );
};

export default SingleEventCard;

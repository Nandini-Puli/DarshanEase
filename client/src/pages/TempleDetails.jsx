import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./TempleDetails.css";

function TempleDetails() {
  const { id } = useParams();

  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemple = async () => {
      try {
        const res = await API.get(`/temples/${id}`);
        setTemple(res.data?.temple || res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemple();
  }, [id]);

  if (loading) {
    return <><Navbar /><h2>Loading...</h2></>;
  }

  if (!temple) {
    return <><Navbar /><h2>Temple Not Found</h2></>;
  }

  return (
    <><Navbar /><div className="details-page">
      <div className="details-box">

        <div className="top-section">

          <div className="description">
            <h2>Description</h2>
            <hr />

            <p>{temple.description}</p>
            <Link to={`/donate/${temple._id}`}>
              <button>Donate to this temple</button>
            </Link>
          </div>

          <div className="info">
            <h2>Temple Info</h2>
            <hr />

            <p>
              <b>Open :</b> {temple.openTime}
            </p>

            <p>
              <b>Close :</b> {temple.closeTime}
            </p>

            <p>
              <b>Organizer :</b> {temple.organizerName}
            </p>

            <p>
              <b>Location :</b> {temple.location}
            </p>
          </div>

        </div>

        <h1 className="darshan-title">
          Darshans
        </h1>

        <div className="cards">

          {temple.darshans?.length === 0 ? (
            <h3>No Darshans Available</h3>
          ) : (
            temple.darshans?.map((darshan) => (

              <div
                className="card"
                key={darshan._id}
              >

                <h2>{darshan.darshanName}</h2>

                <p>
                  <b>Date :</b> {new Date(darshan.date).toLocaleDateString()}
                </p>
                <p>
                  <b>Start Time :</b> {darshan.startTime}
                </p>
                <p>
                  <b>End Time :</b> {darshan.endTime}
                </p>
                <p>
                  <b>Available Seats :</b> {darshan.availableSeats}
                </p>
                <p>
                  <b>Booked Seats :</b> {darshan.bookedSeats}
                </p>
                <p>
                  <b>Price :</b> ₹{darshan.price}
                </p>

                <p>
                  <b>Description :</b>
                  {" "}
                  {darshan.description}
                </p>

                <Link to={`/booking/${temple._id}/${darshan._id}`}>
                  <button>
                    Book Now
                  </button>
                </Link>

              </div>

            ))
          )}

        </div>

      </div>
    </div><Footer /></>
  );
}

export default TempleDetails;

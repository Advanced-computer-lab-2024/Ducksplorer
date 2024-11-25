import { React, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  TextField,
} from "@mui/material";

const ActivityCard = ({ activity }) => {
  const [activities, setActivities] = useState([]);

  const getActivities = async () => {
    try {
      const response = await fetch("http://localhost:8000/activities");
      const data = await response.json();
      setActivities(data);
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Card
      className="product-card"
      style={{
        position: "relative",
        borderRadius: "3cap",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
        height: "600px",
        maxWidth: "30%",
      }}
    >
      <div style={{ overflow: "auto", height: "100%" }}>
        <div
          style={{
            backgroundColor: "hsl(51, 100%, 50%)",
            height: "75px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            display: "flex",
            justifyContent: "center",

            alignItems: "center",
          }}
        >
          <h2 style={{ textAlign: "center" }}>Activity Test</h2>
        </div>
        <CardContent>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            test
          </Typography>
          <div
            id="myCarousel"
            class="carousel slide mb-6"
            data-bs-ride="carousel"
            style={{ height: "100%", width: "100%", margin: "0px" }}
          >
            <div class="carousel-indicators">
              <button
                type="button"
                data-bs-target="#myCarousel"
                data-bs-slide-to="0"
                class=""
                aria-label="Slide 1"
              ></button>
              <button
                type="button"
                data-bs-target="#myCarousel"
                data-bs-slide-to="1"
                aria-label="Slide 2"
                class="active"
                aria-current="true"
              ></button>
              <button
                type="button"
                data-bs-target="#myCarousel"
                data-bs-slide-to="2"
                aria-label="Slide 3"
                class=""
              ></button>
            </div>
            <div class="carousel-inner">
              <div class="carousel-item">
                <svg
                  class="bd-placeholder-img"
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  preserveAspectRatio="xMidYMid slice"
                  focusable="false"
                >
                  <rect
                    width="100%"
                    height="100%"
                    fill="var(--bs-secondary-color)"
                  ></rect>
                </svg>
                <div class="container">
                  <div class="carousel-caption text-start">
                    <h1>Example headline.</h1>
                    <p class="opacity-75">
                      Some representative placeholder content for the first
                      slide of the carousel.
                    </p>
                    <p>
                      <a class="btn btn-lg btn-primary" href="#">
                        Sign up today
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div class="carousel-item active">
                <svg
                  class="bd-placeholder-img"
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  preserveAspectRatio="xMidYMid slice"
                  focusable="false"
                >
                  <rect
                    width="100%"
                    height="100%"
                    fill="var(--bs-secondary-color)"
                  ></rect>
                </svg>
                <div class="container">
                  <div class="carousel-caption">
                    <h1>Another example headline.</h1>
                    <p>
                      Some representative placeholder content for the second
                      slide of the carousel.
                    </p>
                    <p>
                      <a class="btn btn-lg btn-primary" href="#">
                        Learn more
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div class="carousel-item">
                <svg
                  class="bd-placeholder-img"
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  preserveAspectRatio="xMidYMid slice"
                  focusable="false"
                >
                  <rect
                    width="100%"
                    height="100%"
                    fill="var(--bs-secondary-color)"
                  ></rect>
                </svg>
                <div class="container">
                  <div class="carousel-caption text-end">
                    <h1>One more for good measure.</h1>
                    <p>
                      Some representative placeholder content for the third
                      slide of this carousel.
                    </p>
                    <p>
                      <a class="btn btn-lg btn-primary" href="#">
                        Browse gallery
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#myCarousel"
              data-bs-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#myCarousel"
              data-bs-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ActivityCard;

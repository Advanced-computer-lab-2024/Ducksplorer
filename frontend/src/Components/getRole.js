import { useState, useEffect } from "react";
import axios from "axios";
//import { message } from "antd";

const useUserRole = () => {
  const [userRole, setUserRole] = useState("");
  const isGuest = localStorage.getItem("guest") === "true";

  useEffect(() => {
    if(!isGuest)
{    const fetchUserRole = async () => { 
      const userJson = localStorage.getItem("user");
      const user = JSON.parse(userJson);
      const userName = user.username;
      if (userName) {
        axios
          .get(`http://localhost:8000/users/${userName}`)
          .then((response) => {
            console.log(response.data[0].role);
            setUserRole(response.data[0].role);
          })
          .catch((error) => {
            console.error("There was an error fetching the role!", error);
          });
      }
    };

    fetchUserRole();}
  }, []);

  return userRole;
};

export default useUserRole;

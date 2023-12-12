import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function isEmptyObject(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

const UserForm = () => {
  const navigate = useNavigate();

  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [profilepicture, setProfilePicture] = useState("");
  const [resume, setResume] = useState("");
  const [address, setAddress] = useState("");

  const getCountry = async () => {
    const response = await fetch("http://localhost:4500/country");
    const data = await response.json();
    setCountry(data);
  };

  const getState = async () => {
    const response = await fetch("http://localhost:4500/state");
    const data = await response.json();
    setState(data);
  };

  const getCity = async () => {
    const response = await fetch("http://localhost:4500/city");
    const data = await response.json();
    setCity(data);
  };

  useEffect(() => {
    getCountry();
    getState();
    getCity();
  }, []);

  const handleBack = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setProfilePicture("");
    setResume("");
    setAddress("");
    setSelectedCountryId("");
    setSelectedStateId("");
    setSelectedCityId("");
    navigate("/user");
  };

  const location = useLocation();
  const { data } = location.state || { data: {} };
  const isEditing = !isEmptyObject(data);

  useEffect(() => {
    setFirstName(data.firstname || '');
    setLastName(data.lastname || '');
    setEmail(data.email || '');
    setPhoneNumber(data.phonenumber || '');
    setAddress(data.address || '');
    setSelectedCountryId(data.countryid || '');
    setSelectedStateId(data.stateid || '');
    setSelectedCityId(data.cityid || '');
  }, []);

  const [userdata, setUserData] = useState([]);

  const getUserData = async () => {
    const response = await fetch("http://localhost:4500/user");
    const data = await response.json();
    setUserData(data);
  };

  useEffect(() => {
    getUserData();
  }, []);

  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
     const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isValidPhoneNumber = /^\d{10}$/.test(phonenumber);
    if (
      firstname === "" ||
      lastname === "" ||
      email === "" ||
      !isValidEmail ||
      !isValidPhoneNumber ||
      phonenumber === "" ||
      profilepicture === "" ||
      resume === "" ||
      address === "" ||
      selectedStateId === "" ||
      selectedCityId === "" ||
      selectedCountryId === ""
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [
    firstname,
    lastname,
    email,
    phonenumber,
    profilepicture,
    resume,
    address,
    selectedCityId,
    selectedStateId,
    selectedCountryId,
  ]);

  const createUser = async () => {
    try {
      const formData = new FormData();
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("email", email);
      formData.append("phonenumber", phonenumber);
      formData.append("profilepicture", profilepicture);
      formData.append("resume", resume);
      formData.append("selectedCountryId", selectedCountryId);
      formData.append("selectedStateId", selectedStateId);
      formData.append("selectedCityId", selectedCityId);
      formData.append("address", address);

      const response = await fetch("http://localhost:4500/user", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        const newUserId = data.userid;

        const newUser = {
          userid: newUserId,
          firstname,
          lastname,
          email,
          phonenumber,
          profilepicture,
          resume,
          address,
          selectedCountryId,
          selectedStateId,
          selectedCityId,
        };
        setUserData([...userdata, newUser]);
        navigate("/user");
        toast.success("User Added Successfully");
      } else {
        const errorData = await response.json();
        console.error("Error creating User:", errorData);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleUser = async (e) => {
    e.preventDefault();
    try {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isValidPhoneNumber = /^\d{10}$/.test(phonenumber);

      if (!isValidEmail) {
        toast.error("Invalid email format");
        return;
      }

      if (!isValidPhoneNumber) {
        toast.error("Invalid phone number format");
        return;
      }
      const emailExists = userdata.some((user) => user.email === email);
      const phoneExists = userdata.some(
        (user) => user.phonenumber === phonenumber
      );

      if (emailExists) {
        toast.error("Email already exists");
        return;
      }

      if (phoneExists) {
        toast.error("Phone number already exists");
        return;
      }
      await createUser();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdate = async (e, userId) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("email", email);
      formData.append("phonenumber", phonenumber);
      formData.append("profilepicture", profilepicture );
      formData.append("resume", resume);
      formData.append("selectedCountryId", selectedCountryId);
      formData.append("selectedStateId", selectedStateId);
      formData.append("selectedCityId", selectedCityId);
      formData.append("address", address);
       
      const response = await fetch(`http://localhost:4500/user/${userId}`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        toast.success("User Update Successfully");
        getUserData();
        navigate("/user");
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  return (
    <>
      <Box
        sx={{
          m: "15rem",
          mt: "10rem",
          padding: "20px",
          border: "1px solid gray",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ marginLeft: "10px" }}>
          {isEditing ? "Edit-User" : "Add-User"}
        </h2>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "2rem",
              mb: "15px",
            }}
          >
            <TextField
              label="First Name"
              variant="outlined"
              value={firstname}
              fullWidth
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              value={lastname}
              fullWidth
              onChange={(e) => setLastName(e.target.value)}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "2rem",
              mb: "15px",
            }}
          >
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="PhoneNumber"
              variant="outlined"
              value={phonenumber}
              type="number"
              fullWidth
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "2rem",
              mb: "15px",
            }}
          >
            {/* Select Country */}
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel id="select-country-label">Select Country</InputLabel>
              <Select
                labelId="select-country-label"
                id="select-country"
                label="Select Country"
                value={selectedCountryId}
                onChange={(e) => setSelectedCountryId(e.target.value)}
                sx={{ width: "40.7rem" }}
              >
                {country.map((countries) => (
                  <MenuItem
                    key={countries.countryid}
                    value={countries.countryid}
                  >
                    {countries.countryname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* State Select */}
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel id="select-state-label">Select State</InputLabel>
              <Select
                labelId="select-state-label"
                id="select-state"
                label="Select State"
                value={selectedStateId}
                onChange={(e) => setSelectedStateId(e.target.value)}
                sx={{ width: "40.7rem" }}
              >
                {state
                  .filter((state) => state.countryid === selectedCountryId)
                  .map((state, index) => (
                    <MenuItem key={index} value={state.stateid}>
                      {state.statename}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "2rem",
              mb: "15px",
            }}
          >
            {/* City Select */}
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel id="select-city-label">Select City</InputLabel>
              <Select
                labelId="select-city-label"
                id="select-city"
                label="Select City"
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
                sx={{ width: "40.7rem" }}
              >
                {city
                  .filter((city) => city.stateid === selectedStateId)
                  .map((city, index) => (
                    <MenuItem key={index} value={city.cityid}>
                      {city.cityname}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              label="Address"
              variant="outlined"
              sx={{ width: "40.7rem" }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              multiline
              // rows={3}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "2rem",
              mb: "15px",
            }}
          >
            <Box>
              <InputLabel>Upload Resume</InputLabel>
              <TextField
                variant="outlined"
                sx={{ width: "40.7rem" }}
                accept=".pdf,.docx"
                onChange={(e) => setResume(e.target.files[0])}
                type="file"
              />
            </Box>
            <Box>
              <InputLabel>ProfilePicture</InputLabel>
              <TextField
                variant="outlined"
                sx={{ width: "40.7rem" }}
                type="file"
                accept=".jpg,.png"
                onChange={(e) => setProfilePicture(e.target.files[0])}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              mt: "1rem",
            }}
          >
            <Button
              sx={{ width: "6rem" }}
              variant="contained"
              disabled={isDisabled}
              onClick={(e) =>
                isEditing ? handleUpdate(e, data.userid) : handleUser(e)
              }
            >
              {isEditing ? "Update" : "Add"}
            </Button>
            {isEditing ? (
              ""
            ) : (
              <Button variant="contained" onClick={handleBack}>
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default UserForm;
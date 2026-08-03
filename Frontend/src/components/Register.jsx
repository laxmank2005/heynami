import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const Register = () => {
  const [user, setUser] = React.useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const navigate = useNavigate();

  const handleCheckbox = (gender) => {
    setUser({ ...user, gender });
  };

  const onSubmithHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/register",
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.log(error);
    }

    setUser({
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: "",
    });
  };

  return (
    <div className="min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md">
        <h1 className="text-3xl text-[#6087D0] font-bold text-center">
          Signup
        </h1>
        <form onSubmit={onSubmithHandler} action="">
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Full Name</span>
            </label>

            <input
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className="input w-full input-bordered h-10"
              type="text"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>

            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="input w-full input-bordered h-10"
              type="text"
              placeholder="Username"
            />
          </div>

          <div>
            <label className="label p-2">
              <span className="text-base label-text">Password</span>
            </label>

            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="input w-full input-bordered h-10"
              type="password"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="label p-2">
              <span className="text-base label-text">Confirm Password</span>
            </label>

            <input
              value={user.confirmPassword}
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
              className="input w-full input-bordered h-10"
              type="password"
              placeholder="Confirm Password"
            />
          </div>

          <div className="flex items-center justify-start gap-4 mt-4">
            <div className="flex items-center">
              <p>Male</p>
              <input
                type="checkbox"
                checked={user.gender === "male"}
                onChange={() => handleCheckbox("male")}
                className="checkbox checkbox-sm mx-2"
              />
            </div>

            <div className="flex items-center">
              <p>Female</p>
              <input
                type="checkbox"
                checked={user.gender === "female"}
                onChange={() => handleCheckbox("female")}
                className="checkbox checkbox-sm mx-2"
              />
            </div>
          </div>

          <p className="text-center mt-2">
            Already have an account?
            <Link to="/login" className="text-sm hover:underline">
              <span className="text-[#6087D0]">Login</span>
            </Link>
          </p>

          <div className="">
            <button
              type="submit"
              className="btn btn-block mt-4 bg-[#6087D0] text-white h-10 rounded-md border-gray-200 hover:bg-[#3f5a9e] transition-all duration-300 cursor-pointer"
            >
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Register;

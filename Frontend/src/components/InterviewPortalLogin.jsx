import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useNavigation, useParams } from "react-router-dom";

function InterviewPortalLogin() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {token} = useParams()

  const data = useSelector((state) => state.room);
  // const dispatch = useDispatch();
  
  const onSubmit = (data) => {
    if(!token){
        alert("put valid token")
    }
    
    navigate("/roomid");
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 p-6 rounded shadow-md"
      >
        <input
          type="text"
          placeholder="Enter name"
          {...register("name", { required: "Name is required" })}
          className="mb-2 p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input
          type="email"
          placeholder="Enter email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
          className="mb-2 p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Enter password"
          {...register("password", { required: "Password is required" })}
          className="mb-2 p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default InterviewPortalLogin;

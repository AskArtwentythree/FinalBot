import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { currentUser, signInAnonymously } = UserAuth();

  const handleLogin = async () => {
    try {
      await signInAnonymously();
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(currentUser) {
      navigate("/chat")
    }
  }, [currentUser]);

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there 👋🏻</h1>
          <p className="py-6">
          Ask Customer Support Chat Bot and get the answer for any question that you want.
          </p>
          <button onClick={handleLogin} className="btn">Login With Google</button>
        </div>
      </div>
    </div>
  );
};

export default Login;

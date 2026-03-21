import { Link } from "react-router-dom";

export const Signup = () => {
  return (
    <div className="text-white text-xl">
      <p>
        Signup page
      </p>
      <span>
        Already have an account? <Link to="/login" className="cursor-pointer text-blue-600 hover:text-blue-400">Log In</Link>
      </span>
    </div>
  );
};

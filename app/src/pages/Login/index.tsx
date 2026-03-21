import { Link } from "react-router-dom";

export const Login = () => {
  return (
    <div className="text-white text-xl">
      <p>
        Login Page
      </p>
      <span>
        Don't have an account? <Link className="cursor-pointer text-blue-600 hover:text-blue-400" to="/register">Create One</Link>
      </span>
    </div>
  )
};

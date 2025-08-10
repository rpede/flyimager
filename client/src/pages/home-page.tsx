import { Link } from "react-router";

export function HomePage() {
  const user = null as any;
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">
            Welcome to <span className="text-primary">Fly Imager</span>
          </h2>
          {user ? (
            <Link to="/uploads">Show uploads</Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-secondary">
                Sign-up
              </Link>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

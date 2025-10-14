import { Link, useLoaderData } from "react-router";
import { Api } from "../generated-client";

export async function homePageLoader() {
  try {
    return await new Api({ baseUrl: "/api" }).manage.infoList();
  } catch {
    return null;
  }
}

export function HomePage() {
  const user = useLoaderData<typeof homePageLoader>();
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">
            Welcome to <span className="text-primary">Fly Imager</span>
          </h2>
          {user ? (
            <Link to="/uploads" className="btn btn-primary">
              Show uploads
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-secondary">
                Register
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

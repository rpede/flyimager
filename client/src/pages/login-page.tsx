import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Api, type LoginRequest } from "../generated-client";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    const promise = new Api({ baseUrl: "/api" }).login.loginCreate(data, { useSessionCookies: true })
      .catch((reason) => {
        if ((reason?.message ?? "").startsWith("JSON.parse")) return null;
        else throw reason;
      });
    await toast.promise(promise, {
      success: "Login successful",
      error: "Login failed",
      loading: "Authenticating...",
    });
    navigate("/uploads");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                required
                className={`input input-bordered ${errors.email && "input-error"}`}
                {...register("email", { required: true })}
              />
              <small className="text-error">{errors.email?.message}</small>
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className={`input input-bordered ${errors.password && "input-error"}`}
                {...register("password", { required: true })}
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
              <small className="text-error">{errors.email?.message}</small>
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

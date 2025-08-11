import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { ApiApi, type LoginRequest, type RegisterRequest } from "../api";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const onSubmit: SubmitHandler<RegisterRequest> = async (data) => {
    const promise = new ApiApi().registerPost({
      registerRequest: data,
    });
    await toast.promise(promise, {
      success: "Registration successfully",
      error: "Registration failed",
      loading: "Creating account...",
    });
    navigate("/login");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className={`input input-bordered ${
                  errors.email && "input-error"
                }`}
                {...register("email", { required: true })}
              />
            </div>

            {/* Password */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered ${
                  errors.password && "input-error"
                }`}
                {...register("password", { required: true })}
              />
            </div>

            {/* Submit */}
            <div className="form-control mt-6">
              <button className="btn btn-primary">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

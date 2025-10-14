import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Api } from "../generated-client";

type FormFields = { title: string; file: FileList };

export function UploadCreatePage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const promise = new Api({ baseUrl: "/api" }).upload.uploadCreate({
      title: data.title,
      file: data.file[0],
    });
    await toast.promise(promise, {
      success: "Upload successful",
      error: "Upload failed",
      loading: "Uploading...",
    });
    navigate("/uploads");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="card shadow-xl bg-base-100">
          <div className="card-body">
            <h1 className="card-title text-2xl md:text-3xl">Upload an Image</h1>

            <div className="divider" />

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="label">
                  <span className="label-text">Image Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter image title"
                  className="input input-bordered w-full"
                  {...register("title", { required: true })}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Choose Image</span>
                </label>

                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered w-full"
                      {...register("file", { required: true })}
                    />
                    <p className="text-xs opacity-60 mt-2">
                      Supported formats: JPG, PNG, GIF.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Link to="/uploads" type="button" className="btn btn-ghost">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

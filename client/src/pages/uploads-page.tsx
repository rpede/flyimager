import { Link, useLoaderData, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Api } from "../generated-client";

export async function uploadsLoader() {
  const result = await (new Api({ baseUrl: "/api" }).upload.uploadList());
  return result.data;
}

export default function UploadsPage() {
  const navigate = useNavigate();
  const uploads = useLoaderData<typeof uploadsLoader>();

  const shareLink = (id: string) => {
    const link = `${location.origin}/api/upload/${id}`;
    navigator.clipboard.writeText(link);
    toast("Link copied to clipboard!");
  };

  const deleteFile = async (key: string) => {
    await new Api({ baseUrl: "/api" }).upload.uploadDelete(key);
    navigate(".");
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">File Uploads</h1>
          <Link to="/uploads/create" className="btn btn-primary">
            Upload
          </Link>
        </div>

        <div className="overflow-x-auto bg-base-100 shadow-xl rounded-lg">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Timestamp</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((file, index) => (
                <tr key={index}>
                  <td>{file.title}</td>
                  <td>
                    {new Date(file.uploadedAt).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-error"
                      onClick={() => deleteFile(file.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-primary ml-2"
                      onClick={() => shareLink(file.id)}
                    >
                      Share
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

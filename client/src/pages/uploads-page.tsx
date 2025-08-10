import { useLoaderData } from "react-router";
import { UploadApi } from "../api";

export async function uploadsLoader() {
  const result = await new UploadApi().apiUploadGet();
  return result;
}

export default function UploadsPage() {
  const uploads = useLoaderData<typeof uploadsLoader>();

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">File Uploads</h1>
          <button className="btn btn-primary">Upload</button>
        </div>

        <div className="overflow-x-auto bg-base-100 shadow-xl rounded-lg">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="w-full">Title</th>
                <th>Timestamp</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((file, index) => (
                <tr key={index}>
                  <td>{file.title}</td>
                  <td>{file.uploadedAt.toISOString()}</td>
                  <td>{file.contentType}</td>
                  <td>
                    <a
                      className="btn btn-secondary"
                      href={"/api/upload/" + file.id}
                    >
                      Download
                    </a>
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

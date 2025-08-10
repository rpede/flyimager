export default function UploadsPage() {
  // Example static data
  const uploads = [
    { title: "Report Q1.pdf", timestamp: "2025-08-01 10:15", type: "PDF" },
    { title: "Team Photo.jpg", timestamp: "2025-08-03 14:42", type: "Image" },
    {
      title: "Presentation.pptx",
      timestamp: "2025-08-05 09:20",
      type: "Presentation",
    },
  ];

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
                <th>Title</th>
                <th>Timestamp</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((file, index) => (
                <tr key={index}>
                  <td>{file.title}</td>
                  <td>{file.timestamp}</td>
                  <td>{file.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

namespace Api.Models;

public record FileDto(
    string Id,
    string Title,
    string FileName,
    string ContentType,
    long Length,
    DateTime UploadedAt,
    string Uploader
);
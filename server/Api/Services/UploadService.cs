using Api.Models;
using DataAccess;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public interface IUploadService
{
    public bool IsContentTypeSupported(IFormFile file);
    public Task<(string contentType, Stream stream)> Get(string key);
    public Task Create(string currentUserId, string title, IFormFile file);
    public IEnumerable<FileDto> List(string currentUserId);
    public Task Delete(string CurrentUserId, string key);
}

public class UploadService(AppDbContext db, IStorageService storage, IImageService image)
    : IUploadService
{
    public bool IsContentTypeSupported(IFormFile file) => file.ContentType.StartsWith("image/");

    public async Task Create(string currentUserId, string title, IFormFile file)
    {
        var meta = new UploadedFile
        {
            Title = title,
            FileName = file.FileName,
            Length = file.Length,
            UserId = currentUserId!,
            ContentType = image.OutputContentType,
            UploadedAt = DateTime.UtcNow,
        };
        await db.AddAsync(meta);
        await db.SaveChangesAsync();
        await using var origStream = file.OpenReadStream();
        using var processedStream = image.Process(origStream);
        await storage.SaveAsync(meta.Id, processedStream);
    }

    public IEnumerable<FileDto> List(string currentUserId)
    {
        return db
            .Files.Where(x => x.UserId == currentUserId)
            .Select(x => new FileDto(
                x.Id,
                x.Title,
                x.FileName,
                x.ContentType,
                x.Length,
                x.UploadedAt,
                x.User.UserName!
            ));
    }

    public async Task<(string contentType, Stream stream)> Get(string key)
    {
        var contentType = await db
            .Files.Where(x => x.Id == key)
            .Select(x => x.ContentType)
            .SingleAsync();
        var stream = await storage.GetObjectAsync(key);
        return (contentType, stream);
    }

    public async Task Delete(string CurrentUserId, string key)
    {
        var file = await db.Files.SingleAsync(x => x.UserId == CurrentUserId && x.Id == key);
        db.Remove(file);
        await db.SaveChangesAsync();
    }
}

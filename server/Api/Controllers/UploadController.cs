using System.Security.Claims;
using Api.Models;
using Api.Services;
using DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UploadController(AppDbContext db, IStorageService storage, IImageService image)
    : ControllerBase
{
    private string? CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier);

    [HttpPost]
    public async Task<IActionResult> UploadFile([FromForm] string title, IFormFile file)
    {
        if (!file.ContentType.StartsWith("image/"))
        {
            return BadRequest($"Unsupported Content-Type \"{file.ContentType}\"");
        }
        var meta = new UploadedFile
        {
            Title = title,
            FileName = file.FileName,
            Length = file.Length,
            UserId = CurrentUserId!,
            ContentType = image.OutputContentType,
        };
        await db.AddAsync(meta);
        await db.SaveChangesAsync();
        await using var origStream = file.OpenReadStream();
        using var processedStream = image.Process(origStream);
        await storage.SaveAsync(meta.Id, processedStream);
        return Created();
    }

    [HttpGet]
    public IEnumerable<FileDto> GetUploads()
    {
        return db
            .Files.Where(x => x.UserId == CurrentUserId)
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

    [AllowAnonymous]
    [HttpGet("{key}")]
    public async Task<IActionResult> GetUpload(string key)
    {
        var contentType = await db
            .Files.Where(x => x.Id == key)
            .Select(x => x.ContentType)
            .SingleAsync();
        var stream = await storage.GetObjectAsync(key);
        return File(stream, contentType, key);
    }
}

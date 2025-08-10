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
[Route("[controller]")]
public class UploadController(AppDbContext db, IStorage storage) : ControllerBase
{
    private string? CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier);

    [HttpPost]
    public async Task<IActionResult> UploadFile([FromForm] string title, IFormFile file)
    {
        var meta = new UploadedFile
        {
            Title = title,
            FileName = file.FileName,
            ContentType = file.ContentType,
            Length = file.Length,
            UserId = CurrentUserId!,
        };
        await db.AddAsync(meta);
        await db.SaveChangesAsync();
        await using (var stream = file.OpenReadStream())
        {
            await storage.SaveAsync(meta.Id, stream);
        }

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


using System.Security.Claims;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class UploadController(IUploadService service) : ControllerBase
{
    private string? CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier);

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] string title, IFormFile file)
    {
        if (!service.IsContentTypeSupported(file))
            return BadRequest($"{file.ContentType} is not supported");
        await service.Create(CurrentUserId!, title, file);
        return Created();
    }

    [HttpGet]
    public IEnumerable<FileDto> List() => service.List(CurrentUserId!);

    [AllowAnonymous]
    [HttpGet("{key}")]
    public async Task Get(string key)
    {
        (string contentType, Stream stream) = await service.Get(key);
        Response.StatusCode = 200;
        Response.ContentType = contentType;
        await stream.CopyToAsync(Response.Body);
    }

    [AllowAnonymous]
    [HttpGet("attachment/{key}")]
    public async Task<FileStreamResult> Download(string key)
    {
        (string contentType, Stream stream) = await service.Get(key);
        return File(stream, contentType, key);
    }

    [HttpDelete("{key}")]
    public async Task<IActionResult> Delete(string key)
    {
        await service.Delete(CurrentUserId!, key);
        return NoContent();
    }
}

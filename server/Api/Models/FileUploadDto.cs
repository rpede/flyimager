using System.ComponentModel.DataAnnotations;

namespace Api.Models;

public record FileUploadDto([Required] string Title, [Required] IFormFile File);
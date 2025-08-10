using Microsoft.AspNetCore.Identity;

namespace DataAccess;

public class User : IdentityUser
{
    public ICollection<UploadedFile> UploadedFiles { get; set; }
}
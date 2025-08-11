using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

namespace Api.Services;

public interface IImageService
{
    public Stream Process(Stream imageStream);
    string OutputContentType { get; }
}

public class ImageService : IImageService
{
    public string OutputContentType => "image/jpeg";

    public Stream Process(Stream imageStream)
    {
        using var image = Image.Load(imageStream);
        image.Mutate(x =>
            x.Resize(new ResizeOptions { Size = new Size(1280, 720), Mode = ResizeMode.Max })
        );
        var outputStream = new MemoryStream();
        image.Save(outputStream, new JpegEncoder { Quality = 90 });
        return outputStream;
    }
}

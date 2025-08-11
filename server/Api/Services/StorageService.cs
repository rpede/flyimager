using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;

namespace Api.Services;

public class S3Options
{
    public string AwsAccessKeyId { get; set; } = null!;
    public string AwsEndpointUrlS3 { get; set; } = null!;
    public string AwsSecretAccessKey { get; set; } = null!;
    public string BucketName { get; set; } = null!;
}

public interface IStorageService
{
    public Task<List<S3Bucket>> ListBucketsAsync();
    public Task<string> SaveAsync(string key, Stream content);
    public Task<Stream> GetObjectAsync(string key);
    public Task<List<S3Object>> ListObjectsAsync();
}

public class S3StorageService : IStorageService, IDisposable
{
    private readonly string bucketName;
    private readonly IAmazonS3 s3Client;

    public S3StorageService(IOptions<S3Options> options)
    {
        bucketName = options.Value.BucketName;
        s3Client = new AmazonS3Client(
            options.Value.AwsAccessKeyId,
            options.Value.AwsSecretAccessKey,
            new AmazonS3Config { ServiceURL = options.Value.AwsEndpointUrlS3, UseHttp = false }
        );
    }

    public void Dispose()
    {
        s3Client.Dispose();
    }

    public async Task<List<S3Bucket>> ListBucketsAsync()
    {
        var listResponse = await s3Client.ListBucketsAsync();
        var buckets = listResponse.Buckets;
        return buckets;
    }

    public async Task<string> SaveAsync(string key, Stream content)
    {
        var putObjectRequest = new PutObjectRequest
        {
            BucketName = bucketName,
            Key = key,
            InputStream = content,
            UseChunkEncoding = false,
        };

        var responsePut = await s3Client.PutObjectAsync(putObjectRequest);
        return responsePut.ETag;
    }

    public async Task<Stream> GetObjectAsync(string key)
    {
        var getRequest = new GetObjectRequest { BucketName = bucketName, Key = key };
        var responseGet = await s3Client.GetObjectAsync(getRequest);
        return responseGet.ResponseStream;
    }

    public async Task<List<S3Object>> ListObjectsAsync()
    {
        var request = new ListObjectsV2Request { BucketName = bucketName };
        var response = await s3Client.ListObjectsV2Async(request);
        return response.S3Objects;
    }
}

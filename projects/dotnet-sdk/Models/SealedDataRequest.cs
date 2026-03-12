// ReSharper disable CollectionNeverUpdated.Global
namespace dotnet_sdk.Models;

public class SealedDataRequest
{
    public required string SealedData { get; set; }
    public required List<Dictionary<string, string>> Keys { get; set; }
}

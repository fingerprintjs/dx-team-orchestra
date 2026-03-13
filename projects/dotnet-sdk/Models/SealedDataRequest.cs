// ReSharper disable CollectionNeverUpdated.Global
namespace dotnet_sdk.Models;

public class SealedDataRequest
{
    public string SealedData { get; set; }
    public List<Dictionary<string, string>> Keys { get; set; }
}

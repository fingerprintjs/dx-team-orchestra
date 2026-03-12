// ReSharper disable CollectionNeverUpdated.Global
using Microsoft.AspNetCore.Mvc;
using FingerprintPro.ServerSdk;
using FingerprintPro.ServerSdk.Model;
using dotnet_sdk.Models;

namespace dotnet_sdk.Controllers;

public class SealedDataRequest
{
    public required string SealedData { get; set; }
    public required List<Dictionary<string, string>> Keys { get; set; }
}

[ApiController]
[Route("")]
public class SealedResultsController : ControllerBase
{
    [HttpPost("/unseal")]
    public Task<IActionResult> Unseal(
        [FromBody] SealedDataRequest body
    )
    {
        try
        {
            var keysList = body.Keys.Select(dict => new Sealed.DecryptionKey(
                Convert.FromBase64String(dict["key"]),
                GetDecryptionAlgorithm(dict["algorithm"])
            )).ToArray();

            var unsealedData = Sealed.UnsealEventResponse(Convert.FromBase64String(body.SealedData), keysList);

            var response = new MusicianResponse<EventsGetResponse>(System.Net.HttpStatusCode.OK, unsealedData.ToJson(), unsealedData);
            return Task.FromResult<IActionResult>(Ok(response));
        }
        catch (Exception e) {
            return Task.FromResult<IActionResult>(Ok(Utils.ProcessException(e)));
        }

    }

    private Sealed.DecryptionAlgorithm GetDecryptionAlgorithm(string algorithm) => algorithm switch
    {
        "aes-256-gcm" => Sealed.DecryptionAlgorithm.Aes256Gcm,
        _ => throw new Exception("Unknown Decryption Algorithm")
    };

}

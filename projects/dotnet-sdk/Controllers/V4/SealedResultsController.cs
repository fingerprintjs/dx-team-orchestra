using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Fingerprint.ServerSdk;
using Fingerprint.ServerSdk.Model;
using dotnet_sdk.Models;

namespace dotnet_sdk.Controllers.V4;

[ApiController]
[Route("v4")]
public class SealedResultsController : ControllerBase
{
    [HttpPost("unseal")]
    public Task<IActionResult> Unseal(
        [FromBody] SealedDataRequest body)
    {
        try
        {
            var keysList = body.Keys.Select(dict => new Sealed.DecryptionKey(
                Convert.FromBase64String(dict["key"]),
                GetDecryptionAlgorithm(dict["algorithm"])
            )).ToArray();

            var unsealedData = Sealed.UnsealEventResponse(Convert.FromBase64String(body.SealedData), keysList);

            var response = new MusicianResponse<Event>(HttpStatusCode.OK, JsonSerializer.Serialize(unsealedData), unsealedData);
            return Task.FromResult<IActionResult>(Ok(response));
        }
        catch (Exception e)
        {
            return Task.FromResult<IActionResult>(Ok(Utils.ProcessException(e)));
        }
    }

    private static Sealed.DecryptionAlgorithm GetDecryptionAlgorithm(string algorithm) => algorithm switch
    {
        "aes-256-gcm" => Sealed.DecryptionAlgorithm.Aes256Gcm,
        _ => throw new ArgumentException($"Unknown decryption algorithm: {algorithm}", nameof(algorithm))
    };
}

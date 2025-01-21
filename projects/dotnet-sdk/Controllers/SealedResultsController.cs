using Microsoft.AspNetCore.Mvc;
using FingerprintPro.ServerSdk;
using FingerprintPro.ServerSdk.Model;
using dotnet_sdk.Models;

namespace dotnet_sdk.Controllers
{
    public class SealedDataRequest
    {
        public string SealedData { get; set; }
        public List<Dictionary<string, string>> Keys { get; set; }
    }

    [ApiController]
    [Route("")]
    public class SealedResultsController : ControllerBase
    {
        [HttpPost("/unseal")]
        public async Task<IActionResult> Unseal(
            [FromBody] SealedDataRequest body
        )
        {
            try
            {
                var keysList = body.Keys.Select(dict => new Sealed.DecryptionKey(
                    Convert.FromBase64String(dict["key"]),
                    getDecryptionAlgorythm(dict["algorithm"])
                )).ToArray();

                var unsealedData = Sealed.UnsealEventResponse(Convert.FromBase64String(body.SealedData), keysList);

                var response = new MusicianResponse<EventsGetResponse>(System.Net.HttpStatusCode.OK, unsealedData.ToJson(), unsealedData);
                return Ok(response);
            }
            catch (Exception e) {
                return Ok(Utils.ProcessException(e));
            }

        }

        private Sealed.DecryptionAlgorithm getDecryptionAlgorythm(string algorythm) {
            switch(algorythm) {
                case "aes-256-gcm":
                    return Sealed.DecryptionAlgorithm.Aes256Gcm;
                default:
                    throw new Exception("Unknown Decryption Algorythm");
            }
        }
    }
}

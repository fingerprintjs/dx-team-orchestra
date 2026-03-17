using Fingerprint.ServerSdk.Api;
using Fingerprint.ServerSdk.Client;
using Fingerprint.ServerSdk.Extensions;

namespace dotnet_sdk;

public class FingerprintV4Factory(IServiceCollection baseServices)
{
    public IFingerprintApi CreateApi(string? apiKey, string? region)
    {
        IServiceCollection services = new ServiceCollection();
        foreach (var descriptor in baseServices)
        {
            services.Add(descriptor);
        }

        services.AddFingerprint(config =>
        {
            config.AddTokens(new BearerToken(apiKey ?? ""));
            if (!string.IsNullOrEmpty(region))
            {
                try { config.Region = Regions.Parse(region); }
                catch (ArgumentException) { /* default to global region */ }
            }
        });

        var provider = services.BuildServiceProvider();
        return provider.GetRequiredService<IFingerprintApi>();
    }
}

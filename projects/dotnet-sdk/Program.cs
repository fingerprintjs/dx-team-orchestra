using dotnet_sdk;
using Fingerprint.ServerSdk.Client;
using Fingerprint.ServerSdk.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Extract V4 SDK JSON converters for enum serialization
var tempServices = new ServiceCollection();
tempServices.AddFingerprint(options =>
{
    var bearerToken1 = new BearerToken("<token>");
    options.AddTokens(bearerToken1);
});
var sdkConverters = tempServices.BuildServiceProvider()
    .GetRequiredService<JsonSerializerOptionsProvider>()
    .Options.Converters;

builder.Services.AddSingleton(new FingerprintV4Factory(builder.Services));
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        {
            // V3 SDK enum converters
            options.JsonSerializerOptions.Converters.Add(new VpnConfidenceConverter());
            options.JsonSerializerOptions.Converters.Add(new ProxyConfidenceConverter());
            options.JsonSerializerOptions.Converters.Add(new ProxyTypeConverter());
            options.JsonSerializerOptions.Converters.Add(new BotdBotResultConverter());

            // V4 SDK converters
            options.JsonSerializerOptions.Converters.Add(new DateTimeTrimTrailingZerosConverter());
            options.JsonSerializerOptions.Converters.Add(new NullableDateTimeTrimTrailingZerosConverter());

            foreach (var converter in sdkConverters)
            {
                options.JsonSerializerOptions.Converters.Add(converter);
            }
        });

var app = builder.Build();

app.MapControllers();

app.Run();

using dotnet_sdk;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        {
            // By default .NET serializes enums capitalized
            options.JsonSerializerOptions.Converters.Add(new VpnConfidenceConverter());
            options.JsonSerializerOptions.Converters.Add(new ProxyConfidenceConverter());
            options.JsonSerializerOptions.Converters.Add(new BotdBotResultConverter());
        });

var app = builder.Build();

app.MapControllers();

app.Run();

using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        {
            // By default .NET serializes enums capitalized
            options.JsonSerializerOptions.Converters.Add(new VPNConfidenceConverter());
            options.JsonSerializerOptions.Converters.Add(new ProxyConfidenceConverter());
            options.JsonSerializerOptions.Converters.Add(new BotdBotResultConverter());
        });

var app = builder.Build();

app.MapControllers();

app.Run();

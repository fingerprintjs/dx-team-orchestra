using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        {
            // By default .NET serializes enums capitalized
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
        });;

var app = builder.Build();

// app.MapGet("/", () => "Hello World!");

app.MapControllers();

app.Run();

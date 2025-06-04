using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using FingerprintPro.ServerSdk.Model;

public class VPNConfidenceConverter : JsonConverter<VPNConfidence>
{
    public override VPNConfidence Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        string value = reader.GetString();
        return value switch
        {
            "low" => VPNConfidence.Low,
            "medium" => VPNConfidence.Medium,
            "high" => VPNConfidence.High,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public override void Write(Utf8JsonWriter writer, VPNConfidence value, JsonSerializerOptions options)
    {
        string stringValue = value switch
        {
            VPNConfidence.Low => "low",
            VPNConfidence.Medium => "medium",
            VPNConfidence.High => "high",
            _ => throw new ArgumentOutOfRangeException()
        };

        writer.WriteStringValue(stringValue);
    }
}

public class ProxyConfidenceConverter : JsonConverter<ProxyConfidence>
{
    public override ProxyConfidence Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        string value = reader.GetString();
        return value switch
        {
            "low" => ProxyConfidence.Low,
            "medium" => ProxyConfidence.Medium,
            "high" => ProxyConfidence.High,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public override void Write(Utf8JsonWriter writer, ProxyConfidence value, JsonSerializerOptions options)
    {
        string stringValue = value switch
        {
            ProxyConfidence.Low => "low",
            ProxyConfidence.Medium => "medium",
            ProxyConfidence.High => "high",
            _ => throw new ArgumentOutOfRangeException()
        };

        writer.WriteStringValue(stringValue);
    }
}

public class BotdBotResultConverter : JsonConverter<BotdBotResult>
{
    public override BotdBotResult Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        string value = reader.GetString();
        return value switch
        {
            "notDetected" => BotdBotResult.NotDetected,
            "good" => BotdBotResult.Good,
            "bad" => BotdBotResult.Bad,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public override void Write(Utf8JsonWriter writer, BotdBotResult value, JsonSerializerOptions options)
    {
        string stringValue = value switch
        {
            BotdBotResult.NotDetected => "notDetected",
            BotdBotResult.Good => "good",
            BotdBotResult.Bad => "bad",
            _ => throw new ArgumentOutOfRangeException()
        };

        writer.WriteStringValue(stringValue.ToLower());
    }
}

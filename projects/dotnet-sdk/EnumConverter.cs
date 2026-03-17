using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using FingerprintPro.ServerSdk.Model;

namespace dotnet_sdk;

// .NET's default DateTime serialization includes trailing zeros in fractional seconds (like `2024-01-01T00:00:00.0000000Z`),
// but the API returns timestamps with trailing zeros trimmed (like `2024-01-01T00:00:00Z`).
// This converter makes the output matches the expected API format.
public class DateTimeTrimTrailingZerosConverter : JsonConverter<DateTime>
{
    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) =>
        DateTime.Parse(reader.GetString()!, CultureInfo.InvariantCulture);

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options) =>
        writer.WriteStringValue(FormatDateTime(value));

    internal static string FormatDateTime(DateTime value)
    {
        var formatted = value.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffffffZ", CultureInfo.InvariantCulture);
        var withoutZ = formatted[..^1].TrimEnd('0').TrimEnd('.');
        return withoutZ + "Z";
    }
}

public class NullableDateTimeTrimTrailingZerosConverter : JsonConverter<DateTime?>
{
    public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) =>
        reader.TokenType == JsonTokenType.Null ? null : DateTime.Parse(reader.GetString()!, CultureInfo.InvariantCulture);

    public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options)
    {
        if (value.HasValue)
            writer.WriteStringValue(DateTimeTrimTrailingZerosConverter.FormatDateTime(value.Value));
        else
            writer.WriteNullValue();
    }
}

public class VpnConfidenceConverter : JsonConverter<VPNConfidence>
{
    public override VPNConfidence Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
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
        var stringValue = value switch
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
        var value = reader.GetString();
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
        var stringValue = value switch
        {
            ProxyConfidence.Low => "low",
            ProxyConfidence.Medium => "medium",
            ProxyConfidence.High => "high",
            _ => throw new ArgumentOutOfRangeException()
        };

        writer.WriteStringValue(stringValue);
    }
}

public class ProxyTypeConverter : JsonConverter<ProxyDetails.ProxyTypeEnum>
{
    public override ProxyDetails.ProxyTypeEnum Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        return value switch
        {
            "residential" => ProxyDetails.ProxyTypeEnum.Residential,
            "data_center" => ProxyDetails.ProxyTypeEnum.Datacenter,
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public override void Write(Utf8JsonWriter writer, ProxyDetails.ProxyTypeEnum value, JsonSerializerOptions options)
    {
        var stringValue = value switch
        {
            ProxyDetails.ProxyTypeEnum.Residential => "residential",
            ProxyDetails.ProxyTypeEnum.Datacenter => "data_center",
            _ => throw new ArgumentOutOfRangeException()
        };

        writer.WriteStringValue(stringValue);
    }
}

public class BotdBotResultConverter : JsonConverter<BotdBotResult>
{
    public override BotdBotResult Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
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
        var stringValue = value switch
        {
            BotdBotResult.NotDetected => "notDetected",
            BotdBotResult.Good => "good",
            BotdBotResult.Bad => "bad",
            _ => throw new ArgumentOutOfRangeException()
        };

        writer.WriteStringValue(stringValue);
    }
}

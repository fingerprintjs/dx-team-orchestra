<?php

namespace PHP_SDK\Utils;

/**
 * ObjectSerializer Class Doc Comment.
 *
 * @category Class
 *
 * @author   Swagger Codegen team
 *
 * @see     https://github.com/swagger-api/swagger-codegen
 */
class ObjectSerializer
{
    /**
     * Serialize data.
     *
     * @param mixed       $data   the data to serialize
     * @param string|null $format the format of the Swagger type of the data
     *
     * @return array|object|string serialized form of $data
     */
    public static function sanitizeForSerialization(mixed $data, ?string $format = null): array|bool|object|string
    {
        if (is_scalar($data) || null === $data) {
            return $data;
        }
        if ($data instanceof \DateTime) {
            if ($format === 'date') {
                return $data->format('Y-m-d');
            } else {
                $isoFormat = $data->format('Y-m-d\TH:i:s');
                $milliseconds = str_pad($data->format('u') / 1000, 3, '0', STR_PAD_LEFT);
                return $milliseconds !== '000'
                    ? $isoFormat . '.' . rtrim($milliseconds, '0') . 'Z'
                    : $isoFormat . 'Z';
            }
        }
        if (is_array($data)) {
            foreach ($data as $property => $value) {
                if (is_scalar($value)) {
                    $data[$property] = $value;
                } else {
                    $data[$property] = self::sanitizeForSerialization($value);
                }
            }

            return $data;
        }
        if ($data instanceof \stdClass) {
            foreach ($data as $property => $value) {
                if (is_scalar($value)) {
                    $data->{$property} = $value;
                } else {
                    $data->{$property} = self::sanitizeForSerialization($value);
                }
            }

            return $data;
        }

        if (is_object($data)) {
            $class = get_class($data);
            if (enum_exists($class)) {
                return $data->value;
            }
            $values = [];
            $formats = $data::swaggerFormats();
            foreach ($data::swaggerTypes() as $property => $swaggerType) {
                $getter = $data::getters()[$property];
                $value = $data->{$getter}();
                if (null !== $value
                    && !in_array($swaggerType, ['DateTime', 'bool', 'boolean', 'byte', 'double', 'float', 'int', 'integer', 'mixed', 'number', 'object', 'string', 'void'], true)
                    && method_exists($swaggerType, 'getAllowableEnumValues')
                    && !in_array($value, $swaggerType::getAllowableEnumValues())) {
                    $imploded = implode("', '", $swaggerType::getAllowableEnumValues());

                    throw new \InvalidArgumentException("Invalid value for enum '{$swaggerType}', must be one of: '{$imploded}'");
                }
                if (null !== $value) {
                    if (is_scalar($value)) {
                        $values[$data::attributeMap()[$property]] = $value;
                    } elseif($property === 'tag' && empty($value)) {
                        $values[$data::attributeMap()[$property]] = new \stdClass();
                    } else {
                        $values[$data::attributeMap()[$property]] = self::sanitizeForSerialization($value, $swaggerType, $formats[$property]);
                    }
                }
            }

            return (object) $values;
        }
        return (string) $data;
    }
}

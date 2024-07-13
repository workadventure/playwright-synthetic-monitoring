import {z} from "zod";

export const BoolAsString = z.union([
    z.literal("true"),
    z.literal("false"),
    z.literal("0"),
    z.literal("1"),
    z.literal(""),
]);
export type BoolAsString = z.infer<typeof BoolAsString>;

export function toBool(value: BoolAsString | undefined, defaultValue: boolean): boolean {
    if (value === undefined || value === "") {
        return defaultValue;
    }
    return value === "true" || value === "1";
}

const EnvironmentVariables = z.object({
    HEADLESS: BoolAsString.optional().transform((val) => toBool(val, false)),
});

export const env = EnvironmentVariables.parse(process.env);

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

export function toNumber(value: string | undefined, defaultValue: number): number {
    if (value === undefined || value === "") {
        return defaultValue;
    }
    return Number(value);
}


const EnvironmentVariables = z.object({
    MONITORING_INTERVAL: z.string().optional().transform((val) => toNumber(val, 300)),
});

export const env = EnvironmentVariables.parse(process.env);

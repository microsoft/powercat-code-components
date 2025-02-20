// @ts-nocheck
export type NarrowedPropertyKeys<T, V> = {
    [P in keyof T]: V extends T[P] ? P : never;
}[keyof T];

export type NarrowedProperties<T, V> = {
    [P in keyof T]: V extends T[P] ? P : never;
};

export type NarrowedPropertyKeysReq<T, V> = {
    [P in keyof Required<T>]: T[P] extends V ? P : never;
}[keyof T];

export type NarrowedPropertiesReq<T, V> = {
    [P in keyof Required<T>]: T[P] extends V ? P : never;
};

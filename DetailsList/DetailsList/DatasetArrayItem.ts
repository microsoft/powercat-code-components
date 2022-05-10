// The shape of a Table/Collection that is passed as a dataset row property passed to the
// code component by Power Apps
// Uses:
// #1 - Multi Valued cell values in tables
// Allows passing in arrays for column values so that they can be rendered as a delimited string
// #2 - Child Rows as cell values
// Allows accessing nested arrays to show child rows inside parent rows in a table
// This is not documented but approved for use by Todd Trotter @ Microsoft
export interface DatasetArrayItem<T> {
    Value: T;
}
export type DatasetArray<T> = DatasetArrayItem<T>[];

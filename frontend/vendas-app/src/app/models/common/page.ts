export interface Page<T> {
    content: Array<T>;
    size: number;
    totalElements: number;
    number: number;
    first: number;
}
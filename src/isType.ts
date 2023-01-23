import kind, { KnownType } from '.'

// export default function isType<string>(thing: string, expectedType: string): thing is T
export default function isType<T extends KnownType>(thing: unknown, expectedType: string): thing is T {
    return kind(thing, true) === expectedType
}

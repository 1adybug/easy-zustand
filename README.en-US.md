# easy-zustand

English | <a href="https://github.com/1adybug/easy-zustand/blob/master/README.en-US.md">简体中文</a>

## Intrd

based on [Zustand](https://www.npmjs.com/package/zustand)

## Usage

1. Pass ur oginial state to `createStore`. The type will be automatically recognized.

    ```typescript
    import createStore from "easy-zustand"

    const useStore = createStore({
        name: "Tom",
        age: 18
    })
    ```

    Sometimes you may want to ensure that certain properties of the state are read-only, such as methods or constants. Just define the type of the state firstly.

    ```typescript
    interface Info {
        name: string
        hobby: string
        readonly age: number
        readonly say: () => void
    }

    const useStore = createStore<Info>(
        {
            name: "Tom",
            hobby: "movie",
            age: 18,
            say: () => console.log("Hello, world")
        }
    )
    ```

    In the case above, `age` and `height` will not appear in the writable properties of `setState`

2. useStore in Function Component

    ```typescript
    const [state, setState] = useStore()
    ```

3. read the state directly

    ```typescript
    <div>{state.name}</div>
    ```

4. update state by `setState`. It's kind of like React Class Component's `setState`. You can modify only the properties you want to modify.

    ```typescript
    <button onClick={() => setState({ name: "Jerry" })}>Add</button>
    ```

    In the same way, you can also pass in a function with the previous state as an argument.

    ```typescript
    setState(prevState => ({ hobby: prevState.hobby + " music" }))
    ```

5. For those variables that are not `object` type, such as `array` or other plain types. It is strongly recommended to pass the second parameter `replace` as true.

    ```typescript
    const useList = createStore<number[]>([1, 2, 3, 4], true)

    const [list, setList] = useList()

    setList([1, 2, 3, 4, 5])
    ```

    If you don't set `replace` as `true`, `zustand` will treat it as the `object` type.

    ```typescript
    const useList = createStore<number[]>([1, 2, 3, 4])

    const [list, setList] = useList()

    setList([1, 2, 3, 4, 5])
    ```

    After you change the value of `list`, it will become:

    ```typescript
    list === {
        "0": 1,
        "1": 2,
        "2": 3,
        "3": 4,
        "4": 5,
    }
    ```

    It loses all array methods and properties.

6. persistent storage

    ```typescript
    import { createPersistentStore, PersistentStoreOption } from "easy-zustand"

    interface PersistentStoreOption {
        /** unique id */
        name: string
        /** (optional) by default, 'false' is used */
        replace?: boolean
        /** (optional) by default, 'localStorage' is used */
        storage?: Window["sessionStorage"] | Window["localStorage"]
    }

    const useInfo = createPersistentStore({ age: 18 }, "info")

    // it equals
    const useInfo = createPersistentStore({ age: 18 }, { name: "info", replace: false, storage: localStorage })

    ```

## Demo

```typescript
import createStore from "easy-zustand"

// pass ur oginial state
const useStore = createStore({
    count: 0
})

// It still supports zustand's native usage

useStore.getState

useStore.setState

useStore.subscribe

// useStore in ur Component
const App: React.FC = () => {
    const [state, setState] = useStore()

    return (<>
        <div>count is {store.count}</div>
        <button onClick={() => setState({ count: store.count + 1 })}>Add</button>
    </>)
}
```

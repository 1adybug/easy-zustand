# easy-zustand

## Intrd

based on [Zustand](https://www.npmjs.com/package/zustand)

## Usage

1. Pass ur oginial state to createStore

    ```typescript
    import createStore from "easy-zustand"

    const useStore = createStore({
        name: "Tom",
        age: 18
    })
    ```

    Sometimes you may want to ensure that certain properties of the state are read-only, such as methods or constants.
    There are two methods available for you to use:

    1. Pass those read-only properties in the second parameter of `createStore`

        ```typescript
        const useStore = createStore(
            {
                name: "Tom",
                hobby: "movie"
            },
            {
                age: 18,
                say: () => console.log("Hello, world")
            }
        )
        ```

    2. Define the type of the state

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

    In both cases above, `age` and `height` will not appear in the writable properties of `setState`

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
    <button onClick={() => setState({name: "Jerry"})}>Add</button>
    ```

    In the same way, you can also pass in a function with the previous state as an argument.

    ```typescript
    setState(prevState => ({ hobby: prevState.hobby + " music" }))
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

    // it is like React Class Component setState
    return (<>
        <div>count is {store.count}</div>
        <button onClick={() => setState({ count: store.count + 1 })}>Add</button>
    </>)
}
```

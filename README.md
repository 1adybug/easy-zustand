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

2. useStore in Function Component

    ```typescript
    const store = useStore()
    ```

3. read state directly

    ```typescript
    <div>{state.count}</div>
    ```

4. update state by `store.setState`. It's kind of like Class Component's `setState`

    ```typescript
    <button onClick={() => store.setState({count: store.count + 1})}>Add</button>
    ```

## Demo

```typescript
import createStore from "easy-zustand"

// pass ur oginial state
const useStore = createStore({
    name: "Tom",
    age: 18
})

// useStore in ur Component
const App: React.FC = () => {
    const store = useStore()

    // it is like React Class Component setState
    return (<>
        <div>count is {store.count}</div>
        <button onClick={() => store.setState({count: store.count + 1})}>Add</button>
    </>)
}
```

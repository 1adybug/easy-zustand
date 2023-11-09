# easy-zustand

<a href="https://github.com/1adybug/easy-zustand/blob/master/README.md">English</a> | 简体中文

## 简介

基于 [Zustand](https://www.npmjs.com/package/zustand)

## Usage

1. 给 `createStore` 传入你的原始状态，类型会被自动识别。

    ```typescript
    import createStore from "easy-zustand"

    const useStore = createStore({
        name: "Tom",
        age: 18
    })
    ```

    有时候，你可能想要确保某些属性不可被修改，比如常量或者方法。只需要先定义类型。

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

    在上面案例中, `age` 和 `height` 不会出现 `setState` 的可修改的属性中

2. 在函数式组件中使用 `useStore`

    ```typescript
    const [state, setState] = useStore()
    ```

3. 直接读取状态

    ```typescript
    <div>{state.name}</div>
    ```

4. 通过 `setState` 更新状态。这有点像 React 的类式组件，你可以只修改你想要修改的属性。

    ```typescript
    <button onClick={() => setState({ name: "Jerry" })}>Add</button>
    ```

    同样, 你也可以传入一个以之前状态为参数的函数

    ```typescript
    setState(prevState => ({ hobby: prevState.hobby + " music" }))
    ```

5. 持久化存储

    ```typescript
    import { createPersistentStore, PersistentStoreOption } from "easy-zustand"

    interface StateStorage {
        getItem: (name: string) => string | null | Promise<string | null>;
        setItem: (name: string, value: string) => void | Promise<void>;
        removeItem: (name: string) => void | Promise<void>;
    }

    interface PersistentStoreOption {
        /** 用来标识状态的唯一 id */
        name: string
        /** 改变状态是否完全覆盖，默认为 false */
        replace?: boolean
        /** 用来持久化的存储，默认是 localStorage */
        storage?: StateStorage
    }

    const useInfo = createPersistentStore({ age: 18 }, "info")

    // 上述等价于
    const useInfo = createPersistentStore({ age: 18 }, { name: "info", replace: false, storage: localStorage })

    ```

## 使用案例

```typescript
import { FC } from "react"
import createStore from "easy-zustand"

// 传入你的原始状态
const useStore = createStore({
    count: 0
})

// 它仍然支持 zustand 的三个原生用法

useStore.getState

useStore.setState

useStore.subscribe

// 在组件中使用
const App: FC = () => {
    const [state, setState] = useStore()

    return (<>
        <div>count is {store.count}</div>
        <button onClick={() => setState({ count: store.count + 1 })}>Add</button>
    </>)
}

// 你也可以得到 zustand 创建的原生 store 对象
const originStore = useStore.origin

```

import {Uppy,State,Meta} from '@uppy/core'
import  { useMemo } from 'react'
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";



/** 这是一个常见的对于external store 的 selector hook 封装 */
/** 这边实现了一个useUppyState的hook,用来获取uppy的状态,在这里我们读取了uppy存储的files列表 */
export function useUppyState<T,TMeta extends Record<string,any>=Record<string,unknown>,>
(uppy:Uppy<TMeta>,selector:(state:any)=>T){

    /** 从 Uppy 实例中获取内部的 store（存储）对象 */
    const store=uppy.store
    
    /** 创建一个订阅函数，用于监听 Uppy 状态变化。 */
    const subscribe=useMemo(()=>store.subscribe.bind(store),[store])

    /** 创建一个获取当前状态的函数。 */
    const getSnapshot = useMemo(() => store.getState.bind(store), [store]);

    return useSyncExternalStoreWithSelector(
        subscribe,
        getSnapshot,
        getSnapshot,
        selector,
    );
}
import { isFunction, isObject } from './utils.js';

/**
 * 模块化管理 redux
 * 
 */
class ReduxX {

    constructor( module, moduleName, preloadedState ) {

        const { state, reducers, actions, modules } = module;
        // 
        this.__module__ = module;
        //
        this.__moduleName = moduleName;
        // 
        this.__reducers = reducers || {};
        //
        this.__state = state || {};
        //
        this.__initState = state || {};
        //
        this.__actions = actions || {};
        //
        this.__modules = modules || {};
        //         
        this.__children = {};
        //
        this.__external_reducers = this.getExternalModuleReducers( this.__state );

        // 合并preloadedState到state
        if (preloadedState) {
            Object.keys(preloadedState).forEach(itemKey => {
                if (!modules || !modules[itemKey]) {
                    state[itemKey] = preloadedState[itemKey];
                }
            });
        }

        // 实例化所有子模块并存储在 __children 下
        // this.__children[key] = new ReduxX(this.__modules[key])
        if( Object.keys(this.__modules).length ){
            Object.keys(this.__modules).forEach(moduleName => {
                const moduleItem = this.__modules[moduleName];
                let preloadedStateItem;
                if (preloadedState && preloadedState[moduleName]) {
                    preloadedStateItem = preloadedState[moduleName];
                }
                this.__children[moduleName] = new ReduxX(moduleItem, moduleName, preloadedStateItem);
            })
        }
    }

    /**
     * 处理当前 state 树上定义的外部注入进来的 reducer
     * 
     * @param  {[type]} obj  [description]
     * @return {[Array]}     [外部注入进来的reducer的 “特殊对象” 集合]
     */
    getExternalModuleReducers( obj ) {
        const result = []
        Object.keys(obj).forEach(key => {
            const item = obj[key];
            const path = [];
            if( isFunction(item) ){
                path.push(key);
                result.push({
                    path,
                    reducer: item
                })
            }
            if( isObject(item) ){
                result.push(...this.getExternalModuleReducers(item));
            }
        })
        return result;
    }

    /**
     * [getDataByPath description]
     * @param  {[type]} obj  [description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    getDataByPath( obj, path ){
        let result = Object.assign({}, obj);
        for (let index = 0; index < path.length; index++) {
            const p = path[index];
            result = result[p]
            if( !result ){
                return result;
            }
        }
        return result;
    }

    /**
     * [setDataByPath description]
     * @param {[type]} obj   [description]
     * @param {[type]} path  [description]
     * @param {[type]} value [description]
     */
    setDataByPath( obj, path, value ){
        let result = Object.assign({}, obj);
        let reference = result;
        for (let index = 0; index < path.length; index++) {
            const p = path[index];
            if( index === (path.length - 1)){
                reference[p] = value;
            }else{
                reference = reference[p]
            }
            if( !reference ){
                return undefined;
            }
        }
        return result;
    }

    /**
     * [currentExternalReducerHandler description]
     * 
     * @param  {[type]} moduleState [description]
     * @param  {[type]} action      [description]
     * @return {[type]}             [description]
     */
    currentExternalReducerHandler( moduleState, action ) {
        const externalReducers = this.__external_reducers;
        let finalState = moduleState || {};
        externalReducers.forEach(item => {
            const { path, reducer } = item;
            const currentState = this.getDataByPath(finalState, path);
            const resultState = reducer(
                (isFunction(currentState) ? undefined : currentState),
                action
            );
            const resultModuleState = this.setDataByPath(finalState, path, resultState);
            finalState = Object.assign({}, finalState, resultModuleState)
        })
        return finalState;
    }

    /**
     * [getStateByActionName description]
     * 
     * @param  {[type]} actionName [description]
     * @return {[type]}            [description]
     */
    getStateByActionName( actionName ) {
        if( this.__actions[actionName] ){
            return this.__state;
        }else{
            const childrenModuleNames = Object.keys(this.__children);
            if( childrenModuleNames.length ){
                let result;
                childrenModuleNames.forEach(childrenModuleName => {
                    const childrenModuleItem = this.__children[childrenModuleName];
                    const scopedState = childrenModuleItem.getStateByActionName(actionName);
                    if( scopedState ){
                        result = scopedState;
                    }
                })
                return result;
            }
        }
    }

    /**
     * 获取当前 module 及所有子 module 的所有的 reducer 的集合
     * 
     * @return {[type]} [description]
     */
    get reducerCollection() {
        let finalReducers = {};
        // 整合当前 modules 内 actions
        if( this.__reducers ){
            finalReducers = Object.assign({}, finalReducers, this.__reducers);
        }
        // 整合 children 内的 actions
        const childrenModuleNames = Object.keys(this.__children);
        if( childrenModuleNames.length ){
            let childrenActions = [];
            childrenModuleNames.forEach(childrenModuleName => {
                const childrenModuleItem = this.__children[childrenModuleName];
                childrenActions.push(childrenModuleItem.reducerCollection);
            })
            // 合并最终全部 actions
            finalReducers = childrenActions.reduce((p, childrenAction) => {
                return {
                    ...p,
                    ...childrenAction
                }
            }, finalReducers)
        }
        return finalReducers;
    }

    /**
     * 获取当前 module 及所有子 module 的所有的 action 的集合
     * 
     * @return {[type]} [description]
     */
    get actionCollection() {
        let finalActions = {};
        // 整合当前 modules 内 actions
        if( this.__actions ){
            finalActions = Object.assign({}, finalActions, this.__actions);
        }
        // 整合 children 内的 actions
        const childrenModuleNames = Object.keys(this.__children);
        if( childrenModuleNames.length ){
            let childrenActions = [];
            childrenModuleNames.forEach(childrenModuleName => {
                const childrenModuleItem = this.__children[childrenModuleName];
                childrenActions.push(childrenModuleItem.actionCollection);
            })
            // 合并最终全部 actions
            finalActions = childrenActions.reduce((p, childrenAction) => {
                return {
                    ...p,
                    ...childrenAction
                }
            }, finalActions)
        }
        return finalActions;
    }

    /**
     * 当前类 reducer 的创建函数
     * 
     * 函数内为当前 module 的局部 state
     * 形式如下：
     *  ( moduleState, action ) => ( newModuleState )
     * 
     * @return {[type]} [description]
     */
    createReducer() {
        return ( moduleState = this.__initState, action ) => {
            const { type, payload } = action;
            const reducerHandler = this.__reducers[type];
            let finalState;

            if( reducerHandler ){
                // 执行当前 module 的 reducer
                const moduleStateResult = reducerHandler(moduleState, payload);
                finalState = Object.assign({}, moduleStateResult);
                this.__state = finalState;
            }else{
                // 把 action 和对应的 state 传给 子元素的 reducer
                const childrenModuleNames = Object.keys(this.__children);
                if( childrenModuleNames.length ){
                    let childrenFinalState;
                    childrenModuleNames.map(childrenModuleName => {
                        const childrenModuleItem = this.__children[childrenModuleName];
                        // 执行所有模块的 reducer
                        const result = childrenModuleItem.createReducer()(moduleState[childrenModuleName], action);
                        if( result !== moduleState[childrenModuleName] ){
                            if( !childrenFinalState ){
                                childrenFinalState = {}
                            }
                            childrenFinalState[childrenModuleName] = result;
                        }
                    })
                    finalState = Object.assign({}, moduleState, childrenFinalState);
                }
            }

            // 执行当前 module 里引入的外部 reducer
            // 不论执行结果如何都合并入 finalState 
            if( 
                this.__external_reducers && 
                this.__external_reducers.length > 0 
            ){
                const externalStateResult = this.currentExternalReducerHandler(this.__state, action);
                finalState = Object.assign({}, finalState, externalStateResult);
                this.__state = Object.assign({}, this.__state, externalStateResult);
            }

            return finalState || moduleState;
        }
    }
}

export default ReduxX;
import { applyMiddleware, compose, createStore as createStore$1 } from 'redux';
export { applyMiddleware, bindActionCreators, compose } from 'redux';
export { Provider, batch, connect, connectAdvanced } from 'react-redux';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

/**
 * 判断数据是否为对象类型
 *
 * @param  {[type]} _data [description]
 * @return {[type]}       [description]
 */
var isObject = function isObject(data) {
  return Object.prototype.toString.call(data) === '[object Object]';
};
/**
 * 判断数据是否为字符串类型
 *
 * @param  {[type]} _data [description]
 * @return {[type]}       [description]
 */

var isString = function isString(data) {
  return Object.prototype.toString.call(data) === '[object String]';
};
/**
 * 判断数据是否为function
 *
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */

var isFunction = function isFunction(data) {
  return Object.prototype.toString.call(data) === '[object Function]';
};

/**
 * 模块化管理 redux
 * 
 */

var ReduxX =
/*#__PURE__*/
function () {
  function ReduxX(module, moduleName, preloadedState) {
    var _this = this;

    _classCallCheck(this, ReduxX);

    var state = module.state,
        reducers = module.reducers,
        actions = module.actions,
        modules = module.modules; // 

    this.__module__ = module; //

    this.__moduleName = moduleName; // 

    this.__reducers = reducers || {}; //

    this.__state = state || {}; //

    this.__initState = state || {}; //

    this.__actions = actions || {}; //

    this.__modules = modules || {}; //         

    this.__children = {}; //

    this.__external_reducers = this.getExternalModuleReducers(this.__state); // 合并preloadedState到state

    if (preloadedState) {
      Object.keys(preloadedState).forEach(function (itemKey) {
        if (!modules || !modules[itemKey]) {
          state[itemKey] = preloadedState[itemKey];
        }
      });
    } // 实例化所有子模块并存储在 __children 下
    // this.__children[key] = new ReduxX(this.__modules[key])


    if (Object.keys(this.__modules).length) {
      Object.keys(this.__modules).forEach(function (moduleName) {
        var moduleItem = _this.__modules[moduleName];
        var preloadedStateItem;

        if (preloadedState && preloadedState[moduleName]) {
          preloadedStateItem = preloadedState[moduleName];
        }

        _this.__children[moduleName] = new ReduxX(moduleItem, moduleName, preloadedStateItem);
      });
    }
  }
  /**
   * 处理当前 state 树上定义的外部注入进来的 reducer
   * 
   * @param  {[type]} obj  [description]
   * @return {[Array]}     [外部注入进来的reducer的 “特殊对象” 集合]
   */


  _createClass(ReduxX, [{
    key: "getExternalModuleReducers",
    value: function getExternalModuleReducers(obj) {
      var _this2 = this;

      var result = [];
      Object.keys(obj).forEach(function (key) {
        var item = obj[key];
        var path = [];

        if (isFunction(item)) {
          path.push(key);
          result.push({
            path: path,
            reducer: item
          });
        }

        if (isObject(item)) {
          result.push.apply(result, _toConsumableArray(_this2.getExternalModuleReducers(item)));
        }
      });
      return result;
    }
    /**
     * [getDataByPath description]
     * @param  {[type]} obj  [description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */

  }, {
    key: "getDataByPath",
    value: function getDataByPath(obj, path) {
      var result = Object.assign({}, obj);

      for (var index = 0; index < path.length; index++) {
        var p = path[index];
        result = result[p];

        if (!result) {
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

  }, {
    key: "setDataByPath",
    value: function setDataByPath(obj, path, value) {
      var result = Object.assign({}, obj);
      var reference = result;

      for (var index = 0; index < path.length; index++) {
        var p = path[index];

        if (index === path.length - 1) {
          reference[p] = value;
        } else {
          reference = reference[p];
        }

        if (!reference) {
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

  }, {
    key: "currentExternalReducerHandler",
    value: function currentExternalReducerHandler(moduleState, action) {
      var _this3 = this;

      var externalReducers = this.__external_reducers;
      var finalState = moduleState || {};
      externalReducers.forEach(function (item) {
        var path = item.path,
            reducer = item.reducer;

        var currentState = _this3.getDataByPath(finalState, path);

        var resultState = reducer(isFunction(currentState) ? undefined : currentState, action);

        var resultModuleState = _this3.setDataByPath(finalState, path, resultState);

        finalState = Object.assign({}, finalState, resultModuleState);
      });
      return finalState;
    }
    /**
     * [getStateByActionName description]
     * 
     * @param  {[type]} actionName [description]
     * @return {[type]}            [description]
     */

  }, {
    key: "getStateByActionName",
    value: function getStateByActionName(actionName) {
      var _this4 = this;

      if (this.__actions[actionName]) {
        return this.__state;
      } else {
        var childrenModuleNames = Object.keys(this.__children);

        if (childrenModuleNames.length) {
          var result;
          childrenModuleNames.forEach(function (childrenModuleName) {
            var childrenModuleItem = _this4.__children[childrenModuleName];
            var scopedState = childrenModuleItem.getStateByActionName(actionName);

            if (scopedState) {
              result = scopedState;
            }
          });
          return result;
        }
      }
    }
    /**
     * 获取当前 module 及所有子 module 的所有的 reducer 的集合
     * 
     * @return {[type]} [description]
     */

  }, {
    key: "createReducer",

    /**
     * 当前类 reducer 的创建函数
     * 
     * 函数内为当前 module 的局部 state
     * 形式如下：
     *  ( moduleState, action ) => ( newModuleState )
     * 
     * @return {[type]} [description]
     */
    value: function createReducer() {
      var _this5 = this;

      return function () {
        var moduleState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this5.__initState;
        var action = arguments.length > 1 ? arguments[1] : undefined;
        var type = action.type,
            payload = action.payload;
        var reducerHandler = _this5.__reducers[type];
        var finalState;

        if (reducerHandler) {
          // 执行当前 module 的 reducer
          var moduleStateResult = reducerHandler(moduleState, payload);
          finalState = Object.assign({}, moduleStateResult);
          _this5.__state = finalState;
        } else {
          // 把 action 和对应的 state 传给 子元素的 reducer
          var childrenModuleNames = Object.keys(_this5.__children);

          if (childrenModuleNames.length) {
            var childrenFinalState;
            childrenModuleNames.map(function (childrenModuleName) {
              var childrenModuleItem = _this5.__children[childrenModuleName]; // 执行所有模块的 reducer

              var result = childrenModuleItem.createReducer()(moduleState[childrenModuleName], action);

              if (result !== moduleState[childrenModuleName]) {
                if (!childrenFinalState) {
                  childrenFinalState = {};
                }

                childrenFinalState[childrenModuleName] = result;
              }
            });
            finalState = Object.assign({}, moduleState, childrenFinalState);
          }
        } // 执行当前 module 里引入的外部 reducer
        // 不论执行结果如何都合并入 finalState 


        if (_this5.__external_reducers && _this5.__external_reducers.length > 0) {
          var externalStateResult = _this5.currentExternalReducerHandler(_this5.__state, action);

          finalState = Object.assign({}, finalState, externalStateResult);
          _this5.__state = Object.assign({}, _this5.__state, externalStateResult);
        }

        return finalState || moduleState;
      };
    }
  }, {
    key: "reducerCollection",
    get: function get() {
      var _this6 = this;

      var finalReducers = {}; // 整合当前 modules 内 actions

      if (this.__reducers) {
        finalReducers = Object.assign({}, finalReducers, this.__reducers);
      } // 整合 children 内的 actions


      var childrenModuleNames = Object.keys(this.__children);

      if (childrenModuleNames.length) {
        var childrenActions = [];
        childrenModuleNames.forEach(function (childrenModuleName) {
          var childrenModuleItem = _this6.__children[childrenModuleName];
          childrenActions.push(childrenModuleItem.reducerCollection);
        }); // 合并最终全部 actions

        finalReducers = childrenActions.reduce(function (p, childrenAction) {
          return _objectSpread2({}, p, {}, childrenAction);
        }, finalReducers);
      }

      return finalReducers;
    }
    /**
     * 获取当前 module 及所有子 module 的所有的 action 的集合
     * 
     * @return {[type]} [description]
     */

  }, {
    key: "actionCollection",
    get: function get() {
      var _this7 = this;

      var finalActions = {}; // 整合当前 modules 内 actions

      if (this.__actions) {
        finalActions = Object.assign({}, finalActions, this.__actions);
      } // 整合 children 内的 actions


      var childrenModuleNames = Object.keys(this.__children);

      if (childrenModuleNames.length) {
        var childrenActions = [];
        childrenModuleNames.forEach(function (childrenModuleName) {
          var childrenModuleItem = _this7.__children[childrenModuleName];
          childrenActions.push(childrenModuleItem.actionCollection);
        }); // 合并最终全部 actions

        finalActions = childrenActions.reduce(function (p, childrenAction) {
          return _objectSpread2({}, p, {}, childrenAction);
        }, finalActions);
      }

      return finalActions;
    }
  }]);

  return ReduxX;
}();

var __STATIC_DATA__ = {};
/**
 * 从 action 中获取 name
 * @param  {[type]} _action [description]
 * @return {[type]}         [description]
 */

var getName = function getName(action) {
  if (isObject(action)) {
    return action.type;
  }

  if (isString(action)) {
    return action;
  }

  return null;
};
/**
 * 获取对象类型的 action 的 payload
 * @param  {[type]} _action [description]
 * @return {[type]}         [description]
 */


var getObjectActionPayload = function getObjectActionPayload(action) {
  var payload = {};

  if (isObject(action)) {
    if ('payload' in action) {
      payload = action.payload;
    } else {
      var tempObject = Object.assign({}, action);
      delete tempObject.type;
      payload = tempObject;
    }
  }

  return payload;
};

var commitHandler = function commitHandler(store) {
  return function (action, payload) {
    var reducerName = getName(action);
    var reducerFn = getReducerFnByName(reducerName);

    if (isObject(action)) {
      payload = getObjectActionPayload(action);
    }

    if (reducerFn) {
      store.dispatch({
        type: reducerName,
        payload: payload,
        isModuleReducer: true
      });
    } else {
      throw new Error("ActionMiddlewareError: The reducer function '".concat(reducerName, "' is not registered!"));
    }
  };
};
/**
 * Action的执行处理函数
 *
 * @param  {[type]} options.actionName [description]
 * @param  {[type]} options.actionFn   [description]
 * @param  {[type]} options.store      [description]
 * @param  {[type]} options.payload    [description]
 * @return {[type]}                    [description]
 */


var actionHandler = function actionHandler(_ref) {
  var actionName = _ref.actionName,
      actionFn = _ref.actionFn,
      store = _ref.store,
      payload = _ref.payload;

  var getScopeState = function getScopeState() {
    return __STATIC_DATA__['moduleInstance'].getStateByActionName(actionName) || {};
  };

  return actionFn({
    commit: commitHandler(store),
    rootState: Object.assign(store.getState()),
    state: getScopeState(),
    dispatch: store.dispatch
  }, payload); // {
  //   state,      // same as `store.state`, or local state if in modules
  //   rootState,  // same as `store.state`, only in modules
  //   commit,     // same as `store.commit`
  //   dispatch,   // same as `store.dispatch`
  //   getters,    // same as `store.getters`, or local getters if in modules
  //   rootGetters // same as `store.getters`, only in modules
  // }
};

var getActionFnByName = function getActionFnByName(actionName) {
  var actionCollection = __STATIC_DATA__['moduleInstance'].actionCollection;
  return actionCollection[actionName];
};

var getReducerFnByName = function getReducerFnByName(reducerName) {
  var reducerCollection = __STATIC_DATA__['moduleInstance'].reducerCollection;
  return reducerCollection[reducerName];
};
/**
 * actionMiddleware 创建函数
 *
 * @param  {Object} moduleInstance [description]
 * @return {[type]}                [description]
 */


var createActionMiddleware = function createActionMiddleware() {
  var moduleInstance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  __STATIC_DATA__['moduleInstance'] = moduleInstance; // const actionCollection = moduleInstance.actionCollection;
  // if( Object.keys(actionCollection).length === 0 ){
  //     throw new Error(
  //         `A valid actions collection was not received!`
  //     )
  // }

  /**
   * 中间件主体函数
   *
   * @param  {[type]} store [description]
   * @return {[type]}       [description]
   */

  var actionMiddleware = function actionMiddleware(store) {
    return function (next) {
      return function (action, payload) {
        var actionName = getName(action);
        var actionFn = getActionFnByName(actionName); // 判断 是否为我们定义的 action

        if (actionFn) {
          // 判断 是否为传统对象形式参数
          if (isObject(action)) {
            var isModuleReducer = action.isModuleReducer;

            if (isModuleReducer) {
              delete action.isModuleReducer;
              next(action);
              return;
            }

            payload = getObjectActionPayload(action);
            next({
              type: actionName,
              payload: payload
            });
            return;
          } else {
            return actionHandler({
              actionName: actionName,
              actionFn: actionFn,
              store: store,
              payload: payload
            });
          }
        } else {
          // 不是我们的 action 且为传统 action 对象
          if (isObject(action)) {
            var _isModuleReducer = action.isModuleReducer;

            if (_isModuleReducer) {
              delete action.isModuleReducer;
              next(action);
              return;
            } // 检查是否为我们的reducers


            var reducer = getReducerFnByName(actionName);

            if (reducer) {
              throw new Error("ActionMiddlewareError: You Must call the reducer '".concat(actionName, "' in a Action"));
            }

            next(action);
            return;
          } else {
            throw new Error("ActionMiddlewareError: The Action function '".concat(actionName, "' is not registered!"));
          }
        }
      };
    };
  };

  return actionMiddleware;
};

/**
 * 创建一个 redux-module-store
 *
 * @param  {[type]} module         [description]
 * @param  {[type]} preloadedState [description]
 * @param  {[type]} enhancer       [description]
 * @return {[type]}                [description]
 */

var createStore = function createStore(module, preloadedState, enhancer) {
  // 处理传入参数
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  } // 判断 module 是否为 Object


  if (!isObject(module)) {
    throw new Error('Expected the module to be a Object.');
  } // 初始化
  // 将对应的数据模型 module 实例化为 reduxModule 对象


  var moduleInstance = new ReduxX(module, 'root'); // 拿到处理后的 rootReducer 函数

  var rootReducer = moduleInstance.createReducer();
  var actionMiddleware = createActionMiddleware(moduleInstance);
  var reduxModuleEnhancer = applyMiddleware(actionMiddleware); // 合并 enhancer 和 redux-module 集成 actionMiddleware

  if (enhancer !== undefined) {
    // compose 原有的 applyMiddleware 或者 enhancer
    // 并保证 actionMiddleware 在第一位
    enhancer = compose(reduxModuleEnhancer, enhancer);
  } else {
    enhancer = reduxModuleEnhancer;
  } // 创建原生 redux store
  // createStore(reducer, [preloadedState], enhancer)


  var store = createStore$1(rootReducer, preloadedState, enhancer);
  return store;
};

export { createStore };

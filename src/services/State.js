import React, {createContext, useContext, useCallback, useReducer, useEffect} from 'react';
export const StateContext = createContext();
const reducer = (prevState, state) => {
    return {
        ...prevState,
        ...state
    }
}
/** This state provider will be used to handle most data stores in the app
 *  Desired functions for a data store:
 *  1. Loads initially a static/cached value
 *  2. Asyncly refresh this static value where needed
 *  3. Component useage matches the standard [state, updateState] pattern
 *  4. Pushes changes changes, allows changes pushed.
 * 
 *  Useage: const [{ trackedObj }, updateState]
 *   Then: updateState({ trackedObj: trackedObj })
 */
export const StateProvider = ({initFn, initialState, children}) => {
    const [ state, dispatch ] = useReducer(reducer, initialState);
    //next we'd like to async load our 
    //can't put async function directly in `useEffect`
    //
    const asyncInitilizer = useCallback(async () => {
        let state = await initFn();
        dispatch(state);//merge defaultState with async state fetch
    }, [dispatch, initFn]);
    useEffect(() => { 
        asyncInitilizer();
    // eslint-disable-next-line
    },[]);//run only once

    return (
        <StateContext.Provider value={[state, dispatch]}>
            {children}
        </StateContext.Provider>
    );
};
export const useStateStore = (attr) => {
    //if no specific part of the state is defined it can be used as object
    //doesn't like conditionally, and I've never used it this way anyways
    //if (!attr) return useContext(StateContext); //ex: const trackedObj = [{ trackedObj }, updateState] = getState()
    //you can specify a part of the state obj by passing it in
    const [state, dispatch] = useContext(StateContext); //ex: const trackedObj = [trackedObj, updateTrackedObj] = getState('trackedObj');
    return [state[attr], (value) => { dispatch({ [attr] : value }) }];
}

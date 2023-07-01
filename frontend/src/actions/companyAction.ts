import {
    LOGIN
} from './type'

export const loginUser = (loginUser: string) => async (dispatch: any) =>
{
    dispatch({
        type: LOGIN,
        payload: loginUser
    })
    return loginUser
}
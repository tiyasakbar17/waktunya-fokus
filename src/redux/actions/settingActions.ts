import { TypedUseSelectorHook } from 'react-redux'
import { AllDispatchProp, iRender, iUpdateSetting } from '../../components/global/types/interfaces'
import { getLocalSetting, getLocalTask, LOAD_LOCAL_SETTING, LOAD_LOCAL_TASK, setLocalSettig, setLocalTask, SET_MODE, SET_SETTING } from '../../components/global/types/Types'
import { settingInitState, settingInnitialState } from '../reducers/settingReducer'
import { RootState } from '../store'
import { showLoading } from './popUpActions'

const loadLocalData: () => any = () => async (dispatch: AllDispatchProp) => {
    try {
        dispatch(showLoading(true))
        let pengaturanList = settingInnitialState, targetList: iRender[] = []
        const pengaturan = await getLocalSetting()

        const target = await getLocalTask()
        if (pengaturan == null) {
            await setLocalSettig(settingInnitialState)
        } else {
            pengaturanList = JSON.parse(pengaturan)
        }
        if (target == null) {
            await setLocalTask([])
        } else {
            targetList = JSON.parse(target)
        }
        dispatch({
            type: LOAD_LOCAL_SETTING,
            payload: pengaturanList
        })
        dispatch({
            type: LOAD_LOCAL_TASK,
            payload: targetList
        })
        dispatch(showLoading(false))
    } catch (error) {
        console.log(error)
        dispatch(showLoading(false))
    }
}

const ubahPengaturan: (props: iUpdateSetting) => any = ({ tipe, nilai }) => async (dispatch: AllDispatchProp, getState: TypedUseSelectorHook<RootState>) => {
    try {
        const { settings: setting }: { settings: settingInitState } = getState(state => state.settings)
        if (tipe == 'darkMode') {
            dispatch({
                type: SET_MODE,
            })
            await setLocalSettig({
                ...setting,
                darkMode: !setting.darkMode
            })
        } else {
            dispatch({
                type: SET_SETTING,
                payload: {
                    tipe,
                    nilai
                }
            })
            await setLocalSettig({
                ...setting,
                timer: {
                    ...setting.timer,
                    [tipe]: nilai
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
}


export { loadLocalData, ubahPengaturan }
import {reducerAction} from '../../components/global/types/interfaces';
import {
  LOAD_LOCAL_SETTING,
  SET_MODE,
  SET_SETTING,
} from '../../components/global/types/Types';

export interface itimer {
  fokus: number;
  istirahatSingkat: number;
  istirahatPanjang: number;
  selangUlang: number;
  kecepatan: number;
}

export interface settingInitState {
  darkMode: boolean;
  timer: itimer;
}

export const settingInnitialState: settingInitState = {
  darkMode: false,
  timer: {
    fokus: 25,
    istirahatSingkat: 5,
    istirahatPanjang: 15,
    selangUlang: 4,
    kecepatan: 1,
  },
};

const Setting: (
  state: settingInitState,
  props: reducerAction,
) => settingInitState = (state = settingInnitialState, {type, payload}) => {
  switch (type) {
    case LOAD_LOCAL_SETTING:
      return payload;
    case SET_MODE:
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    case SET_SETTING:
      return {
        ...state,
        timer: {
          ...state.timer,
          [payload.tipe]: payload.nilai,
        },
      };
    default:
      return state;
  }
};

export default Setting;

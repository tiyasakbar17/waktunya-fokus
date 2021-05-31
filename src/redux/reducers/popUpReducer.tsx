import {reducerAction} from '../../components/global/types/interfaces';
import {
  CLOSE_POPUP,
  SHOW_POPUP,
  SHOW_LOADING,
} from '../../components/global/types/Types';

interface initState {
  isLoading: boolean;
  isPopedUp: boolean;
  message: string;
}

export const popUpinitialState: initState = {
  isLoading: true,
  isPopedUp: false,
  message: '',
};

const PopUp: (state: any, props: reducerAction) => initState = (
  state = popUpinitialState,
  {type, payload},
) => {
  switch (type) {
    case SHOW_LOADING:
      return {
        ...state,
        isLoading: payload,
      };
    case SHOW_POPUP:
      return {
        ...state,
        isPopedUp: true,
        message: payload,
      };
    case CLOSE_POPUP:
      return {
        ...state,
        isPopedUp: false,
        message: '',
      };
    default:
      return state;
  }
};

export default PopUp;

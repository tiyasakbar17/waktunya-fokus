import {StackNavigationProp} from '@react-navigation/stack';
import * as React from 'react';
import {Text as RNText} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import {ScaledSheet} from 'react-native-size-matters';
import Button from '../components/global/components/Button';
import Loader from '../components/global/components/Loader';
import {keepAwake, playSound} from '../components/global/types/functions';
import {CUSTOMFONT} from '../components/global/types/Helpers';
import {funcType, iRender} from '../components/global/types/interfaces';
import {
  useAppDispatch,
  useAppSelector,
} from '../components/global/types/reduxHooks';
import {Size} from '../components/global/types/Sizing';
import theme, {Box, Text} from '../components/global/types/theme';
import HeaderTugas from '../components/timer/HeaderTugas';
import Tugas from '../components/timer/TugasCard';
import {ubahData} from '../redux/actions/taskActions';
import {settingInitState} from '../redux/reducers/settingReducer';
import {SharedStackParams} from '../../App';

interface timer {
  menit: number;
  detik: number;
  pause: boolean;
}
interface initState {
  timer: timer;
  status: 'fokus' | 'istirahatSingkat' | 'istirahatPanjang';
  counter: number;
}
interface IstaCh {
  cStatus?: 'istirahatSingkat' | 'istirahatPanjang';
}
interface Props {
  navigation: StackNavigationProp<SharedStackParams>;
}

const Timer = ({navigation}: Props) => {
  const initialState: initState = {
    timer: {
      menit: 25,
      detik: 0,
      pause: true,
    },
    status: 'fokus',
    counter: 0,
  };
  const [state, setstate] = React.useState<initState>(initialState);
  const {timer, darkMode}: settingInitState = useAppSelector(
    state => state.settings,
  );
  const data: iRender[] = useAppSelector(state => state.task);
  const {isLoading} = useAppSelector(state => state.popup);

  const dispatch = useAppDispatch();
  const {
    fokus,
    istirahatSingkat,
    istirahatPanjang,
    selangUlang,
    kecepatan,
  } = timer;
  const usengefek: (func: funcType, depend?: any) => void = (func, depend) =>
    React.useEffect(func, depend);

  const setTimer: funcType = () => {
    setstate(prev => ({
      ...prev,
      timer: {
        ...prev.timer,
        pause: true,
        menit:
          state.status == 'fokus'
            ? fokus
            : state.status == 'istirahatSingkat'
            ? istirahatSingkat
            : istirahatPanjang,
        detik: 0,
      },
    }));
  };
  usengefek(() => {
    setTimer();
  }, [state.status, timer]);
  usengefek(() => {
    if (state.timer.pause == false) {
      if (state.timer.detik > 0 || state.timer.menit > 0) {
        const timer = setTimeout(() => {
          if (state.timer.detik > 0) {
            setstate(prev => ({
              ...prev,
              timer: {
                ...prev.timer,
                detik: state.timer.detik - 1,
              },
            }));
          } else if (state.timer.menit > 0) {
            setstate(prev => ({
              ...prev,
              timer: {
                ...prev.timer,
                menit: state.timer.menit - 1,
                detik: 59,
              },
            }));
          }
        }, (1 / kecepatan) * 1000);
        // Clear timeout if the component is unmounted
        return () => clearTimeout(timer);
      } else if (state.status == 'fokus' && state.counter < selangUlang) {
        playSound('rings');
        setstate(prev => ({
          ...prev,
          status: 'istirahatSingkat',
          timer: {
            ...prev.timer,
            pause: true,
            menit: istirahatSingkat,
            detik: 0,
          },
          counter: (prev.counter += 1),
        }));
      } else if (
        state.status == 'istirahatSingkat' ||
        state.status == 'istirahatPanjang'
      ) {
        playSound('rings');
        setstate(prev => ({
          ...prev,
          status: 'fokus',
          timer: {
            ...prev.timer,
            pause: true,
            menit: fokus,
            detik: 0,
          },
        }));
      } else {
        playSound('rings');
        setstate(prev => ({
          ...prev,
          status: 'istirahatPanjang',
          timer: {
            ...prev.timer,
            pause: true,
            menit: istirahatPanjang,
            detik: 0,
          },
          counter: 0,
        }));
      }
    }
  }, [state.timer]);
  usengefek(() => {
    keepAwake({awake: !state.timer.pause});
  }, [state.timer.pause]);

  const colorBG =
    state.status == 'fokus'
      ? 'danger'
      : state.status == 'istirahatSingkat'
      ? 'kuartet'
      : 'primary';

  const jedaHandler: funcType = () => {
    playSound('clicked');
    setstate(prev => ({
      ...prev,
      timer: {
        ...prev.timer,
        pause: !prev.timer.pause,
      },
    }));
  };
  const ulangiHandler: funcType = () => {
    setTimer();
  };
  const dragData = (data: iRender[]) => {
    dispatch(ubahData(data));
  };
  const statusChanger = ({cStatus}: IstaCh) => {
    setstate(prev => ({
      ...prev,
      status: cStatus ? cStatus : 'fokus',
    }));
  };

  const doneHandler: funcType = (id: string) => {
    const indexData = [...data].findIndex(item => item.id == id);
    const newData: iRender[] =
      data[indexData].waktuSelesai === null
        ? [
            ...data.slice(0, indexData),
            ...data.slice(indexData + 1),
            {
              ...data[indexData],
              waktuSelesai: new Date(),
            },
          ]
        : [
            {
              ...data[indexData],
              waktuSelesai: null,
            },
            ...data.slice(0, indexData),
            ...data.slice(indexData + 1),
          ];

    dispatch(ubahData(newData));
  };
  const asyncFilter = async (arr: any[], predicate: (props: any) => any) => {
    const results = await Promise.all(arr.map(predicate));
    return arr.filter((_v, index) => results[index]);
  };
  const deleteHandler: funcType = async (id: string) => {
    const asyncRes = await asyncFilter(data, async i => {
      return i.id != id;
    });
    dispatch(ubahData(asyncRes));
  };
  const editHandler: funcType = (id: string) => {
    const editing = data.find(item => item.id == id);
    navigation.navigate('Edit', editing);
  };
  const renderItem = React.useCallback(
    ({item, drag, isActive}: RenderItemParams<iRender>) => (
      <Tugas
        {...{
          colorBG,
          item,
          drag,
          isActive,
          doneHandler,
          deleteHandler,
          editHandler,
        }}
      />
    ),
    [colorBG, data],
  );

  return (
    <Box
      backgroundColor={colorBG}
      alignItems="center"
      paddingHorizontal="s"
      paddingVertical="s"
      minHeight={Size.hs(100)}>
      <Text
        color={darkMode ? 'sgrey' : 'textWhite'}
        marginTop="s"
        fontSize={Size.ws(10)}
        variant="button">
        WAKTUNYA {state.status == 'fokus' ? 'FOKUS' : 'REHAT'}
      </Text>
      <Box
        style={styles.timerContainer}
        borderRadius="m"
        alignItems="center"
        position="relative">
        <Box style={styles.timerBox}>
          <Box
            alignItems="center"
            justifyContent="center"
            flexDirection="row"
            height={Size.hs(15)}
            width={Size.ws(90)}
            style={{margin: 0, padding: 0}}>
            <RNText
              style={{
                padding: 0,
                margin: 0,
                fontWeight: 'bold',
                fontSize: CUSTOMFONT(70),
                color: darkMode ? theme.colors.sgrey : theme.colors.textWhite,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {'    '}
              {state.timer.menit < 10
                ? '0' + state.timer.menit
                : state.timer.menit}
              {''}:{''}
              {state.timer.detik < 10
                ? '0' + state.timer.detik
                : state.timer.detik}
              {'    '}
            </RNText>
          </Box>
          <Box justifyContent="center" flexDirection="row">
            <Button
              label={state.timer.pause ? 'mulai' : 'jeda'}
              variant={darkMode ? 'sgrey' : 'white'}
              txtColor={darkMode ? 'white' : colorBG}
              style={{
                marginBottom: 10,
                height: Size.hs(6.5),
                width:
                  state.timer.pause &&
                  state.timer.detik != 0 &&
                  (state.timer.menit != fokus ||
                    state.timer.menit != istirahatSingkat ||
                    state.timer.menit != istirahatPanjang)
                    ? Size.ws(40)
                    : Size.ws(80),
                marginRight: Size.ws(1),
              }}
              onPress={jedaHandler}
            />
            {state.timer.pause &&
            state.timer.detik != 0 &&
            (state.timer.menit != fokus ||
              state.timer.menit != istirahatSingkat ||
              state.timer.menit != istirahatPanjang) ? (
              <Button
                label="ulangi"
                variant={darkMode ? 'sgrey' : 'white'}
                txtColor={darkMode ? 'white' : colorBG}
                style={{
                  marginBottom: 10,
                  height: Size.hs(6.5),
                  width: Size.ws(40),
                  marginLeft: Size.ws(1),
                }}
                onPress={ulangiHandler}
              />
            ) : null}
          </Box>
          <Box justifyContent="center" flexDirection="row">
            <Button
              label={
                state.status == 'fokus' ? 'istirahat sekarang' : 'kembali fokus'
              }
              variant={darkMode ? 'sgrey' : 'white'}
              txtColor={darkMode ? 'white' : colorBG}
              style={{
                marginBottom: 10,
                height: Size.hs(6.5),
                width:
                  state.status == 'istirahatSingkat'
                    ? Size.ws(40)
                    : Size.ws(80),
                marginRight: Size.ws(1),
              }}
              onPress={
                state.status == 'fokus'
                  ? () => statusChanger({cStatus: 'istirahatSingkat'})
                  : statusChanger
              }
            />
            {state.status == 'istirahatSingkat' ? (
              <Button
                label="istirahat panjang"
                variant={darkMode ? 'sgrey' : 'white'}
                txtColor={darkMode ? 'white' : colorBG}
                style={{
                  marginBottom: 10,
                  height: Size.hs(6.5),
                  width: Size.ws(40),
                  marginLeft: Size.ws(1),
                }}
                onPress={() => statusChanger({cStatus: 'istirahatPanjang'})}
              />
            ) : null}
          </Box>
        </Box>
      </Box>
      <Box style={styles.targetContainer}>
        <Box alignItems="center" marginBottom="s">
          <Text variant="smtitle" color="sgrey">
            Target saat ini:
          </Text>
          <Text variant="body" color="white" textTransform="capitalize">
            {data[0] ? data[0].namaTarget : '-'}
          </Text>
        </Box>
        <HeaderTugas />
        {isLoading ? (
          <Box height={Size.hs(30)}>
            <Loader color={colorBG} />
          </Box>
        ) : (
          <DraggableFlatList
            style={{
              maxHeight: Size.hs(30),
            }}
            data={data}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            onDragEnd={({data}) => dragData(data)}
          />
        )}
      </Box>
    </Box>
  );
};

export default Timer;

const styles = ScaledSheet.create({
  boxTugas: {
    width: Size.ws(90),
  },
  targetContainer: {
    marginTop: Size.hs(2.5),
  },
  timerBox: {
    width: Size.ws(90),
    height: Size.hs(30),
    backgroundColor: 'rgba(255,255,255, 0.2)',
  },
  timerContainer: {
    top: Size.hs(1),
    width: Size.ws(90),
    height: Size.hs(30),
    overflow: 'hidden',
  },
});

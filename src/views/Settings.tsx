import Slider from '@react-native-community/slider';
import React, {useState} from 'react';
import {StyleSheet, Switch} from 'react-native';
import FormTextInput from '../components/global/components/FormTextInput';
import MainContainer from '../components/global/components/MainContainer';
import {iUpdateSetting} from '../components/global/types/interfaces';
import {
  useAppDispatch,
  useAppSelector,
} from '../components/global/types/reduxHooks';
import {Size} from '../components/global/types/Sizing';
import {Box, Text} from '../components/global/types/theme';
import {ubahPengaturan} from '../redux/actions/settingActions';
import {settingInitState} from '../redux/reducers/settingReducer';

interface Props {}

const Settings = (props: Props) => {
  const dispatch = useAppDispatch();
  const setting: settingInitState = useAppSelector(state => state.settings);

  const {
    darkMode,
    timer: {fokus, istirahatSingkat, istirahatPanjang, selangUlang, kecepatan},
  } = setting;
  const [state, setstate] = useState(kecepatan);
  const onValueChange = ({
    tipe,
    nilai,
  }: {
    tipe: iUpdateSetting['tipe'];
    nilai?: string;
  }) => {
    const nilaiParsed =
      Math.round(parseFloat(nilai || '1') * 100) / 100 > 0
        ? Math.round(parseFloat(nilai || '1') * 100) / 100
        : (Math.round(parseFloat(nilai || '1') * 100) / 100 ** 2) ** (1 / 2);
    dispatch(ubahPengaturan({tipe, nilai: nilaiParsed}));
  };
  return (
    <MainContainer>
      <Box padding="m" alignItems="center" minHeight={Size.hw(100)}>
        <Text variant="title" color="grey" marginBottom="m">
          Pengaturan
        </Text>
        <Box style={styles.itemBox} marginBottom="s">
          <Text variant="smtitle">Mode Gelap</Text>
          <Switch
            value={darkMode}
            onValueChange={() => onValueChange({tipe: 'darkMode'})}
          />
        </Box>
        <Text variant="smtitle" textAlign="left" marginTop="m">
          Atur Waktu (hitungan)
        </Text>
        <Box style={styles.itemBox} marginBottom="xs">
          <Text variant="smtitle">Fokus </Text>
          <FormTextInput
            styles={styles.inputStyle}
            style={styles.inputmain}
            value={fokus.toString()}
            onChangeText={nilai => onValueChange({tipe: 'fokus', nilai})}
            keyboardType="numeric"
          />
        </Box>
        <Box style={styles.itemBox} marginBottom="xs">
          <Text variant="smtitle">Istirahat Singkat </Text>
          <FormTextInput
            styles={styles.inputStyle}
            style={styles.inputmain}
            value={istirahatSingkat.toString()}
            onChangeText={nilai =>
              onValueChange({tipe: 'istirahatSingkat', nilai})
            }
            keyboardType="numeric"
          />
        </Box>
        <Box style={styles.itemBox} marginBottom="m">
          <Text variant="smtitle">Istirahat Panjang </Text>
          <FormTextInput
            styles={styles.inputStyle}
            style={styles.inputmain}
            value={istirahatPanjang.toString()}
            onChangeText={nilai =>
              onValueChange({tipe: 'istirahatPanjang', nilai})
            }
            keyboardType="numeric"
          />
        </Box>
        <Box style={styles.itemBox} marginBottom="m">
          <Box maxWidth={Size.ws(65)}>
            <Text variant="smtitle">Interval ke Istirahat Panjang</Text>
          </Box>
          <FormTextInput
            styles={styles.inputStyle}
            style={styles.inputmain}
            value={selangUlang.toString()}
            onChangeText={nilai => onValueChange({tipe: 'selangUlang', nilai})}
            keyboardType="numeric"
          />
        </Box>
        <Box style={styles.sliderBox}>
          <Text variant="smtitle">Kecepatan Pewaktu</Text>
          <Slider
            minimumValue={0.1}
            maximumValue={1.9}
            step={0.01}
            style={{width: Size.ws(85)}}
            onSlidingComplete={nilai =>
              onValueChange({tipe: 'kecepatan', nilai: nilai.toString()})
            }
            onValueChange={nilai =>
              setstate(() => Math.round(nilai * 100) / 100)
            }
            value={kecepatan}
          />
          <Box style={styles.itemBox}>
            <Text variant="smtitle">Lambat</Text>
            <Text variant="smtitle">{state} x </Text>
            <Text variant="smtitle">Cepat</Text>
          </Box>
        </Box>
      </Box>
    </MainContainer>
  );
};

export default Settings;

const styles = StyleSheet.create({
  inputStyle: {
    width: Size.ws(15),
    height: Size.hs(5),
    alignContent: 'center',
    padding: 0,
  },
  inputmain: {
    textAlign: 'center',
    padding: 0,
  },
  itemBox: {
    flexDirection: 'row',
    width: Size.ws(85),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderBox: {
    width: Size.ws(85),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

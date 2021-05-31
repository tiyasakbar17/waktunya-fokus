import {RouteProp, useIsFocused} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import Button from '../components/global/components/Button';
import FormTextInput from '../components/global/components/FormTextInput';
import MainContainer from '../components/global/components/MainContainer';
import {
  useAppDispatch,
  useAppSelector,
} from '../components/global/types/reduxHooks';
import {Size} from '../components/global/types/Sizing';
import {Box, Text} from '../components/global/types/theme';
import {editTarget, tambahTarget} from '../redux/actions/taskActions';
import {MainRoutes} from '../tabs/MainNavigator';
import Loader from '../components/global/components/Loader';
import {iRender} from '../components/global/types/interfaces';

interface Props {
  navigation: StackNavigationProp<MainRoutes>;
  route: any;
}

const TambahTarget = ({navigation, route}: Props) => {
  const {params}: {params: iRender} = route;
  const isFocus = useIsFocused();
  const {isLoading} = useAppSelector(state => state.popup);
  const initialState: {namaTarget: any; catatan: any} = {
    namaTarget: '',
    catatan: '',
  };
  const [state, setstate] = useState(initialState);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isFocus) {
      route.params
        ? setstate({
            namaTarget: route.params.namaTarget,
            catatan: route.params.catatan,
          })
        : setstate(initialState);
    }
  }, [isFocus]);
  const submitTugas = () => {
    if (state.namaTarget != '') {
      route.params
        ? dispatch(
            editTarget({
              ...params,
              namaTarget: state.namaTarget,
              catatan: state.catatan,
            }),
          ).then(() => {
            setstate(initialState);
            navigation.navigate('Pewaktu');
          })
        : dispatch(
            tambahTarget({
              namaTarget: state.namaTarget,
              catatan: state.catatan,
              waktuDibuat: new Date(),
            }),
          ).then(() => {
            setstate(initialState);
            navigation.navigate('Pewaktu');
          });
    }
  };
  const ubahHandler = (field: 'namaTarget' | 'catatan', nilai: string) => {
    setstate(prev => ({
      ...prev,
      [field]: nilai,
    }));
  };
  return isLoading ? (
    <Loader />
  ) : (
    <MainContainer>
      <ScrollView>
        <Box style={styles.container} padding="l">
          <Text variant="title" textTransform="capitalize" color="primary">
            {route.params ? 'sunting' : 'tambah'} target
          </Text>
          <Box style={styles.formStyle} padding="s">
            <Text variant="smtitle">Nama Target</Text>
            <Box alignItems="center">
              <FormTextInput
                styles={styles.formInputStyle}
                style={{textTransform: 'none'}}
                placeholder="Target baru"
                value={state.namaTarget}
                onChangeText={nilai => ubahHandler('namaTarget', nilai)}
              />
            </Box>
          </Box>
          <Box style={styles.formStyle} padding="s">
            <Text variant="smtitle">Catatan</Text>
            <Box alignItems="center">
              <FormTextInput
                styles={{...styles.formInputStyle, height: Size.hs(30)}}
                multiline={true}
                style={{textTransform: 'none', padding: 5}}
                placeholder="Catatan singkat mengenai target"
                value={state.catatan}
                onChangeText={nilai => ubahHandler('catatan', nilai)}
              />
            </Box>
          </Box>
          <Button
            variant="primary"
            label={route.params ? 'Simpan' : 'Tambah target baru'}
            style={{width: Size.ws(80), marginTop: Size.hs(5)}}
            onPress={submitTugas}
          />
        </Box>
      </ScrollView>
    </MainContainer>
  );
};

export default TambahTarget;

const styles = StyleSheet.create({
  container: {
    minHeight: Size.hs(100),
    alignItems: 'center',
  },
  formStyle: {
    justifyContent: 'center',
    width: Size.ws(85),
  },
  formInputStyle: {
    maxWidth: Size.ws(83),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

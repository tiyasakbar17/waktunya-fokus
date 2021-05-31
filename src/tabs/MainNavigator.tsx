import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Timer from '../views/Timer';
import theme from '../components/global/types/theme';
import Settings from '../views/Settings';
import NavTambahTarget from './NavTambahTarget';
import TambahTarget from '../views/TambahTarget';

export type MainRoutes = {
  Pewaktu: any;
  Tambah: any;
  Pengaturan: any;
};

export const MainStack = createBottomTabNavigator<MainRoutes>();

const MainNavigator = () => (
  <MainStack.Navigator
    initialRouteName="Pewaktu"
    tabBarOptions={{
      activeTintColor: theme.colors.primary,
      inactiveTintColor: theme.colors.kuartet,
      adaptive: true,
      tabStyle: styles.tabstyle,
    }}>
    <MainStack.Screen
      name="Pewaktu"
      options={{
        tabBarLabel: 'Fokus',
        tabBarIcon: ({color, size}) => (
          <MaterialCommunityIcons name="alarm" color={color} size={size} />
        ),
      }}
      component={Timer}
    />
    <MainStack.Screen
      name="Tambah"
      options={({navigation}) => ({
        tabBarLabel: 'Tambah Target',
        tabBarVisible: false,
        tabBarIcon: ({focused}) => {
          const onPress = () => navigation.navigate('Tambah', null);
          return <NavTambahTarget {...{onPress, focused}} />;
        },
      })}
      component={TambahTarget}
    />
    <MainStack.Screen
      name="Pengaturan"
      options={{
        tabBarLabel: 'Pengaturan',
        tabBarIcon: ({color, size}) => (
          <MaterialCommunityIcons name="cogs" color={color} size={size} />
        ),
      }}
      component={Settings}
    />
  </MainStack.Navigator>
);

export default MainNavigator;

const styles = StyleSheet.create({
  tabstyle: {
    backgroundColor: theme.colors.secondary,
  },
});

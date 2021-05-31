import React from 'react';
import theme, {Box, Text} from '../global/types/theme';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Size} from '../global/types/Sizing';
import {funcType, iRender} from '../global/types/interfaces';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TugasProps {
  colorBG: 'danger' | 'kuartet' | 'primary';
  item: iRender;
  drag: funcType;
  index?: number | undefined;
  isActive?: boolean;
  doneHandler: funcType;
  deleteHandler: funcType;
  editHandler: funcType;
}

const Tugas: React.FunctionComponent<TugasProps> = ({
  colorBG,
  item,
  drag,
  isActive,
  index,
  doneHandler,
  deleteHandler,
  editHandler,
}) => {
  return (
    <TouchableWithoutFeedback onLongPress={drag}>
      <Box
        padding="xs"
        backgroundColor={isActive ? 'grey' : 'white'}
        style={styles.boxTugas}
        borderRadius="s"
        marginBottom="s">
        <Box flexGrow={1} justifyContent="center" alignItems="center">
          <TouchableOpacity onPress={() => doneHandler(item.id)}>
            <MaterialCommunityIcon
              name="checkbox-multiple-marked-circle"
              color={
                item.waktuSelesai ? theme.colors.danger : theme.colors.grey
              }
              size={Size.ws(8)}
            />
          </TouchableOpacity>
        </Box>
        <Box flexGrow={8.5} justifyContent="center">
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center">
            <Text
              fontWeight="bold"
              color={isActive ? 'white' : item.waktuSelesai ? 'grey' : colorBG}
              textTransform="capitalize"
              textDecorationLine={item.waktuSelesai ? 'line-through' : 'none'}
              style={{
                textDecorationColor:
                  colorBG == 'danger'
                    ? 'rgb(247, 98, 46)'
                    : colorBG == 'kuartet'
                    ? 'rgb(127, 204, 42)'
                    : 'rgb(74,89,151)',
              }}>
              {item.namaTarget}
              {'  '}
            </Text>
            <Box flexDirection="row-reverse">
              <TouchableOpacity
                onPress={() => deleteHandler(item.id)}
                style={{marginHorizontal: 4}}>
                <MaterialCommunityIcon
                  name="delete-circle"
                  color={theme.colors.grey}
                  size={Size.ws(6)}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => editHandler(item.id)}>
                <MaterialCommunityIcon
                  name="pencil-circle"
                  color={theme.colors.grey}
                  size={Size.ws(6)}
                />
              </TouchableOpacity>
            </Box>
          </Box>
          {item.catatan ? (
            <Box marginLeft="m">
              <Box
                padding="s"
                style={{
                  ...styles.catatanBox,
                  backgroundColor: isActive
                    ? 'rgba(255, 255, 255, 0.4)'
                    : colorBG == 'danger'
                    ? 'rgba(247, 98, 46, 0.4)'
                    : colorBG == 'kuartet'
                    ? 'rgba(127, 204, 42, 0.4)'
                    : 'rgba(74,89,151, 0.4)',
                }}>
                <Text fontWeight="900" color="sgrey">
                  {item.catatan}
                  {'  '}
                </Text>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default Tugas;

const styles = StyleSheet.create({
  boxTugas: {
    width: Size.ws(90),
    minHeight: Size.hs(5),
    flexDirection: 'row',
  },
  catatanBox: {
    maxWidth: Size.ws(75),
  },
});

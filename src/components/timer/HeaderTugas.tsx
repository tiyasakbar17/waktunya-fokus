import React from 'react';
import {StyleSheet} from 'react-native';
import {Size} from '../global/types/Sizing';
import {Box, Text} from '../global/types/theme';

interface Props {}

const HeaderTugas = (props: Props) => {
  return (
    <Box style={styles.headerContainer}>
      <Text
        variant="smtitle"
        fontSize={Size.ws(5)}
        color="white"
        marginBottom="xs">
        Target
      </Text>
      <Box
        width={Size.ws(90)}
        backgroundColor="white"
        borderRadius="l"
        height={Size.hs(0.4)}
      />
    </Box>
  );
};

export default HeaderTugas;

const styles = StyleSheet.create({
  headerContainer: {
    width: Size.ws(90),
    justifyContent: 'space-around',
    marginBottom: Size.hs(0.5),
  },
});

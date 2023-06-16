import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Button, Modal, Portal } from 'react-native-paper';
import { View } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { globalStyles } from '../../styles/globalStyles';
import { CalendarArrow, ModalCalendarHeader } from '../headers/CalendarHeader';
import { useAppDispatch, useAppSelector } from '../../redux';
import { setNote } from '../../redux/slice/noteSlice';
import { DiaryScreenProps } from '../../types/navigation/type';

export const SelectDateModal = ({
  route,
  navigation,
  visible,
  setVisible,
}: {
  route: DiaryScreenProps['route'];
  navigation: DiaryScreenProps['navigation'];
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const diary = useAppSelector((state) => {
    return state.diary.allDiary.map((diary) => diary.modDate.slice(0, -14));
  });
  const dispatch = useAppDispatch();
  const INITIAL_DATE = new Date()
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split(' ')
    .join('')
    .replaceAll('.', '-')
    .slice(0, -1);
  const [selected, setSelected] = useState(INITIAL_DATE);
  const marked = useMemo(() => {
    return {
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: '#FFD54A',
        selectedTextColor: 'red',
      },
    };
  }, [selected]);
  const disabled = [...new Set(diary)].reduce((acc: any, cur: string) => {
    acc[cur] = { disabled: true };
    return acc;
  }, {});
  useEffect(() => {
    console.log(disabled);
  });
  return (
    <Portal>
      <Modal
        visible={visible}
        style={globalStyles.modal}
        contentContainerStyle={globalStyles.modalContent}
      >
        <RNCalendar
          theme={{
            todayTextColor: 'black',
          }}
          renderHeader={(date) => <ModalCalendarHeader date={date} />}
          renderArrow={(direction) => <CalendarArrow direction={direction} />}
          onDayPress={(date) => setSelected(date.dateString)}
          markedDates={{ ...marked, ...disabled }}
        />
        <View style={globalStyles.modalButtonGroup}>
          <Button
            mode="outlined"
            style={{ borderColor: '#FFD54A', borderWidth: 2 }}
            textColor="#FFD54A"
            onPress={() => {
              setVisible(!visible);
            }}
          >
            취소
          </Button>
          <Button
            buttonColor="#FFD54A"
            mode="contained"
            onPress={() => {
              dispatch(setNote({ date: selected.replaceAll('-', '.') }));
              navigation.navigate('SelectEmotion', {
                status: 'before',
                date: 'selectedDay',
              });
              setVisible(false);
            }}
          >
            확인
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

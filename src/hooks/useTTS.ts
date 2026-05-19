import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import * as Speech from 'expo-speech';

import { ImagineScrollItem } from '../data/types';
import { useImagineStore } from '../store/useImagineStore';

export const useTTS = () => {
  const muted = useImagineStore((state) => state.muted);
  const autoPlayTTS = useImagineStore((state) => state.autoPlayTTS);
  const ttsRate = useImagineStore((state) => state.ttsRate);
  const ttsPitch = useImagineStore((state) => state.ttsPitch);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    Speech.stop();
  }, []);

  const speak = useCallback(
    (item?: ImagineScrollItem, force = false) => {
      stop();

      if (!item || muted || (!autoPlayTTS && !force)) {
        return;
      }

      timerRef.current = setTimeout(() => {
        Speech.stop();
        Speech.speak(item.ttsText, {
          rate: ttsRate,
          pitch: ttsPitch,
        });
      }, 250);
    },
    [autoPlayTTS, muted, stop, ttsPitch, ttsRate],
  );

  const replay = useCallback(
    (item?: ImagineScrollItem) => {
      speak(item, true);
    },
    [speak],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') {
        stop();
      }
    });

    return () => {
      subscription.remove();
      stop();
    };
  }, [stop]);

  return { speak, stop, replay };
};

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, SafeAreaView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

import PurpleIconTile from '../components/PurpleIconTile';
import { Colors, Gradients } from '../theme';

type Point = { x: number; y: number };

export default function HomeScreen() {
  const iconRef = useRef<View>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const [origin, setOrigin] = useState<Point | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const [audioReady, setAudioReady] = useState(true);

  // A little “pop” animation for the icon tile.
  const pop = useRef(new Animated.Value(1)).current;

  const runPop = useCallback(() => {
    pop.setValue(1);
    Animated.sequence([
      Animated.spring(pop, { toValue: 1.08, useNativeDriver: true }),
      Animated.spring(pop, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, [pop]);

  const ensureAudioLoaded = useCallback(async () => {
    if (soundRef.current) return;

    try {
      // Allows sound even if iPhone is in silent mode.
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        // Replace this file with the real song you legally own (or change the path).
        require('../../assets/birthday-bitch.wav'),
        { shouldPlay: false, isLooping: false }
      );

      soundRef.current = sound;
      setAudioReady(true);
    } catch (e) {
      console.warn(
        'Could not load audio. Add/replace assets/birthday-bitch.wav (or update the require path).',
        e
      );
      setAudioReady(false);
    }
  }, []);

  const playFromStart = useCallback(async () => {
    try {
      await ensureAudioLoaded();
      if (!soundRef.current) return;

      await soundRef.current.setPositionAsync(0);
      await soundRef.current.playAsync();
    } catch (e) {
      console.warn('Audio playback failed.', e);
    }
  }, [ensureAudioLoaded]);

  const stopAudio = useCallback(async () => {
    try {
      if (!soundRef.current) return;
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await soundRef.current.stopAsync();
      }
    } catch {
      // ignore
    }
  }, []);

  const burstAt = useCallback(
    async (point: Point) => {
      setOrigin(point);
      setConfettiKey((k) => k + 1);

      runPop();

      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch {
        // ignore (e.g., on web)
      }

      await playFromStart();
    },
    [playFromStart, runPop]
  );

  const measureAndBurst = useCallback(() => {
    const { width, height } = Dimensions.get('window');
    const fallback: Point = { x: width / 2, y: height * 0.25 };

    if (!iconRef.current) {
      void burstAt(fallback);
      return;
    }

    iconRef.current.measureInWindow((x, y, w, h) => {
      const point = w && h ? { x: x + w / 2, y: y + h / 2 } : fallback;
      void burstAt(point);
    });
  }, [burstAt]);

  useEffect(() => {
    // Preload audio ASAP so launch feels instant.
    void ensureAudioLoaded();

    // Burst right after initial layout.
    const id = requestAnimationFrame(() => {
      setTimeout(measureAndBurst, 50);
    });

    return () => cancelAnimationFrame(id);
  }, [ensureAudioLoaded, measureAndBurst]);

  useEffect(() => {
    return () => {
      void soundRef.current?.unloadAsync();
      soundRef.current = null;
    };
  }, []);

  return (
    <LinearGradient colors={Gradients.background} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Pressable
            onPress={measureAndBurst}
            accessibilityRole="button"
            accessibilityLabel="Replay confetti and song"
          >
            <Animated.View style={{ transform: [{ scale: pop }] }}>
              {/* collapsable={false} is important so Android can measure this view */}
              <View ref={iconRef} collapsable={false}>
                <PurpleIconTile />
              </View>
            </Animated.View>
          </Pressable>

          {origin && confettiKey > 0 ? (
            <ConfettiCannon
              key={confettiKey}
              count={240}
              origin={origin}
              fadeOut
              explosionSpeed={540}
              fallSpeed={2600}
            />
          ) : null}

          <Text style={styles.headline}>
            HAPPY BIRTHDAY{'
'}BIIIIIIIIIIIIITCH!
          </Text>

          <Text style={styles.sub}>
            Tap the icon to replay the confetti + song.
            {!audioReady ? ' (Add your audio file to enable music.)' : ''}
          </Text>

          <Pressable onPress={stopAudio} style={styles.stopBtn} accessibilityRole="button">
            <Text style={styles.stopBtnText}>Stop music</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    gap: 18,
  },
  headline: {
    color: Colors.white,
    fontSize: 38,
    lineHeight: 44,
    textAlign: 'center',
    fontWeight: '900',
    letterSpacing: 0.6,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 12,
  },
  sub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16,
    textAlign: 'center',
  },
  stopBtn: {
    marginTop: 6,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  stopBtnText: {
    color: Colors.white,
    fontWeight: '700',
  },
});

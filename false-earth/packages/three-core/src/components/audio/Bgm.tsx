'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three/webgpu';
import { useFrame } from '@react-three/fiber';

interface Track {
  id: string;
  url: string;
  volume?: number;
  /** Pitch offset in cents (negative = lower) */
  detune?: number;
}

interface BgmProps {
  listener: THREE.AudioListener | null;
  active: boolean;
  tracks: Track[];
  fadeDuration?: number;
}

/**
 * Safely fetch and decode an audio buffer.
 * Returns null (instead of throwing) if the request is intercepted (e.g. IDM 204)
 * or if the server returns a non-audio response.
 */
async function safeLoadAudioBuffer(
  url: string,
  audioContext: AudioContext
): Promise<AudioBuffer | null> {
  try {
    const response = await fetch(url);
    // IDM Advanced Integration returns 204 when it intercepts the download.
    // Any non-2xx or empty body means we can't decode audio.
    if (!response.ok || response.status === 204) {
      console.warn(
        `[Bgm] Skipping audio "${url}": fetch responded with ${response.status}. ` +
        `If you have IDM installed, try disabling "Advanced Browser Integration".`
      );
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      console.warn(`[Bgm] Skipping audio "${url}": empty response body.`);
      return null;
    }
    return await audioContext.decodeAudioData(arrayBuffer);
  } catch (err) {
    console.warn(`[Bgm] Failed to load audio "${url}":`, err);
    return null;
  }
}

export function Bgm({ listener, active, tracks, fadeDuration = 1 }: BgmProps) {
  const sounds = useRef<Map<string, { audio: THREE.Audio; targetVol: number }>>(new Map());
  const [buffersReady, setBuffersReady] = useState(false);

  // Stable URL list for the dependency array
  const trackUrls = useMemo(() => tracks.map(t => t.url).join(','), [tracks]);

  useEffect(() => {
    if (!listener) return;

    let cancelled = false;

    // Tear down any previously created sounds
    sounds.current.forEach(({ audio }) => {
      if (audio.isPlaying) audio.stop();
      audio.disconnect();
    });
    sounds.current.clear();
    setBuffersReady(false);

    const audioContext = listener.context as AudioContext;

    Promise.all(
      tracks.map(t => safeLoadAudioBuffer(t.url, audioContext))
    ).then(buffers => {
      if (cancelled) return;

      tracks.forEach((t, index) => {
        const buffer = buffers[index];
        if (!buffer) return; // skip tracks that failed to load

        const audio = new THREE.Audio(listener);
        const targetVol = t.volume ?? 0.5;

        audio.setBuffer(buffer);
        audio.setLoop(true);
        if (t.detune) audio.setDetune(t.detune);

        // Start at 0 volume — useFrame will fade in when active
        audio.setVolume(0);
        if (audio.gain?.gain) {
          audio.gain.gain.value = 0;
          audio.gain.gain.setValueAtTime(0, audioContext.currentTime);
        }

        if (active) {
          if (audioContext.state === 'suspended') {
            audioContext.resume().catch(() => {});
          }
          audio.play();
          // Immediately clamp to 0 after play() so there's no audible pop
          audio.setVolume(0);
          if (audio.gain?.gain) {
            audio.gain.gain.cancelScheduledValues(audioContext.currentTime);
            audio.gain.gain.setValueAtTime(0, audioContext.currentTime);
          }
        }

        sounds.current.set(t.id, { audio, targetVol });
      });

      setBuffersReady(true);
    });

    return () => {
      cancelled = true;
      sounds.current.forEach(({ audio }) => {
        if (audio.isPlaying) audio.stop();
        audio.disconnect();
      });
      sounds.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listener, trackUrls]);

  useFrame((_, delta) => {
    if (!buffersReady) return;
    const safeDelta = Math.min(delta, 0.1);

    sounds.current.forEach((obj) => {
      const { audio, targetVol } = obj;
      const currentVol = audio.getVolume();
      const destination = active ? targetVol : 0;

      if (active && !audio.isPlaying) {
        const ctx = (audio.listener as THREE.AudioListener).context as AudioContext;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
        audio.play();
        audio.setVolume(0);
      } else if (!active && audio.isPlaying && currentVol <= 0.001) {
        audio.pause();
      }

      if (Math.abs(currentVol - destination) > 0.0001) {
        const step = safeDelta / fadeDuration;
        const newVol = THREE.MathUtils.lerp(currentVol, destination, step * 3.0);
        audio.setVolume(newVol);
      } else if (currentVol !== destination) {
        audio.setVolume(destination);
      }
    });
  });

  return null;
}
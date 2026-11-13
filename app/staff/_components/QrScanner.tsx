"use client";

import { useEffect, useRef } from "react";
import jsQR from "jsqr";

type Props = {
  paused: boolean; // true = หยุดภาพค้างไว้และหยุดอ่าน QR
  onScan: (text: string) => void;
  onNoCode?: () => void; // เรียกเมื่อเฟรมนั้นไม่มี QR
  onError: (message: string) => void;
  className?: string;
};

const CAMERA_ERROR =
  "เปิดกล้องไม่ได้ กรุณาอนุญาตการใช้กล้อง และเปิดผ่าน https หรือ localhost";

export default function QrScanner({ paused, onScan, onNoCode, onError, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedRef = useRef(paused);
  const onScanRef = useRef(onScan);
  const onNoCodeRef = useRef(onNoCode);
  const onErrorRef = useRef(onError);
  pausedRef.current = paused;
  onScanRef.current = onScan;
  onNoCodeRef.current = onNoCode;
  onErrorRef.current = onError;

  // หยุด/เล่นภาพตาม paused
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !video.srcObject) return;
    if (paused) video.pause();
    else video.play().catch(() => {});
  }, [paused]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf = 0;
    let last = 0;
    let stopped = false;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    // อ่าน QR จากภาพกล้องทุก ~150ms
    function tick(now: number) {
      if (stopped) return;
      raf = requestAnimationFrame(tick);

      const video = videoRef.current;
      if (pausedRef.current || !video || !ctx || video.readyState < 2 || now - last < 150) return;
      last = now;

      const scale = Math.min(1, 640 / video.videoWidth);
      const w = Math.round(video.videoWidth * scale);
      const h = Math.round(video.videoHeight * scale);
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(video, 0, 0, w, h);

      const code = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, {
        inversionAttempts: "dontInvert",
      });
      if (code?.data) onScanRef.current(code.data);
      else onNoCodeRef.current?.();
    }

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        onErrorRef.current(CAMERA_ERROR);
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
      } catch {
        onErrorRef.current(CAMERA_ERROR);
        return;
      }
      const video = videoRef.current;
      if (stopped || !video) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      video.srcObject = stream;
      await video.play().catch(() => {});
      if (pausedRef.current) video.pause();
      raf = requestAnimationFrame(tick);
    }

    start();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return <video ref={videoRef} className={className} playsInline muted autoPlay />;
}

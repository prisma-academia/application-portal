import React, { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { captureVideoFrame, dataUrlBytes, getCroppedImage, PHOTO_SIZE } from "./cropImage";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const hasCamera = () => Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

/**
 * Passport photo picker: choose a file or use the camera, crop to a square,
 * then confirm. Calls onConfirm with a PHOTO_SIZE px JPEG data URL.
 */
function PhotoCapture({ open, onClose, onConfirm }) {
  const [stage, setStage] = useState("choose"); // choose | camera | crop | confirm
  const [source, setSource] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [cropArea, setCropArea] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const fileInput = useRef(null);
  const captureInput = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const replaceSource = useCallback((next) => {
    setSource((previous) => {
      if (previous && previous.startsWith("blob:")) URL.revokeObjectURL(previous);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    stopCamera();
    replaceSource(null);
    setStage("choose");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCropArea(null);
    setResult(null);
    setError("");
    setBusy(false);
  }, [stopCamera, replaceSource]);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => stopCamera, [stopCamera]);

  const startCrop = (src) => {
    replaceSource(src);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setStage("crop");
  };

  const handleFile = (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please choose a JPEG, PNG or WebP image.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("That image is larger than 10 MB. Please choose a smaller one.");
      return;
    }
    setError("");
    startCrop(URL.createObjectURL(file));
  };

  const openCamera = async () => {
    setError("");
    if (!hasCamera()) {
      captureInput.current && captureInput.current.click();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      setStage("camera");
    } catch (err) {
      // Permission denied or no camera: the OS picker can still offer the camera on phones.
      setError("Camera unavailable or permission denied. You can upload a photo instead.");
      captureInput.current && captureInput.current.click();
    }
  };

  // Attach the stream once the <video> for the camera stage has mounted.
  useEffect(() => {
    if (stage === "camera" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [stage]);

  const takePicture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const frame = captureVideoFrame(video);
    stopCamera();
    startCrop(frame);
  };

  const applyCrop = async () => {
    if (!cropArea) return;
    setBusy(true);
    try {
      setResult(await getCroppedImage(source, cropArea, rotation));
      setStage("confirm");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const confirm = () => {
    onConfirm(result);
    onClose();
  };

  if (!open) return null;

  const button = "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50";
  const primary = `${button} bg-pink-600 text-white hover:bg-pink-700`;
  const secondary = `${button} border border-slate-300 text-slate-700 bg-white hover:bg-slate-50`;
  const titles = {
    choose: "Add passport photo",
    camera: "Take a photo",
    crop: "Crop your photo",
    confirm: "Confirm your photo",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">{titles[stage]}</h3>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-700" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          {error && <div className="mb-4 rounded-lg bg-pink-50 border-l-4 border-pink-500 p-3 text-sm text-pink-700">{error}</div>}

          {stage === "choose" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button type="button" onClick={() => fileInput.current.click()} className="flex flex-col items-center gap-2 p-5 border-2 border-dashed border-slate-300 rounded-xl hover:border-pink-500 hover:bg-pink-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-700">Upload from device</span>
                </button>
                <button type="button" onClick={openCamera} className="flex flex-col items-center gap-2 p-5 border-2 border-dashed border-slate-300 rounded-xl hover:border-pink-500 hover:bg-pink-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-700">Take a photo</span>
                </button>
              </div>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Face the camera on a plain, light background</li>
                <li>• JPEG, PNG or WebP, up to 10 MB. You will crop it next.</li>
              </ul>
            </div>
          )}

          {stage === "camera" && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-xl overflow-hidden aspect-square">
                <video ref={videoRef} playsInline muted className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
                <div className="pointer-events-none absolute inset-8 rounded-full border-2 border-white/70"></div>
              </div>
              <div className="flex justify-between">
                <button type="button" className={secondary} onClick={() => { stopCamera(); setStage("choose"); }}>Back</button>
                <button type="button" className={primary} onClick={takePicture}>Capture</button>
              </div>
            </div>
          )}

          {stage === "crop" && source && (
            <div className="space-y-4">
              <div className="relative h-72 bg-slate-900 rounded-xl overflow-hidden">
                <Cropper
                  image={source}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={(_, areaPixels) => setCropArea(areaPixels)}
                />
              </div>
              <label className="block text-xs font-medium text-slate-600">
                Zoom
                <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-pink-600" />
              </label>
              <div className="flex items-end gap-3">
                <label className="flex-1 block text-xs font-medium text-slate-600">
                  Rotate
                  <input type="range" min={-180} max={180} step={1} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full accent-pink-600" />
                </label>
                <button type="button" className={secondary} onClick={() => setRotation((r) => (r + 90 > 180 ? r - 270 : r + 90))}>Rotate 90°</button>
              </div>
              <div className="flex justify-between">
                <button type="button" className={secondary} onClick={reset}>Start over</button>
                <button type="button" className={primary} onClick={applyCrop} disabled={busy || !cropArea}>{busy ? "Processing..." : "Next"}</button>
              </div>
            </div>
          )}

          {stage === "confirm" && result && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <img src={result} alt="Cropped passport" className="w-48 h-48 object-cover rounded-xl border border-slate-200 shadow-sm" />
                <p className="text-xs text-slate-500">
                  {PHOTO_SIZE} × {PHOTO_SIZE} px · {Math.round(dataUrlBytes(result) / 1024)} KB
                </p>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                  <button type="button" className={secondary} onClick={() => setStage("crop")}>Re-crop</button>
                  <button type="button" className={secondary} onClick={reset}>Retake</button>
                </div>
                <button type="button" className={primary} onClick={confirm}>Use this photo</button>
              </div>
            </div>
          )}

          <input ref={fileInput} type="file" accept={ACCEPTED_TYPES.join(",")} onChange={handleFile} className="sr-only" />
          <input ref={captureInput} type="file" accept="image/*" capture="user" onChange={handleFile} className="sr-only" />
        </div>
      </div>
    </div>
  );
}

export default PhotoCapture;

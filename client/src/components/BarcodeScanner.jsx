import { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

const SCANNER_REGION_ID = "isbn-barcode-scanner-region";

/**
 * Opens the device camera and scans for an EAN-13 barcode (the format used
 * on the back of virtually every printed book). Calls onDetected(isbn) the
 * moment one is found.
 */
export default function BarcodeScanner({ onDetected, onError }) {
  const scannerRef = useRef(null);
  const hasDetectedRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode(SCANNER_REGION_ID);
    scannerRef.current = scanner;
    hasDetectedRef.current = false;

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 260, height: 140 },
          formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
        },
        (decodedText) => {
          if (hasDetectedRef.current) return;
          hasDetectedRef.current = true;
          onDetected(decodedText);
        },
        () => {
          // Fires on every frame with no barcode in view - expected, ignore.
        },
      )
      .catch((err) => {
        onError?.(
          err?.message?.includes("Permission")
            ? "Camera access was denied. Please allow camera permission, or type the ISBN instead."
            : "Could not start the camera. Try typing the ISBN instead.",
        );
      });

    return () => {
      scanner
        .stop()
        .then(() => scanner.clear())
        .catch(() => {
          // Scanner may already be stopped/cleared - safe to ignore.
        });
    };
  }, [onDetected, onError]);

  return (
    <div
      id={SCANNER_REGION_ID}
      className="w-full rounded-xl overflow-hidden bg-black min-h-[220px]"
    />
  );
}
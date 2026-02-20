import React, { useState, useCallback, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

/**
 * Create cropped image blob from image element and pixel crop.
 * Crop coords are in displayed image pixels; we scale to natural size.
 */
async function getCroppedImg(image, pixelCrop) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get canvas context");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(pixelCrop.width * scaleX);
  canvas.height = Math.floor(pixelCrop.height * scaleY);

  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    image,
    Math.floor(pixelCrop.x * scaleX),
    Math.floor(pixelCrop.y * scaleY),
    Math.floor(pixelCrop.width * scaleX),
    Math.floor(pixelCrop.height * scaleY),
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob failed"));
          return;
        }
        resolve(blob);
      },
      "image/png",
      1
    );
  });
}

function centerFullCrop(mediaWidth, mediaHeight) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 100,
        height: 100,
      },
      mediaWidth / mediaHeight,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const ImageCropModal = ({ imageUrl, onApply, onCancel }) => {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [isApplying, setIsApplying] = useState(false);

  const onImageLoad = useCallback((e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setCrop(centerFullCrop(naturalWidth, naturalHeight));
  }, []);

  const handleApply = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return;
    setIsApplying(true);
    try {
      const blob = await getCroppedImg(imgRef.current, completedCrop);
      const url = URL.createObjectURL(blob);
      const file = new File([blob], "cropped-image.png", { type: "image/png" });
      onApply(url, file);
    } catch (err) {
      console.error("Crop failed:", err);
    } finally {
      setIsApplying(false);
    }
  }, [completedCrop, onApply]);

  return (
    <div
      className="crop-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
    >
      <div className="crop-modal-content">
        {/* Header */}
        <div className="crop-modal-header">
          <h2
            id="crop-modal-title"
            className="text-base font-semibold"
            style={{ color: "#f9fafb" }}
          >
            Crop Image
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded hover:bg-gray-600 transition-colors"
            aria-label="Close crop editor"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cropper - drag corners to resize, drag center to move */}
        <div className="crop-modal-body">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
            aspect={undefined}
            minWidth={40}
            minHeight={40}
            keepSelection
            className="crop-modal-reactcrop"
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Crop"
              onLoad={onImageLoad}
              className="crop-modal-img"
            />
          </ReactCrop>
        </div>

        {/* Footer */}
        <div className="crop-modal-footer">
          <p className="text-xs mb-4" style={{ color: "#9ca3af" }}>
            Crop if needed, or click Done to continue • Drag corners to resize • Drag inside to move
          </p>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="crop-modal-btn crop-modal-btn-cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying || !completedCrop}
            className="crop-modal-btn crop-modal-btn-done"
          >
              {isApplying ? "Processing..." : "Done"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;

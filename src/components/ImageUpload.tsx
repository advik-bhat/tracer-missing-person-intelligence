import { useCallback, useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  image: string | null;
  onChange: (image: string | null) => void;
}

export function ImageUpload({ label, image, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }, [onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  if (image) {
    return (
      <div className="image-upload-field">
        <label>{label}</label>
        <div className="image-preview-wrapper">
          <img src={image} alt="Upload preview" className="image-preview" />
          <div className="image-preview-actions">
            <button type="button" className="secondary-btn" onClick={() => inputRef.current?.click()}>REPLACE</button>
            <button type="button" className="secondary-btn danger" onClick={() => onChange(null)}><X size={14} /> REMOVE</button>
          </div>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden-file-input" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
      </div>
    );
  }

  return (
    <div className="image-upload-field">
      <label>{label}</label>
      <div
        className={`image-dropzone ${dragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <UploadCloud size={28} />
        <span className="dropzone-title">Drop image or click to upload</span>
        <span className="dropzone-sub">JPG, PNG, or WEBP — stored locally for demo</span>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden-file-input" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
    </div>
  );
}

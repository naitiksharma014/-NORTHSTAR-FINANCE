
import { useRef, useState } from 'react';
import { ImagePlus, LoaderCircle, UploadCloud } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/api\/?$/, '');

function normalizeImageUrl(url) {
  if (!url) return '';

  // Fix image URLs previously saved with localhost.
  if (url.startsWith('http://localhost:5000/')) {
    return url.replace('http://localhost:5000', API_ORIGIN);
  }

  // Convert relative upload paths to absolute URLs.
  if (url.startsWith('/uploads/')) {
    return `${API_ORIGIN}${url}`;
  }

  return url;
}

export default function ImageField({ label, value, onChange, toast }) {
  const ref = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append('image', file);
    setUploading(true);

    try {
      const { data } = await api.post('/uploads', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = normalizeImageUrl(data.url);
      onChange(imageUrl);

      toast?.({
        type: 'success',
        message: 'Image uploaded.',
      });
    } catch (error) {
      toast?.({
        type: 'error',
        message: getErrorMessage(error, 'Could not upload image.'),
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  return (
    <div className="form-field image-field">
      <label>{label}</label>

      <div className="image-field-row">
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste an image URL or upload a file"
        />

        <input
          ref={ref}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          hidden
          onChange={upload}
        />

        <button
          type="button"
          className="button button-outline upload-button"
          disabled={uploading}
          onClick={() => ref.current?.click()}
        >
          {uploading ? (
            <LoaderCircle size={16} className="spin" />
          ) : (
            <UploadCloud size={16} />
          )}
          Upload
        </button>
      </div>

      {value ? (
        <div className="image-preview">
          <img
            src={normalizeImageUrl(value)}
            alt="Preview"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <button
            type="button"
            className="image-clear"
            onClick={() => onChange('')}
          >
            Clear image
          </button>
        </div>
      ) : (
        <p className="field-hint">
          <ImagePlus size={14} /> Public image URL or file up to 5 MB.
        </p>
      )}
    </div>
  );
}

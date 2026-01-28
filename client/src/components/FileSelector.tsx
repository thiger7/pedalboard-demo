import type { ChangeEvent } from 'react';

// Local mode: select from existing files
interface LocalFileSelectorProps {
  mode: 'local';
  files: string[];
  selectedFile: string;
  onSelect: (file: string) => void;
  isLoading: boolean;
}

// S3 mode: upload a file
interface S3FileSelectorProps {
  mode: 's3';
  onFileSelect: (file: File) => void;
  uploadedFileName: string | null;
  isUploading: boolean;
}

type FileSelectorProps = LocalFileSelectorProps | S3FileSelectorProps;

export function FileSelector(props: FileSelectorProps) {
  if (props.mode === 's3') {
    const { onFileSelect, uploadedFileName, isUploading } = props;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    };

    return (
      <div className="file-selector">
        <label htmlFor="input-file">Input File:</label>
        <input
          type="file"
          id="input-file"
          accept="audio/*,.wav,.mp3,.flac,.ogg"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        {isUploading && <span className="upload-status">Uploading...</span>}
        {uploadedFileName && (
          <span className="upload-status uploaded">{uploadedFileName}</span>
        )}
      </div>
    );
  }

  // Local mode
  const { files, selectedFile, onSelect, isLoading } = props;

  if (isLoading) {
    return (
      <div className="file-selector">
        <span>Input File:</span>
        <span>Loading...</span>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="file-selector">
        <span>Input File:</span>
        <span className="no-files">No audio files found in audio/input/</span>
      </div>
    );
  }

  return (
    <div className="file-selector">
      <label htmlFor="input-file">Input File:</label>
      <select
        id="input-file"
        value={selectedFile}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Select a file...</option>
        {files.map((file) => (
          <option key={file} value={file}>
            {file}
          </option>
        ))}
      </select>
    </div>
  );
}

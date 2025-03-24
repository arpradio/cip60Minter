import { ChangeEvent, useState } from 'react';
import { AlertCircle } from 'lucide-react';

type FileUploadProps = {
  label: string;
  accept: string;
  onChange: (file: File) => void;
  currentFile: File | null;
  required?: boolean;
  error?: string;
};

export function FileUpload({
  label,
  accept,
  onChange,
  currentFile,
  required = false,
  error
}: FileUploadProps): React.ReactElement {
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };
  
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-white mb-1">
        {label}{required ? '*' : ''} {currentFile?.name && `(${currentFile.name})`}
      </label>
      
      <div 
        className={`
          rounded border-2 border-dashed p-4 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'} 
          ${error ? 'border-red-500 bg-red-500/10' : ''}
        `}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleChange}
          accept={accept}
          required={required}
          className="hidden"
          id={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
        />
        
        <label 
          htmlFor={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          {currentFile ? (
            <div className="text-green-500">
              {currentFile.name} ({Math.round(currentFile.size / 1024)} KB)
            </div>
          ) : (
            <>
              <p className="text-gray-300">Drag & drop your file here or click to browse</p>
              <button className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
                Select File
              </button>
            </>
          )}
        </label>
        
        {error && (
          <div className="flex items-center mt-2 text-red-500 text-sm">
            <AlertCircle size={16} className="mr-1" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

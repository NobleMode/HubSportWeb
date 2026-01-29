import React, { useState } from 'react';
import { useUploadImageMutation } from '../../services/uploadApi';
import LoadingSpinner from './LoadingSpinner';

const ImageUpload = ({ value, onChange, label = "Image" }) => {
    const [uploadImage, { isLoading }] = useUploadImageMutation();
    const [preview, setPreview] = useState(value);
    const [uploadError, setUploadError] = useState(null);

    // Update preview if value changes externally
    React.useEffect(() => {
        setPreview(value);
    }, [value]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Local preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        try {
            setUploadError(null);
            const result = await uploadImage(file).unwrap();
            
            // Backend returns { url: "/uploads/filename.ext", ... }
            const imageUrl = result.url; 
            
            // Construct full URL if needed (backend returns relative to root)
            // If backend is on same domain/proxy, relative is fine.
            // If separate, prepend API URL. 
            // Assuming proxy or same origin for now as per previous context.
            // But let's handle the VITE_API_URL if it's absolute path.
            
            const fullUrl = imageUrl.startsWith('http') 
                ? imageUrl 
                : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imageUrl}`;
                
            onChange(fullUrl); 
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadError("Upload failed. Please try again.");
            setPreview(value); // Revert preview to original value
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            
            <div className="flex items-center space-x-4">
                <div className="shrink-0 h-24 w-24 border border-gray-300 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center relative">
                    {isLoading ? (
                        <LoadingSpinner size="sm" />
                    ) : preview ? (
                        <img 
                            src={preview} 
                            alt="Preview" 
                            className="h-full w-full object-cover" 
                        />
                    ) : (
                        <span className="text-gray-400 text-xs">No Image</span>
                    )}
                </div>
                
                <div className="flex-1">
                    <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-indigo-50 file:text-indigo-700
                          hover:file:bg-indigo-100
                        "
                        onChange={handleFileChange}
                        disabled={isLoading}
                    />
                    {uploadError && (
                        <p className="mt-1 text-xs text-red-500">{uploadError}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        Supports: JPG, PNG, WEBP (Max 5MB)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;

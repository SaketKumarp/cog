"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface AudioUploaderProps {
  boardId: string;
}

export const AudioUploader = ({ boardId }: AudioUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.type.startsWith("audio/")) {
        setFile(selectedFile);
      } else {
        alert("Please upload a valid audio file!");
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a", ".ogg"],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return alert("Please select an audio file first!");

    setLoading(true);
    const formData = new FormData();
    formData.append("audio", file);
    formData.append("boardId", boardId); // so backend knows which board it belongs to

    try {
      const res = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setTranscript(data.text || "No transcription returned");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error while uploading audio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">
        🎧 Upload Audio for Board:{" "}
        <span className="text-[#1abc9c]">{boardId}</span>
      </h2>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`w-96 h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          isDragActive
            ? "border-[#1abc9c] bg-[#1abc9c22]"
            : "border-gray-400 bg-gray-50 hover:border-[#1abc9c]"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-[#1abc9c] font-medium">
            Drop your audio file here...
          </p>
        ) : file ? (
          <p className="text-gray-700 font-medium">{file.name}</p>
        ) : (
          <p className="text-gray-500">
            Drag & drop audio here, or click to browse
          </p>
        )}
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-5 px-5 py-2 rounded-lg text-white bg-[#1abc9c] hover:bg-[#16a085] transition-colors"
        >
          {loading ? "Uploading..." : "get the answer"}
        </button>
      )}

      {transcript && (
        <div className="mt-6 p-4 bg-gray-100 w-96 rounded-lg text-left">
          <h3 className="font-semibold mb-2">🗣 Transcript:</h3>
          <p className="text-gray-800">{transcript}</p>
        </div>
      )}
    </div>
  );
};

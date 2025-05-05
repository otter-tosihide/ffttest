import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { loadWavFile, downsampleAudio } from '../../../shared/audioUtils';
import { prepareAudioData } from '../../../shared/fft';

const FileInput = ({ onDataLoad }) => {
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setFileName(file.name);
      
      // WAVファイルを読み込み
      const audioData = await loadWavFile(file);
      
      // 2048サンプルにダウンサンプリング（2^11）
      const downsampledData = downsampleAudio(audioData, 2048);
      
      // FFT用の複素数データに変換
      const complexData = prepareAudioData(downsampledData);
      
      onDataLoad(complexData);
    } catch (error) {
      console.error('ファイル処理エラー:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ m: 2 }}>
      <input
        accept=".wav"
        style={{ display: 'none' }}
        id="wav-file-input"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="wav-file-input">
        <Button
          variant="contained"
          component="span"
          disabled={loading}
        >
          {loading ? 'ロード中...' : 'WAVファイルを選択'}
        </Button>
      </label>
      {fileName && (
        <Typography variant="body1" sx={{ mt: 1 }}>
          選択されたファイル: {fileName}
        </Typography>
      )}
    </Box>
  );
};

export default FileInput;
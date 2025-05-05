/**
 * WAVファイルを読み込み、オーディオデータを取得する
 * @param {File} file - 入力WAVファイル
 * @returns {Promise<Float32Array>} - オーディオデータ
 */
export async function loadWavFile(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer.getChannelData(0); // モノラルとして処理
  } catch (error) {
    throw new Error('WAVファイルの読み込みに失敗しました: ' + error.message);
  }
}

/**
 * オーディオデータをダウンサンプリングする
 * @param {Float32Array} audioData - 元のオーディオデータ
 * @param {number} targetLength - 目標のデータ長（2のべき乗）
 * @returns {Float32Array} - ダウンサンプリングされたデータ
 */
export function downsampleAudio(audioData, targetLength) {
  const step = Math.floor(audioData.length / targetLength);
  const result = new Float32Array(targetLength);
  
  for (let i = 0; i < targetLength; i++) {
    result[i] = audioData[i * step];
  }
  
  return result;
}

/**
 * オーディオデータの統計情報を取得
 * @param {Float32Array} audioData - オーディオデータ
 * @returns {Object} - 統計情報
 */
export function getAudioStats(audioData) {
  const max = Math.max(...audioData);
  const min = Math.min(...audioData);
  const avg = audioData.reduce((sum, val) => sum + val, 0) / audioData.length;
  
  return {
    max,
    min,
    avg,
    length: audioData.length,
    sampleRate: 44100 // 標準的なサンプルレート
  };
}
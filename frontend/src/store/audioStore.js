import { create } from 'zustand';

const useAudioStore = create((set) => ({
  audioBlob: null,
  isRecording: false,
  mediaRecorder: null,

  startRecording: () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        let chunks = [];

        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          set({ audioBlob });
        };

        mediaRecorder.start();
        set({ isRecording: true, mediaRecorder });
      })
      .catch((err) => console.error('Error accessing microphone:', err));
  },

  stopRecording: () => {
    set((state) => {
      if (state.mediaRecorder) {
        state.mediaRecorder.stop();
        state.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
      return { isRecording: false, mediaRecorder: null };
    });
  },

  resetAudio: () => set({ audioBlob: null }),

  submitAudio: async (questionId, status = 'attempted') => {
    const { audioBlob } = useAudioStore.getState();

    const formData = new FormData();
    formData.append('questionId', questionId);
    formData.append('status', status);

    if (status === 'attempted' && audioBlob) {
      formData.append('audio', audioBlob, `response_${questionId}.wav`);
    }

    try {
      const response = await fetch('/api/submit-response', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('Response submitted:', result);
    } catch (error) {
      console.error('Error submitting response:', error);
    }

    set({ audioBlob: null });
  },
}));

export default useAudioStore;

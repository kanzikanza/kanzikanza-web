import { create } from 'zustand'

// (1) 스토어가 가질 상태와 액션 타입 정의 (TypeScript 사용 시)
interface CounterState {
  count: number
  increase: () => void
  reset: () => void
}

// create로 스토어 받음
const useCounterStore = create<CounterState>((set) => ({
  count: 0,                             // 초기 상태
  increase: () => set((state) => ({     // 액션: count++
    count: state.count + 1
  })),
    decrement: () => set((state) => ({
      count: state.count - 1
  })),
  reset: () => set({                    // 액션: 초기화
    count: 0
  }),
}))


// interface를 정하는거고 
interface AuthState {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,  // ← 메모리에만 존재 (새로고침하면 null 됨)
    setAccessToken: (token) => set({ accessToken: token }),
    logout: () => set({ accessToken: null }),
}));

export default useAuthStore
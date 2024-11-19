import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface MapStoreType {
	center: { lat: number; lng: number };
	position: { lat: number; lng: number };
	ne: { lat: number; lng: number };
	sw: { lat: number; lng: number };
	setCenter: (center: { lat: number; lng: number }) => void;
	setPosition: (position: { lat: number; lng: number }) => void;
	setNE: (ne: { lat: number; lng: number }) => void;
	setSW: (sw: { lat: number; lng: number }) => void;
}

const useMapStore = create<MapStoreType>()(
	devtools(
		(set) => ({
			center: { lat: 37.5665, lng: 126.978 }, // 서울 시청
			position: { lat: 37.5665, lng: 126.978 },
			ne: { lat: 37.5755, lng: 126.988 },
			sw: { lat: 37.5575, lng: 126.968 },
			setCenter: (center: { lat: number; lng: number }) => set({ center }),
			setPosition: (position: { lat: number; lng: number }) => set({ position }),
			setNE: (ne: { lat: number; lng: number }) => set({ ne }),
			setSW: (sw: { lat: number; lng: number }) => set({ sw }),
		}),
		{ name: 'mapStore' },
	),
);
export default useMapStore;

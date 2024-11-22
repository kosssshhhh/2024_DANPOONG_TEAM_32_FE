import { useEffect, useMemo, useRef, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { debounce } from 'lodash';

import MyLocationSvg from '@assets/svg/my-marker.svg';
import IconMyLocation from '@assets/svg/my-marker.svg?react';
import MarkerSvg from '@assets/svg/marker.svg';
import SelectedMarkerSvg from '@assets/svg/selected-marker.svg';

import useKakaoLoader from '@hooks/useKakaoLoader';
import { useFetchPublicOffices } from '@hooks/youthMap/useFetchPublicOffices';
import useMapStore from '@stores/useMapStore';

import { PublicOfficeDataType } from '@type/publicOfficeData.type';
import { AnimatePresence, motion } from 'motion/react';
import Icon from '@components/Icon';
import UnderlineText from '@components/UnderlineText';
import Button from '@components/Button';

export default function YouthMap() {
	useKakaoLoader();
	const mapRef = useRef<kakao.maps.Map>(null);
	const { position, center, ne, sw, setPosition, setCenter, setNE, setSW } = useMapStore();
	const { data, isLoading, isError, refetch } = useFetchPublicOffices(ne, sw);

	const [selectedMarker, setSelectedMarker] = useState<PublicOfficeDataType>();
	const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);

	useEffect(() => {
		// 사용자 현재 위치 받아오기
		navigator.geolocation.watchPosition((pos) => {
			setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
		});
	}, []);

	useEffect(() => {
		const map = mapRef.current;
		if (!map) return;

		setSW({
			lat: map.getBounds().getSouthWest().getLat(),
			lng: map.getBounds().getSouthWest().getLng(),
		});
		setNE({
			lat: map.getBounds().getNorthEast().getLat(),
			lng: map.getBounds().getNorthEast().getLng(),
		});
	}, [mapRef.current]);

	const setCenterToCurrentPosition = () => {
		setCenter(position);
	};

	const updateCenterWhenMapDragged = useMemo(
		() =>
			debounce((map: kakao.maps.Map) => {
				console.log(map.getCenter());
				console.log(map.getBounds().getNorthEast());
				console.log(map.getBounds().getSouthWest());
				setCenter({
					lat: map.getCenter().getLat(),
					lng: map.getCenter().getLng(),
				});
				setNE({
					lat: map.getBounds().getNorthEast().getLat(),
					lng: map.getBounds().getNorthEast().getLng(),
				});
				setSW({
					lat: map.getBounds().getSouthWest().getLat(),
					lng: map.getBounds().getSouthWest().getLng(),
				});
			}, 500),
		[],
	);

	const handleMarkerClick = (markData: PublicOfficeDataType) => {
		setSelectedMarker(markData);
		console.log(markData);
		const OFFSET = 0.001; // 약 100미터 정도의 오프셋

		setCenter({
			lat: markData.latitude + OFFSET,
			lng: markData.longitude,
		});

		if (mapRef.current) {
			mapRef.current.setLevel(4);
		}
		setIsInfoWindowOpen(true);
	};

	const closeInfoWindow = () => {
		setIsInfoWindowOpen(false);
	};

	const handleCopyPhoneNumber = (phoneNumber: string) => {
		if (!phoneNumber) return;

		navigator.clipboard
			.writeText(phoneNumber)
			.then(() => {
				alert('전화번호가 복사되었습니다.');
			})
			.catch((err) => {
				console.error('전화번호 복사 실패:', err);
			});
	};

	return (
		<div className="relative w-full h-full flex justify-center">
			<Map
				id="map"
				className="w-full h-full"
				ref={mapRef}
				center={center}
				level={6}
				onCenterChanged={updateCenterWhenMapDragged}>
				<MapMarker
					position={position}
					image={{
						src: MyLocationSvg as unknown as string,
						size: { width: 40.75, height: 45.5 },
					}}
				/>

				{data?.data.map((item) => (
					<MapMarker
						key={item.publicOfficeName}
						position={{ lat: item.latitude, lng: item.longitude }}
						onClick={() => handleMarkerClick(item)}
						image={{
							src:
								selectedMarker?.publicOfficeName === item.publicOfficeName
									? (SelectedMarkerSvg as unknown as string)
									: (MarkerSvg as unknown as string),
							size:
								selectedMarker?.publicOfficeName === item.publicOfficeName
									? { width: 45.75, height: 55.5 }
									: { width: 35.75, height: 45.5 },
						}}
					/>
				))}
			</Map>

			<div className="flex flex-col gap-[10px] absolute z-[1] bottom-20 left-0 p-[10px]">
				<button
					className="flex justify-center items-center cursor-pointer rounded-full w-[45px] h-[45px] bg-white shadow-[0_4px_4px_#00000025]"
					onClick={setCenterToCurrentPosition}>
					<Icon name="MyLocationIcon" />
				</button>
			</div>

			<div className="absolute z-[1] top-3">
				<button
					className="flex items-center backdrop-blur-sm w-[146px] h-[41px] bg-theme-main bg-opacity-60 text-white px-2 py-1 opacity-80 rounded-[30px] font-normal text-sm"
					onClick={() => refetch()}>
					<Icon name="ArrowClockwise" className="w-[22px] h-[22px]" />
					<span className="ml-1">{isLoading ? '검색중...' : '현 지도에서 재검색'}</span>
				</button>
			</div>

			<AnimatePresence>
				{isInfoWindowOpen && selectedMarker?.latitude && selectedMarker?.longitude && (
					<motion.div
						className="absolute z-[51] bottom-[-50px] left-0 h-[572px] rounded-2xl w-full bg-[#FFFFFF] p-4"
						initial={{ y: '100%' }}
						animate={{ y: 0 }}
						exit={{ y: '100%' }}
						transition={{ type: 'spring', stiffness: 120, damping: 20 }}>
						<div className="flex flex-col justify-center items-center mt-5">
							<button onClick={closeInfoWindow}>닫기</button>
							<div className="flex flex-col items-center">
								<h1 className="text-xl font-bold my-2">{selectedMarker.publicOfficeName}</h1>
								<p className="text-lg font-light">{selectedMarker.roadAddress}</p>
								<div
									className="flex my-2 items-center cursor-pointer"
									onClick={() => handleCopyPhoneNumber(selectedMarker.phoneNumber)}>
									<Icon name="CallIcon" className="mr-2" />
									{selectedMarker.phoneNumber}
								</div>
							</div>
							<div className="mt-24 flex flex-col items-center">
								<p className="font-medium text-2xl">
									<span className="font-bold text-3xl">김유스</span> 님을 위한 <br />
								</p>
								<p className="font-medium text-2xl">
									<UnderlineText text="복지서비스" />를 확인해보세요!
								</p>
							</div>
							<div className="flex items-end mt-6">
								<Icon name="GiftBoxIcon" className="w-[23px] h-[25px] mr-1" />
								<Icon name="GiftBoxIcon" className="w-[46px] h-[50px]" />
							</div>
							<div className="mt-8 flex flex-col">
								<Button text="내 복지카드 확인하러 가기" onClick={() => {}} />
								<Button
									text="전체 사업 확인하기"
									onClick={() => {}}
									className=" bg-white text-[#BBBBBB] shadow-none hover:bg-white"
								/>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
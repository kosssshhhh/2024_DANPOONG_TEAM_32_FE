import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Picker from 'react-mobile-picker';

import UnderlineText from '@components/UnderlineText';

import IconMyLocation from '@assets/svg/prev.svg?react';
import Button from '@components/Button';
import useCreateCardInfoStore from '@stores/useCreateCardInfoStore';

export default function SelectEmployment() {
	const navigate = useNavigate();

	const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);

	const { employ, setEmploy } = useCreateCardInfoStore();

	const employOptions = {
		employ: ['일용근로자', '단기근로자', '예비창업자', '재직자', '자영업자'],
	};

	// employ의 초기값을 employOptions의 첫 번째 값으로 설정
	useEffect(() => {
		if (!employ) {
			setEmploy(employOptions.employ[0]);
		}
	}, [employ, setEmploy]);

	// 다음 버튼 클릭 핸들러
	const handleNext = () => {
		navigate('/create-welfare-card/select-basic'); // 다음 화면으로 이동
	};

	// Picker 값의 타입 정의
	const value = { employ: employ };
	const handleChange = (newValue: { employ: string }) => {
		setEmploy(newValue.employ);
	};

	return (
		<div className="h-100% w-100%">
			<div className="bg-white m-5 h-15 cursor-pointer" onClick={() => navigate(-1)}>
				<IconMyLocation className="w-[20px] h-[20px]" />
			</div>
			<div className="flex flex-col items-center justify-center h-full bg-white px-4">
				<div className="flex flex-col text-center font-medium my-10">
					<h2 className="text-2xl text-black">
						<UnderlineText text="취업정보" />를 입력해주세요!
					</h2>
				</div>
				<div
					className="w-[334px] h-[53px] bg-[#F4F4F4] rounded-lg flex items-center justify-center text-black text-2xl"
					onClick={() => setIsInfoWindowOpen(true)}>
					{employ}
				</div>
				<Button
					text="다음으로 넘어가기"
					onClick={handleNext}
					className="fixed bottom-5 left-1/2 transform -translate-x-1/2"
				/>
			</div>

			<AnimatePresence>
				{isInfoWindowOpen && (
					<motion.div
						className="absolute z-[51] bottom-0 left-0 h-[300px] rounded-t-2xl w-full bg-[#FFFFFF] p-4 drop-shadow-[2px_2px_4px_#000000]"
						initial={{ y: '100%' }}
						animate={{ y: 0 }}
						exit={{ y: '100%' }}
						transition={{ type: 'spring', stiffness: 120, damping: 20 }}>
						<div className="flex justify-between items-center mb-4">
							<div></div>
							<button onClick={() => setIsInfoWindowOpen(false)} className="text-gray-500">
								완료
							</button>
						</div>
						<Picker value={value} onChange={handleChange}>
							{Object.keys(employOptions).map((name) => (
								<Picker.Column key={name} name={name}>
									{employOptions[name].map((option) => (
										<Picker.Item key={option} value={option}>
											{option}
										</Picker.Item>
									))}
								</Picker.Column>
							))}
						</Picker>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

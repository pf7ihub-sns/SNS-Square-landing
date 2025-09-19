import { Card } from "../../common/card";
import { SimpleRetroGrid } from "../../ui/simple-retro-grid";

const coreValues = [
	{
		id: 1,
		title: "Innovation",
		description:
			"We embrace cutting-edge technology and foster creative solutions that drive meaningful digital transformation.",
		icon: "/images/home/OCS-icon.png",
	},
	{
		id: 2,
		title: "Collaboration",
		description:
			"We work together, sharing knowledge and expertise to achieve collective success and deliver greater value.",
		icon: "/images/home/OCS-icon.png",
	},
	{
		id: 3,
		title: "Customer-Centricity",
		description:
			"Our clients are at the heart of everything we do. We strive to understand their needs and exceed their expectations.",
		icon: "/images/home/OCS-icon.png",
	},
	{
		id: 4,
		title: "Impact",
		description:
			"We are focused on delivering measurable results that make a real difference for our clients and their businesses.",
		icon: "/images/home/OCS-icon.png",
	},
	{
		id: 5,
		title: "Integrity and Trust",
		description:
			"We operate with transparency and honesty, building lasting relationships based on mutual trust and respect.",
		icon: "/images/home/OCS-icon.png",
	},
	{
		id: 6,
		title: "Adaptability",
		description:
			"In a fast-changing world, we pride ourselves on our ability to adapt, learn, and evolve to stay ahead of the curve.",
		icon: "/images/home/OCS-icon.png",
	},
];

export default function CoreValueSection() {
	return (
		<section
			className="w-full bg-no-repeat bg-cover bg-center overflow-hidden"
			style={{
				backgroundImage: "url('/images/home/Background-home-RS.png')",
			}}
		>
			<div className="p-8">
				<div className="max-w-[1480px] mx-auto">
					{/* First Row - Title on left, 1 card on right with spacing */}
					<div className="grid grid-cols-12">
						<div className="col-span-12 lg:col-span-3">
							<h2 className="text-4xl font-bold text-gray-900 text-balance">
								Our Core Values
							</h2>
							<p className="text-gray-600 text-lg leading-relaxed mt-4">
								Pre-built AI agents designed with advanced capabilities to
								serve
							</p>
						</div>
						<div className="col-span-12 lg:col-span-9 flex justify-end">
							<Card className="group relative w-[394px] h-[186px] p-6 bg-white border border-[#E5E5E5] shadow-sm transition-shadow rounded-[4px] overflow-hidden cursor-pointer">
								{/* Default State */}
								<div className="flex items-center gap-3 h-full transition-opacity duration-800 ease-in-out group-hover:opacity-0">
									<img
										src={coreValues[0].icon}
										alt={coreValues[0].title}
										className="w-7 h-6"
									/>
									<h4 className="text-lg font-medium text-gray-800">
										{coreValues[0].title}
									</h4>
								</div>
								{/* Hover State */}
								<div className="absolute inset-0 p-6 bg-[#EDFAFC] opacity-0 group-hover:opacity-100 transition-opacity duration-800 ease-in-out">
									<SimpleRetroGrid
										angle={220}
										cellSize={40}
										lineColor="#C8E0E5"
										opacity={0.6}
									/>
									<div className="relative z-10 flex flex-col h-full">
										<div className="flex items-center gap-3 mb-2">
											<img
												src={coreValues[0].icon}
												alt={coreValues[0].title}
												className="w-7 h-6"
											/>
											<h4
												className="text-lg font-medium"
												style={{
													background:
														"linear-gradient(90deg, #017BC0 0%, #02BBB7 100%)",
													WebkitBackgroundClip: "text",
													backgroundClip: "text",
													color: "transparent",
												}}
											>
												{coreValues[0].title}
											</h4>
										</div>
										<p className="text-sm text-gray-600 leading-relaxed">
											{coreValues[0].description}
										</p>
									</div>
								</div>
							</Card>
						</div>
					</div>

					{/* Second Row - 2 cards on right */}
					<div className="grid grid-cols-12">
						<div className="col-span-12 lg:col-span-3"></div>
						<div className="col-span-12 lg:col-span-9 flex justify-end ">
							{[coreValues[1], coreValues[2]].map((value) => (
								<Card
									key={value.id}
									className="group relative w-[394px] h-[186px] p-6 bg-white border border-[#E5E5E5] shadow-sm transition-shadow rounded-[4px] overflow-hidden cursor-pointer"
								>
									{/* Default State */}
									<div className="flex items-center gap-3 h-full transition-opacity duration-800 ease-in-out group-hover:opacity-0">
										<img
											src={value.icon}
											alt={value.title}
											className="w-7 h-6"
										/>
										<h4 className="text-lg font-medium text-gray-800">
											{value.title}
										</h4>
									</div>
									{/* Hover State */}
									<div className="absolute inset-0 p-6 bg-[#EDFAFC] opacity-0 group-hover:opacity-100 transition-opacity duration-800 ease-in-out">
										<SimpleRetroGrid
											angle={220}
											cellSize={40}
											lineColor="#C8E0E5"
											opacity={0.6}
										/>
										<div className="relative z-10 flex flex-col h-full">
											<div className="flex items-center gap-3 mb-2">
												<img
													src={value.icon}
													alt={value.title}
													className="w-7 h-6"
												/>
												<h4
													className="text-lg font-medium"
													style={{
														background:
															"linear-gradient(90deg, #017BC0 0%, #02BBB7 100%)",
														WebkitBackgroundClip: "text",
														backgroundClip: "text",
														color: "transparent",
													}}
												>
													{value.title}
												</h4>
											</div>
											<p className="text-sm text-gray-600 leading-relaxed">
												{value.description}
											</p>
										</div>
									</div>
								</Card>
							))}
						</div>
					</div>

					{/* Third Row - 3 cards on right */}
					<div className="grid grid-cols-12">
						<div className="col-span-12 lg:col-span-3"></div>
						<div className="col-span-12 lg:col-span-9 flex justify-end ">
							{coreValues.slice(3, 6).map((value) => (
								<Card
									key={value.id}
									className="group relative w-[394px] h-[186px] p-6 bg-white border border-[#E5E5E5] shadow-sm transition-shadow rounded-[4px] flex-shrink-0 overflow-hidden cursor-pointer"
								>
									{/* Default State */}
									<div className="flex items-center gap-3 h-full transition-opacity duration-800 ease-in-out group-hover:opacity-0">
										<img
											src={value.icon}
											alt={value.title}
											className="w-7 h-6"
										/>
										<h4 className="text-lg font-medium text-gray-800">
											{value.title}
										</h4>
									</div>
									{/* Hover State */}
									<div className="absolute inset-0 p-6 bg-[#EDFAFC] opacity-0 group-hover:opacity-100 transition-opacity duration-800 ease-in-out">
										<SimpleRetroGrid
											angle={220}
											cellSize={40}
											lineColor="#C8E0E5"
											opacity={0.6}
										/>
										<div className="relative z-10 flex flex-col h-full">
											<div className="flex items-center gap-3 mb-2">
												<img
													src={value.icon}
													alt={value.title}
													className="w-7 h-6"
												/>
												<h4
													className="text-lg font-medium"
													style={{
														background:
															"linear-gradient(90deg, #017BC0 0%, #02BBB7 100%)",
														WebkitBackgroundClip: "text",
														backgroundClip: "text",
														color: "transparent",
													}}
												>
													{value.title}
												</h4>
											</div>
											<p className="text-sm text-gray-600 leading-relaxed">
												{value.description}
											</p>
										</div>
									</div>
								</Card>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
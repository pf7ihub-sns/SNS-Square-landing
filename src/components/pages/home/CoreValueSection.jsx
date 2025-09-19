import { Card } from "../../common/card"

const coreValues = [
  {
    id: 1,
    title: "Innovation",
    icon: "💎",
  },
  {
    id: 2,
    title: "Collaboration",
    icon: "💎",
  },
  {
    id: 3,
    title: "Customer-Centricity",
    icon: "💎",
  },
  {
    id: 4,
    title: "Impact",
    icon: "💎",
  },
  {
    id: 5,
    title: "Integrity and Trust",
    icon: "💎",
  },
  {
    id: 6,
    title: "Adaptability",
    icon: "💎",
  },
]

export default function HomePage() {
  return (
    <section
      className="w-full bg-no-repeat bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/images/home/Background-home-RS.png')" }}
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
                Building Trust with Intelligent Agents
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex justify-end">
              <Card className="w-[394px] h-[186px] p-6 bg-white border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow rounded-[4px]">
                <div className="flex items-center gap-3 h-full">
                  <div className="w-5 h-5 bg-teal-600 transform rotate-45 flex-shrink-0"></div>
                  <h4 className="text-lg font-medium text-gray-800">
                    {coreValues[0].title}
                  </h4>
                </div>
              </Card>
            </div>
          </div>

          {/* Second Row - 2 cards on right */}
          <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-3"></div>
            <div className="col-span-12 lg:col-span-9 flex justify-end ">
              <Card className="w-[394px] h-[186px] p-6 bg-white border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow rounded-[4px]">
                <div className="flex items-center gap-3 h-full">
                  <div className="w-5 h-5 bg-teal-600 transform rotate-45 flex-shrink-0"></div>
                  <h4 className="text-lg font-medium text-gray-800">
                    {coreValues[1].title}
                  </h4>
                </div>
              </Card>
              <Card className="w-[394px] h-[186px] p-6 bg-white border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow rounded-[4px]">
                <div className="flex items-center gap-3 h-full">
                  <div className="w-5 h-5 bg-teal-600 transform rotate-45 flex-shrink-0"></div>
                  <h4 className="text-lg font-medium text-gray-800">
                    {coreValues[2].title}
                  </h4>
                </div>
              </Card>
            </div>
          </div>

          {/* Third Row - 3 cards on right */}
          <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-3"></div>
            <div className="col-span-12 lg:col-span-9 flex justify-end ">
              {coreValues.slice(3, 6).map((value) => (
                <Card
                  key={value.id}
                  className="w-[394px] h-[186px] p-6 bg-white border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow rounded-[4px] flex-shrink-0"
                >
                  <div className="flex items-center gap-3 h-full">
                    <div className="w-5 h-5 bg-teal-600 transform rotate-45 flex-shrink-0"></div>
                    <h4 className="text-lg font-medium text-gray-800">
                      {value.title}
                    </h4>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
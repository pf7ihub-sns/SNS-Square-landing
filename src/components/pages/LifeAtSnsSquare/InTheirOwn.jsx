import React from 'react';

const TestimonialCards = () => {
  return (
    <div className="bg-gray-50  p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">In Their Own Words</h1>
          <p className="text-xl text-gray-600">In Their Own Words</p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-80">
              {/* Background Image Area */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-200"></div>
              
              {/* Person Image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-28 h-28 bg-gray-400 rounded-full"></div>
                </div>
              </div>

              {/* Equipment/Props */}
              <div className="absolute top-4 left-4 w-16 h-10 bg-gray-800 rounded"></div>
              <div className="absolute top-6 right-6 w-8 h-12 bg-yellow-400 rounded"></div>
              <div className="absolute bottom-8 right-8 w-6 h-16 bg-gray-600 rounded"></div>
            </div>

            {/* Quote Section */}
            <div className="p-6 bg-gray-900 text-white relative">
              <div className="text-4xl font-bold mb-4">"</div>
              <p className="text-lg mb-6 leading-relaxed">
                There's this strong culture of collaboration and transparency that I've never seen before.
              </p>
              <div className="text-gray-400">
                <p>-Nitish Software Associate</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-80">
              {/* Background Image Area */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-gray-100 to-blue-200"></div>
              
              {/* Person Image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-28 h-28 bg-gray-400 rounded-full"></div>
                </div>
              </div>

              {/* Equipment/Props */}
              <div className="absolute top-4 left-4 w-16 h-10 bg-gray-800 rounded"></div>
              <div className="absolute top-6 right-6 w-8 h-12 bg-yellow-400 rounded"></div>
              <div className="absolute bottom-8 right-8 w-6 h-16 bg-gray-600 rounded"></div>
            </div>

            {/* Quote Section */}
            <div className="p-6 bg-gray-900 text-white relative">
              <div className="text-4xl font-bold mb-4">"</div>
              <p className="text-lg mb-6 leading-relaxed">
                There's this strong culture of collaboration and transparency that I've never seen before.
              </p>
              <div className="text-gray-400">
                <p>-Nitish Software Associate</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-80">
              {/* Background Image Area */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-gray-100 to-green-200"></div>
              
              {/* Person Image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-28 h-28 bg-gray-400 rounded-full"></div>
                </div>
              </div>

              {/* Equipment/Props */}
              <div className="absolute top-4 left-4 w-16 h-10 bg-gray-800 rounded"></div>
              <div className="absolute top-6 right-6 w-8 h-12 bg-yellow-400 rounded"></div>
              <div className="absolute bottom-8 right-8 w-6 h-16 bg-gray-600 rounded"></div>
            </div>

            {/* Quote Section */}
            <div className="p-6 bg-gray-900 text-white relative">
              <div className="text-4xl font-bold mb-4">"</div>
              <p className="text-lg mb-6 leading-relaxed">
                There's this strong culture of collaboration and transparency that I've never seen before.
              </p>
              <div className="text-gray-400">
                <p>-Nitish Software Associate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCards;
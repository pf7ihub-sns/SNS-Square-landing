import React, { useState } from 'react';
import Navbar from '../../common/Navbar';
import Footer from '../../common/Footer';
import GCCLogo from '../../../../public/images/gcc logo.png';
import GCCBuilding from '../../../../public/images/GCC_V1.png';
import DatabricksLogo from '../../../../public/images/databrick_logo_black.png';
import FoundationalAgent from '../../../../public/images/foundational_agent.png';
import AWSLogo from '../../../../public/images/AWS.png';
import SnowflakeLogo from '../../../../public/images/Snowflake.png';
import SalesForceLogo from '../../../../public/images/SalesForce.png';
import DatabricksCompanyLogo from '../../../../public/images/Databricks.png';
import AzureLogo from '../../../../public/images/AZURE.png';
import GoogleCloudLogo from '../../../../public/images/google_cloud.png';
import NvidiaLogo from '../../../../public/images/nvidia.png';
import BigQueryLogo from '../../../../public/images/google_big_query.png';
import ServiceNowLogo from '../../../../public/images/servicenow.png';
import Texture from '../../../../public/images/Bg.png'

const GCCPage = () => {
    const [hoveredPillar, setHoveredPillar] = useState(null);

    const pillarCards = {
        build: {
            title: 'Build',
            description: 'Establish robust GCC infrastructure with cutting-edge data architecture and AI capabilities',
            color: '#FFD700',
            bgColor: '#FFF9E6',
        },
        operate: {
            title: 'Operate',
            description: 'Streamline operations with intelligent automation and real-time monitoring systems',
            color: '#DC143C',
            bgColor: '#FFE6E6',
        },
        transfer: {
            title: 'Transfer',
            description: 'Seamlessly migrate and integrate data across platforms with zero downtime',
            color: '#2E8B57',
            bgColor: '#E6F7EF',
        }
    };

    return (
        <div className="relative bg-white min-h-screen">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section with Gradient Ellipses */}
            <section
                className="relative min-h-screen flex flex-col items-center justify-center px-2 sm:px-4 md:px-8 pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-16 md:pb-20 overflow-hidden"
                style={{
                    backgroundImage: `url(${Texture})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Gradient Ellipse 1 - large, light radial gradient anchored left */}
                <div
                    className="absolute w-[600px] sm:w-[800px] md:w-[1100px] h-[600px] sm:h-[800px] md:h-[1100px] rounded-full blur-3xl"
                    style={{
                        left: '-5%',
                        top: '-10%',
                        pointerEvents: 'none',
                        // background: 'radial-gradient(circle at 20% 30%, rgba(6,78,227,0.18) 0%, rgba(6,78,227,0.09) 45%, transparent 75%)'
                    }}
                />

                {/* Gradient Ellipse 2 - large, light radial gradient anchored right */}
                <div
                    className="absolute w-[700px] sm:w-[900px] md:w-[1200px] h-[700px] sm:h-[900px] md:h-[1200px] rounded-full blur-3xl"
                    style={{
                        right: '-5%',
                        top: '-12%',
                        pointerEvents: 'none',
                        // background: 'radial-gradient(circle at 80% 30%, rgba(75,190,252,0.14) 0%, rgba(75,190,252,0.08) 45%, transparent 75%)'
                    }}
                />

                {/* Content */}
                <div className="relative z-10 text-center max-w-5xl mx-auto mb-8 sm:mb-12 md:mb-16 mt-2 sm:mt-4 md:mt-6">
                    {/* GCC Logo */}
                    <div className="flex justify-center mb-4 sm:mb-6 md:mb-4">
                        <img
                            src={GCCLogo}
                            alt="GCC Logo"
                            className="w-48 sm:w-56 md:w-64 lg:w-72 h-auto"
                        />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 sm:mb-4 md:mb-2 px-4">
                        SNS Square
                    </h1>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-12 md:mb-1 px-4">
                        GCC Build and Operation Specialist
                    </h1>

                    <p className="text-base sm:text-lg md:text-lg text-gray-600 mt-4 sm:mt-5 md:mt-5 mb-2 sm:mb-8 md:mb-4 max-w-3xl mx-auto leading-relaxed px-4">
                        Harness the combined power of integrated data and Agentic AI to build a intelligent, future-proof operational hub.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 ">
                        <a
                            href="/agent-workbench"
                            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-yellow-400 border-2 border-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors duration-200 shadow-lg text-center"
                        >
                            Get Started
                        </a>
                        <a
                            href="/contactus"
                            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-800 text-gray-800 font-semibold rounded-lg hover:bg-black hover:text-white transition-colors duration-200 text-center"
                        >
                            Contact US
                        </a>
                    </div>
                </div>

                {/* Building Image with Pillars */}
                <div className="relative z-10 w-full mt-4 sm:mt-6 md:-mt-15">
                    {/* Static Building Image with Texture Background - FULL WIDTH */}
                    <div
                        className="w-screen h-[400px] xs:h-[450px] sm:h-[550px] md:h-[650px] lg:h-[700px] xl:h-[750px] 2xl:h-[802px] relative overflow-hidden"
                        style={{
                            backgroundImage: `url(${Texture})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            marginLeft: 'calc(-50vw + 50%)',
                            marginRight: 'calc(-50vw + 50%)'
                        }}
                    >
                        <div className="relative w-full h-full flex items-end justify-center max-w-5xl mx-auto px-2 sm:px-4">
                            <img
                                src={GCCBuilding}
                                alt="GCC Building"
                                width={1200}
                                height={800}
                                className="w-full h-auto"
                                quality={100}
                                unoptimized={true}
                            />

                            {/* Pillar Labels - Positioned absolutely over the building image */}
                            {/* Left Pillar - Build */}
                            <div
                                className="absolute cursor-pointer transition-all duration-300 hover:scale-110 left-[28.5%] bottom-[20%] sm:bottom-[24%] md:bottom-[26%] transform -translate-x-1/2"
                                onMouseEnter={() => setHoveredPillar('build')}
                                onMouseLeave={() => setHoveredPillar(null)}
                            >
                                <span
                                    className="block text-white font-bold text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl"
                                    style={{
                                        writingMode: 'vertical-rl',
                                        textOrientation: 'mixed',
                                        transform: 'rotate(180deg)',
                                        letterSpacing: '0.15em',
                                        textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
                                    }}
                                >
                                    Build
                                </span>
                            </div>

                            {/* Middle Pillar - Operate (Red) */}
                            <div
                                className="absolute cursor-pointer transition-all duration-300 hover:scale-110 left-[48.5%] bottom-[20%] sm:bottom-[24%] md:bottom-[26%] transform -translate-x-1/2"
                                onMouseEnter={() => setHoveredPillar('operate')}
                                onMouseLeave={() => setHoveredPillar(null)}
                            >
                                <span
                                    className="block text-white font-bold text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl"
                                    style={{
                                        writingMode: 'vertical-rl',
                                        textOrientation: 'mixed',
                                        transform: 'rotate(180deg)',
                                        letterSpacing: '0.15em',
                                        textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
                                    }}
                                >
                                    Operate
                                </span>
                            </div>

                            {/* Right Pillar - Transfer (Green) */}
                            <div
                                className="absolute cursor-pointer transition-all duration-300 hover:scale-110 left-[69.3%] bottom-[20%] sm:bottom-[24%] md:bottom-[26%] transform -translate-x-1/2"
                                onMouseEnter={() => setHoveredPillar('transfer')}
                                onMouseLeave={() => setHoveredPillar(null)}
                            >
                                <span
                                    className="block text-white font-bold text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl"
                                    style={{
                                        writingMode: 'vertical-rl',
                                        textOrientation: 'mixed',
                                        transform: 'rotate(180deg)',
                                        letterSpacing: '0.15em',
                                        textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
                                    }}
                                >
                                    Transfer
                                </span>
                            </div>

                            {/* Hover Descriptions - Inside the building container - Only visible on larger screens */}
                            {hoveredPillar && (
                                (() => {
                                    const bg = pillarCards[hoveredPillar].color;
                                    const textColor = hoveredPillar === 'build' ? '#000' : '#fff';

                                    // Position based on which pillar
                                    let positionStyles = {};
                                    let arrowStyles = {};

                                    if (hoveredPillar === 'build') {
                                        positionStyles = {
                                            left: '-13%',
                                            top: '60%',
                                            transform: 'translateY(-50%)'
                                        };
                                        arrowStyles = {
                                            position: 'absolute',
                                            right: -12,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: 0,
                                            height: 0,
                                            borderTop: '12px solid transparent',
                                            borderBottom: '12px solid transparent',
                                            borderLeft: `12px solid ${bg}`
                                        };
                                    } else if (hoveredPillar === 'operate') {
                                        positionStyles = {
                                            left: '49%',
                                            top: '26%',
                                            transform: 'translateX(-50%)'
                                        };
                                        arrowStyles = {
                                            position: 'absolute',
                                            bottom: -12,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 0,
                                            height: 0,
                                            borderLeft: '12px solid transparent',
                                            borderRight: '12px solid transparent',
                                            borderTop: `12px solid ${bg}`
                                        };
                                    } else if (hoveredPillar === 'transfer') {
                                        positionStyles = {
                                            right: '-12%',
                                            top: '60%',
                                            transform: 'translateY(-50%)'
                                        };
                                        arrowStyles = {
                                            position: 'absolute',
                                            left: -12,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: 0,
                                            height: 0,
                                            borderTop: '12px solid transparent',
                                            borderBottom: '12px solid transparent',
                                            borderRight: `12px solid ${bg}`
                                        };
                                    }

                                    return (
                                        <div className="hidden lg:block absolute z-50" style={positionStyles}>
                                            <div className="relative px-6 py-4 rounded-lg shadow-2xl max-w-sm"
                                                style={{ backgroundColor: bg }}
                                            >
                                                {/* Arrow */}
                                                <div style={arrowStyles} />

                                                <h3 className="font-bold text-lg lg:text-xl mb-2" style={{ color: textColor }}>
                                                    {pillarCards[hoveredPillar].title}
                                                </h3>
                                                <p className="text-sm lg:text-base" style={{ color: textColor }}>
                                                    {pillarCards[hoveredPillar].description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })()
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Cards and Logo Section with Blue Triangle Gradient */}
            <section className="py-10 sm:py-16 md:py-20 px-4 md:px-8 bg-white relative overflow-hidden">
                {/* Blue Triangle Blur Effect */}
                <div
                    className="absolute w-[500px] sm:w-[650px] md:w-[800px] h-[500px] sm:h-[650px] md:h-[800px] rounded-full blur-3xl pointer-events-none"
                    style={{
                        left: '50%',
                        top: '100%',
                        transform: 'translate(-50%, -50%)',
                        background: 'radial-gradient(circle, rgba(147, 197, 253, 0.4) 0%, rgba(96, 165, 250, 0.25) 50%, transparent 70%)'
                    }}
                />

                <div className="relative z-10 max-w-6xl mx-auto">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 md:mb-20">
                        {/* Databricks Card */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 sm:p-8 bg-white border rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex-shrink-0">
                                <img
                                    src={DatabricksLogo}
                                    alt="Databricks"
                                    className="w-40 sm:w-48 md:w-54 h-auto p-2 sm:p-3 rounded-lg"
                                />
                            </div>
                            {/* Vertical Divider - Hidden on mobile */}
                            <div className="hidden sm:block h-24 sm:h-30 w-0.5 bg-gray-400"></div>
                            {/* Horizontal Divider - Visible on mobile */}
                            <div className="block sm:hidden w-24 h-0.5 bg-gray-400"></div>
                            <div className="text-center sm:text-left">
                                <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">150+</div>
                                <div className="text-lg sm:text-xl text-gray-700">Certified AI Associates</div>
                            </div>
                        </div>

                        {/* Foundational Agents Card */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 sm:p-8 bg-white border rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex-shrink-0">
                                <img
                                    src={FoundationalAgent}
                                    alt="Foundational Agents"
                                    className="w-24 sm:w-28 md:w-32 h-auto"
                                />
                            </div>
                            {/* Vertical Divider - Hidden on mobile */}
                            <div className="hidden sm:block h-24 sm:h-30 w-0.5 bg-gray-400"></div>
                            {/* Horizontal Divider - Visible on mobile */}
                            <div className="block sm:hidden w-24 h-0.5 bg-gray-400"></div>
                            <div className="text-center sm:text-left">
                                <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">1500+</div>
                                <div className="text-lg sm:text-xl text-gray-700">Foundational Agents, Industry<br />Specific Agents & Solutions</div>
                            </div>
                        </div>
                    </div>

                    {/* Company Logos */}
                    <div className="mt-8 sm:mt-12 md:mt-16">
                        {/* First Row - 5 Logos */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-10 md:mb-12 items-center justify-items-center">
                            <div className="transition-transform duration-300 hover:scale-110">
                                <img src={AWSLogo} alt="AWS" className="h-10 sm:h-12 md:h-16 w-auto opacity-100 transition-opacity" />
                            </div>
                            <div className="transition-transform duration-300 hover:scale-110">
                                <img src={SnowflakeLogo} alt="Snowflake" className="h-8 sm:h-10 md:h-12 w-auto opacity-100 transition-opacity" />
                            </div>
                            <div className="transition-transform duration-300 hover:scale-110">
                                <img src={SalesForceLogo} alt="Salesforce" className="h-10 sm:h-12 md:h-16 w-auto opacity-100 transition-opacity" />
                            </div>
                            <div className="transition-transform duration-300 hover:scale-110">
                                <img src={DatabricksCompanyLogo} alt="Databricks" className="h-6 sm:h-7 md:h-8 w-auto opacity-100 transition-opacity" />
                            </div>
                            <div className="col-span-2 sm:col-span-1 transition-transform duration-300 hover:scale-110">
                                <img src={AzureLogo} alt="Azure" className="h-10 sm:h-12 md:h-16 w-auto opacity-100 transition-opacity" />
                            </div>
                        </div>

                        {/* Second Row - 4 Logos */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 items-center justify-items-center">
                            <div className="transition-transform duration-300 hover:scale-110">
                                <img src={GoogleCloudLogo} alt="Google Cloud" className="h-7 sm:h-8 md:h-10 w-auto opacity-100 transition-opacity" />
                            </div>
                            <div className="transition-transform duration-300 hover:scale-110">
                                <img src={NvidiaLogo} alt="NVIDIA" className="h-10 sm:h-12 md:h-16 w-auto opacity-100 transition-opacity" />
                            </div>
                            <div className="transition-transform duration-300 hover:scale-110">
                                <img src={BigQueryLogo} alt="BigQuery" className="h-10 sm:h-12 md:h-16 w-auto opacity-100 transition-opacity" />
                            </div>
                            <div className="transition-transform duration-300 hover:scale-110">
                                <img src={ServiceNowLogo} alt="ServiceNow" className="h-7 sm:h-8 md:h-10 w-auto opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            {/* <Footer /> */}
        </div>
    );
};

export default GCCPage;

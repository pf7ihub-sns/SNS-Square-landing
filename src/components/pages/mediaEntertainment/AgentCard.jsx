import React from 'react';
import { motion } from 'framer-motion';
import AgentImage from "../../../../public/images/agentbot.png";

const AgentCard = ({ agent, index, onTryAgent, onViewAgent }) => {
    return (
        <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-[#B6B9BE] p-6 hover:shadow-lg transition-all duration-200 flex flex-col h-full"
        >
            {/* Agent Icon and Status */}
            <div className="flex justify-between items-start mb-5">
                <div className="w-15 h-15 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center p-2 ">
                    <img
                        src={AgentImage}
                        alt={agent.name}
                        className="w-full h-full object-contain"
                    />
                </div>
                <span
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full ${agent.status === 'available'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : agent.status === 'not available'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        }`}
                >
                    {agent.status === 'available'
                        ? 'Available'
                        : agent.status === 'not available'
                            ? 'Not Available'
                            : 'Status Unknown'}
                </span>
            </div>

            {/* Agent Title */}
            <h3 className="text-xl font-medium text-[#000] mb-2 leading-tight -mt-4">
                {agent.name}
            </h3>

            {/* Agent Description */}
            <p className="text-[#5F5F60] text-sm mb-3 leading-relaxed flex-1 line-clamp-3">
                {agent.summary || agent.description}
            </p>

            {/* Solutions Preview */}
            {agent.solutions && agent.solutions.length > 0 && (
                <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                        {agent.solutions.slice(0, 2).map((solution, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg border border-blue-100"
                            >
                                {solution}
                            </span>
                        ))}
                        {agent.solutions.length > 2 && (
                            <span className="px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-600 rounded-lg border border-gray-200">
                                +{agent.solutions.length - 2} more
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-auto flex gap-4">
                <button
                    onClick={() => onTryAgent(agent.id)}
                    className="flex-1 px-6 py-2 bg-[#155DFC] hover:bg-blue-700 text-white rounded-lg text-[14px] font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    Try Agent
                </button>
                <button
                    onClick={() => onViewAgent(agent.id)}
                    className="flex-1 px-6 py-2 text-[#155DFC] hover:text-blue-700 border border-blue-300 hover:border-blue-400 hover:bg-blue-50 rounded-lg text-[14px] font-medium transition-all duration-200"
                >

                    Details
                </button>
            </div>
        </motion.div>
    );
};

export default AgentCard;
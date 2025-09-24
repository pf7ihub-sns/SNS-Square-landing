import React from 'react'
import BlackButton from '../../common/BlackButton';

const LoginForm = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 relative">
            <div className="flex items-center justify-center min-h-screen px-4 w-full">
                <div className="w-full max-w-[600px]">
                    <div
                        className="flex items-center justify-center mb-6"
                    >
                        <img
                            src="/images/square_logo_black.png"
                            alt="SNS Square Logo"
                            className="w-[100px] sm:w-[150px]"
                        />
                    </div>
                    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 w-full max-w-[600px] mx-auto">
                        <div className="w-full">
                            <h3 className="text-xl sm:text-2xl font-semibold">Login to your account</h3>
                            <p className="text-gray-500 mb-6 sm:mb-8 mt-4 sm:mt-4 text-sm sm:text-base">Lorem ipsum nisi lorem turpis</p>
                            <div className="space-y-6 py-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Email ID*"
                                        className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        type="password"
                                        placeholder="Password*"
                                        className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                            <p className="text-gray-500  mt-6 mb-6">By continuing, you agree to our Terms of Service</p>
                            <BlackButton className="w-full bg-black ">
                                Continue
                            </BlackButton>
                        </div>
                    </div>
                    <div className='justify-center flex mt-6 gap-2 text-sm sm:text-base'>
                        <p className="">Don't have an account? </p>
                        <a href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">Signup</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm
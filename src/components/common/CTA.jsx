import React, { useState, useEffect } from 'react';
import Button from './Button2.jsx';
import useNewsletterStore from '../../store/newsletterStore.js';

const CTASection = () => {
  const [email, setEmail] = useState('');
  const { subscribeToNewsletter, isLoading, isSuccess, error, message, resetState } = useNewsletterStore();

  const handleSubmit = async () => {
    if (!email || !email.trim()) {
      alert('Please enter your email address');
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    const result = await subscribeToNewsletter(email);
    
    if (result.success) {
      setEmail('');
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  return (
    <section id="cta-section" className="w-full mt-[50px] sm:mt-[80px] md:mt-[100px] mb-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1200px] mx-auto">
<div
  className="border border-[#e3e0e0] rounded-[32px] p-6 sm:p-8 md:p-12 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `
      url('/images/img_67c0570ea854203522bca87aherobgpatternavif_414x1224.png'),
      linear-gradient(to top, #dfe9fb 0%, #ffffff 100%)
    `,
   
  }}
>

          <div className="flex flex-col justify-center items-center w-full">
            <div className="flex flex-col justify-start items-center w-full lg:w-[74%] mt-8">
              {/* Main Heading */}
              <h2 className="text-[32px] sm:text-[42px] md:text-[54px] font-sora font-semibold leading-[40px] sm:leading-[56px] md:leading-[69px] text-center text-global-7">
                Let's Build Your Agentic Future
              </h2>

              {/* Subtitle */}
              <p className="text-[16px] sm:text-[18px] md:text-[20px] font-inter font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] text-center text-global-7 w-full mt-6 sm:mt-8">
                Ready to transform your business with Agentic AI, autonomous solutions? Partner with us and take the first step into the Agentic era.
              </p>

              {/* Email Input and CTA */}
             <div className="w-full bg-global-7 rounded-[32px] p-2 sm:p-4 mt-8 sm:mt-12">
            <div className="w-full max-w-3xl mx-auto">
            <div className="flex flex-col [@media(min-width:530px)]:relative [@media(min-width:530px)]:block w-full">
              {/* Input */}
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                disabled={isLoading}
                className="w-full h-16 [@media(min-width:530px)]:h-20 rounded-full pl-6 [@media(min-width:530px)]:pr-40 text-sm sm:text-base font-inter font-light text-global-3 bg-white border-none outline-none mb-3 [@media(min-width:530px)]:mb-0 disabled:opacity-50 disabled:cursor-not-allowed"
              />

              {/* Button */}
              <Button
                variant="primary"
                size="medium"
                className="w-full text-white [@media(min-width:530px)]:w-auto [@media(min-width:530px)]:absolute [@media(min-width:530px)]:top-1/2 [@media(min-width:530px)]:right-2 [@media(min-width:530px)]:-translate-y-1/2 rounded-[26px] px-6 py-[14px] text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Talk to an Expert'}
              </Button>
            </div>
          </div>

          </div>
              </div>
            </div>
          </div>
        </div>
      
    </section>
  );
};

export default CTASection;
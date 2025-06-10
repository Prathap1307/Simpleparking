'use client';

import { useRouter } from 'next/navigation';
import {Button} from "@heroui/react";
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function CancelPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4">
        <DotLottieReact
            src="https://lottie.host/12fa9546-2ba9-4d0f-96cf-672f36cdf6cb/5HYyNqjC5o.lottie"
            loop
            autoplay
            className=' w-1/2 h-1/2'
        />

      <h1 className="text-3xl font-bold text-red-600 mt-6">Payment Failed</h1>
      <p className="text-gray-600 mt-2 mb-6">Oops! Something went wrong with your payment.</p>

      <Button color="primary" variant="ghost" onClick={handleGoBack}>
        Go Back
      </Button>
    </div>
  );
}

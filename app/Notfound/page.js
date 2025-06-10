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
            src="https://lottie.host/689353f5-c8ac-4a48-98de-8217ceee6b33/4WD1VBEsa6.lottie"
            loop
            autoplay
            className=' w-1/2 h-1/2'
        />

      <h1 className="text-3xl font-bold text-red-600 mt-6"> Page Not found </h1>
      <p className="text-gray-600 mt-2 mb-6">Oops! Something went wrong .</p>

      <Button color="primary" variant="ghost" onClick={handleGoBack}>
        Go Back
      </Button>
    </div>
  );
}

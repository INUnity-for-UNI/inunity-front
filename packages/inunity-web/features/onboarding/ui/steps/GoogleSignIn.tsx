"use client";

import { Typography } from "ui";
import { FcGoogle } from "react-icons/fc";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import FadeInOutStep from "./FadeInOutStep";

interface GoogleSignInProps {
  onAttachCertificate: () => void;
}

export default function GoogleSignIn({
  onAttachCertificate,
}: GoogleSignInProps) {
  const [shown, setShown] = useState(true); // 텍스트가 보이는지 여부

  return (
    <FadeInOutStep shown={shown}>
      <Typography variant="HeadingLargeBold" className="mb-4">
        이제 학과 인증을 위해
        <br />
        구글 로그인을 시도할게요.
      </Typography>
      <div className="flex justify-center items-center flex-1">
        <button
          onClick={() => {
            // google login page로 이동
            document.location = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/google`;
          }}
          className="flex items-center justify-center p-3 border border-gray-300 rounded-sm shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          <span className="text-gray-700 font-medium">
            Google 계정으로 로그인
          </span>
        </button>
      </div>
      <div className="mt-auto flex flex-col gap-4" style={{ marginBottom: 30 }}>
        <div className="text-center" onClick={onAttachCertificate}>
          학교 웹메일 계정이 없나요?
        </div>
      </div>
    </FadeInOutStep>
  );
}

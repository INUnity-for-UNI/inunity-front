"use client";

import React, { useState, useEffect } from "react";
import { useNativeRouter } from "@/hooks/useNativeRouter";
import AppBar from "@/widgets/AppBar";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, Typography } from "ui";
import fetchExtended from "@/lib/fetchExtended";
import usePortfolio from "@/entities/profile/hooks/usePortfolio";
import useEditPortfolio from "@/features/profile/hooks/useEditPortfolio";
import usePostPortfolio from "@/features/profile/hooks/usePostPortfolio";
import { useQueryClient } from "@tanstack/react-query";
import LoadingOverlay from "@/shared/ui/LoadingOverlay";

interface MyPortfolioProps {
  portfolioId?: number; // Optional for creation mode
}

export default function MyPortfolio({ portfolioId }: MyPortfolioProps) {
  const [userId, setUserId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useNativeRouter();
  const queryClient = useQueryClient();

  const isEditMode = !!portfolioId;

  const { data: portfolios, isLoading } = usePortfolio(
    isEditMode ? userId || 0 : 0
  );
  const { mutate: editPortfolio } = useEditPortfolio(userId || 0);
  const { mutate: postPortfolio } = usePostPortfolio(userId || 0);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetchExtended<{ id: number }>(
          "/v1/users/information",
          { method: "GET", credentials: "include" }
        );
        setUserId(response.id);
      } catch (error) {
        console.error("Failed to fetch user information:", error);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (isEditMode && portfolios) {
      const portfolio = portfolios.find((p) => p.portfolioId === portfolioId);
      if (portfolio) {
        setTitle(portfolio.title || "");
        setStartDate(portfolio.startDate || "");
        setEndDate(portfolio.endDate || "");
        setUrl(portfolio.url || "");
      }
    }
  }, [portfolios, portfolioId, isEditMode]);

  const handleSubmit = () => {
    if (!userId) {
      alert("유저 정보를 불러오지 못했습니다.");
      return;
    }

    setLoading(true);

    if (isEditMode) {
      editPortfolio(
        { portfolioId: portfolioId!, title, startDate, endDate, url },
        {
          onSuccess: () => {
            setLoading(false);
            console.log("수정 성공");
            queryClient.invalidateQueries({ queryKey: ["portfolios", userId] });
            queryClient.invalidateQueries({ queryKey: ["profile", userId] });
            router.back();
          },
          onError: (err) => {
            setLoading(false);
            console.error("수정 실패:", err);
          },
        }
      );
    } else {
      postPortfolio(
        { title, startDate, endDate, url },
        {
          onSuccess: () => {
            setLoading(false);
            console.log("생성 성공");
            queryClient.invalidateQueries({ queryKey: ["portfolios", userId] });
            queryClient.invalidateQueries({ queryKey: ["profile", userId] });
            router.back();
          },
          onError: (err) => {
            setLoading(false);
            console.error("생성 실패:", err);
          },
        }
      );
    }
  };

  return (
    <div className="flex-col items-center overflow-hidden">
      <LoadingOverlay isLoading={loading} />
      <AppBar
        center={
          <Typography variant="HeadingNormalBold">
            {isEditMode ? "프로젝트 수정" : "프로젝트 생성"}
          </Typography>
        }
        leftIcon={
          <FontAwesomeIcon icon={faChevronLeft} onClick={() => router.back()} />
        }
        rightIcon={
          <div
            className="w-fit text-sm font-medium whitespace-nowrap cursor-pointer"
            onClick={handleSubmit}
          >
            완료
          </div>
        }
      />

      <div className="self-stretch flex flex-col items-start gap-6 px-5 py-4">
        <div className="flex flex-col gap-2">
          <Typography variant="HeadingSmallBold">프로젝트 이름</Typography>
          <Input
            value={title}
            setValue={setTitle}
            placeholder="프로젝트 이름을 입력하세요"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="HeadingSmallBold">진행 기간</Typography>
          <div className="flex flex-col gap-4">
            <Input
              value={startDate}
              setValue={setStartDate}
              placeholder="시작 일자"
              type="date"
            />
            <Input
              value={endDate}
              setValue={setEndDate}
              placeholder="종료 일자"
              type="date"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="HeadingSmallBold">URL</Typography>
          <Input value={url} setValue={setUrl} placeholder="URL을 입력하세요" />
        </div>
      </div>
    </div>
  );
}

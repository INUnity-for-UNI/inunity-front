"use client";

import {
  faSearch,
  IconName,
  fas,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(fas);
import React, { useState } from "react";
import { Divider, Input, SimpleListItem, Typography } from "ui";
import { useNativeRouter } from "@/hooks/useNativeRouter";
import useCategories from "@/entities/category/hooks/useCategories";


export default function BoardListContainer() {
  const [searchValue, setSearchValue] = useState("");

  const categoryQuery = useCategories();
  const categories = categoryQuery.data?.map((category, idx) => ({
    ...category,
  }));
  const router = useNativeRouter();

  return (
    <div className=" bg-gray-50">
      <div className="self-stretch grow shrink basis-0 bg-gray-50 flex-col justify-start items-center gap-2.5 flex">
        <div className="self-stretch p-5 py-2 bg-white flex-col justify-start items-start gap-2.5 flex">
          <Typography variant="HeadingXLargeBold">게시판</Typography>
          <Input
            value={searchValue}
            setValue={setSearchValue}
            leftIcon={<FontAwesomeIcon icon={faSearch} />}
            className="self-stretch"
            placeholder="게시판을 검색해보세요.."
          />
        </div>
        <div className="bg-white self-stretch p-5 flex flex-col gap-4">
          {categories?.map((menu) => (
            <SimpleListItem
              text={menu.name}
              key={menu.id}
              leftIcon={<FontAwesomeIcon icon={menu.icon as IconName} />}
              onClick={() => {
                router.push(`/article/${menu.id}`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

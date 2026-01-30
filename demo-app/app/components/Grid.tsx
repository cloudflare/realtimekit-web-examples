import React, { useMemo } from "react";
import { useSharedState } from "~/context/hook";
import { getList } from "~/utils/utils";
import Card from "./Card";
import iconsData from "../components/icons/icons.json";

const Grid = () => {
  const { usecase, framework, search } = useSharedState();

  const list = useMemo(() => {
    return getList(framework, usecase, search);
  }, [framework, usecase, search]);

  return (
    <>
      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(300px,1fr))] justify-items-start lg:gap-8 md:gap-6 gap-4">
        {list.map((el) => {
          return <Card key={el.id} {...el} platform={el.platform as keyof typeof iconsData} />;
        })}
      </div>
   </>
  );
};

export default Grid;

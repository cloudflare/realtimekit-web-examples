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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:w-[60vw] lg:min-w-[800px] md:w-[70vw] w-80 gap-8 ">
        {list.map((el) => {
          return <Card key={el.id} {...el} platform={el.platform as keyof typeof iconsData} />;
        })}
      </div>
   </>
  );
};

export default Grid;

import React from "react";
import { Icon } from "./icons";
import iconsData from "../components/icons/icons.json";
import { useSharedState } from "~/context/hook";
import { getPresetName } from "~/utils/utils";
import type { Usecase } from "~/context";

type CardProps = {
  name: string;
  githubUrl?: string;
  platform: keyof typeof iconsData;
  picture?: string;
  url: string;
  preset: string;
  blogUrl: string;
  usecase: Usecase;
  description: string;
};

const Card = ({
    // url,
    name,
    githubUrl,
    // platform,
    picture,
    preset,
    usecase,
    blogUrl,
    description,
  }: CardProps) => {
  const { framework, usecase: selectedUsecase } = useSharedState()
  return (
    <div
      className="light:bg-white bg-black rounded-xl overflow-hidden border border-[#1d1d21] light:border-gray-200 text-left flex flex-col w-[31%] min-w-[300px] min-h-[380px]"
    >
      <div className="w-full h-40">
        {
          picture ? <img src={picture} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-neutral-200"></div>
        }
      </div>
      
      <div className="px-5 py-5 space-y-2 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="!text-lg sm:text-base font-semibold light:text-neutral-900 text-neutral-50">
            {name.replaceAll("-", " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
          </h3>
          {/* TODO(ikabra): Uncomment later when we add samples for more platforms */}
          {/* <div className="flex items-center gap-1 text-orange-400 light:text-orange-600 text-sm bg-orange-500/30 light:bg-orange-100 px-2 py-1 rounded-full">{platform?.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} <Icon name={platform} size={14} /></div> */}
        </div>
        {/* TODO(ikabra): Uncomment later when we add samples from external collaborators */}
        {/* <p className="text-xs sm:text-sm text-neutral-400 light:text-neutral-500">
          by RealtimeKit Team
        </p> */}
        <p className="mt-2 text-xs sm:text-sm text-neutral-400 light:text-neutral-600 overflow-hidden text-ellipsis">
          {description}
        </p>
      </div>
      <div className="mx-5 border-t border-[#2a242b] light:border-gray-200" />
      <div className="flex flex-row items-center justify-between gap-2 mt-auto">
        <div onClick={() => {
          const state = btoa(encodeURIComponent(`${name}_${framework}_${selectedUsecase}`));
          window.open(`/meeting?state=${state}&preset=${usecase === 'all' ? getPresetName(selectedUsecase) : preset}`, "_blank")
        }} className="px-2 mx-3 py-1 my-2 rounded-md text-sm cursor-pointer font-medium bg-orange-600 text-white light:text-orange-600 light:bg-orange-100 border-orange-500 border flex flex-row items-center gap-1">
          <span>Demo</span>
          <Icon name="arrow" />
        </div>
        <div
          className="px-5 py-4 text-sm cursor-pointer font-medium text-neutral-400 light:text-neutral-500 flex flex-row items-center gap-1"
          onClick={() => {
            if (!githubUrl) return;
            window.open(githubUrl, "_blank");
          }}
        >
           <Icon name="github" />
          <span>Github</span>
         
        </div>
       {blogUrl && <div className="px-5 py-4 text-sm cursor-pointer font-medium text-neutral-400 light:text-neutral-500 flex flex-row items-center gap-1" onClick={() => {
           
            window.open(blogUrl, "_blank");
          }}>
          <Icon name="arrow" />
          <span>Blog</span>
          
        </div>}
      </div>
    </div>
  );
};

export default Card;

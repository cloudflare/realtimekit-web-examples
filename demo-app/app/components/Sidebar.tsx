import React from 'react'
import type { Framework, Usecase } from "~/context";
import iconsData from "../components/icons/icons.json";
import { useSharedState } from "~/context/hook";
import { Icon } from "../components/icons";

interface UsecaseOption {
  id: Usecase;
  label: string;
  icon: keyof typeof iconsData;
}

const Sidebar = () => {
    const { framework, setFramework, usecase, setUsecase, search, setSearch } = useSharedState();
    const frameworks: { id: Framework; label: string; icon: keyof typeof iconsData }[] = [
        {
        label: "React",
        id: "react",
        icon: "react",
        },
        {
        label: "Javascript",
        id: "html",
        icon: "web",
        },
        {
        label: "Angular",
        id: "angular",
        icon: "angular",
        },
    ];

    const usecases: UsecaseOption[] = [
        {
        label: "Video Calls",
        id: "video",
        icon: "conferencing",
        },
        {
        label: "Audio Calls",
        id: "audio",
        icon: "audio",
        },
        {
        label: "Webinars",
        id: "webinar",
        icon: "webinar",
        },
        {
        label: "Livestreaming",
        id: "livestream",
        icon: "livestream",
        },
    ];

    return (
        <div className='md:!w-[250px] flex flex-col gap-4 w-full'>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search Examples' className='focus:outline-none w-full px-2 py-1.5 light:bg-white bg-neutral-800 border light:border-neutral-300 border-neutral-700 rounded-md light:text-neutral-700 text-neutral-200' />
            <p className='font-bold light:text-neutral-700 text-neutral-300'>Use Case</p>
            <div>
            {
                usecases.map((uc) => (
                    <div key={uc.id} className={`flex gap-2 flex-row items-center text-neutral-500 cursor-pointer hover:text-neutral-700 ${usecase === uc.id ? 'light:bg-white bg-neutral-800 border light:border-neutral-300 border-neutral-700 px-2 py-1.5 rounded-md light:text-neutral-700 text-neutral-200' : 'border light:border-neutral-50/60 border-neutral-950 px-2 py-1.5'}`}
                    onClick={() => setUsecase(uc.id)}>
                        <Icon name={uc.icon} />
                        <span>{uc.label}</span>
                    </div>
                ))
            }
            </div>
            <p className='font-bold light:text-neutral-700 text-neutral-300'>Frameworks</p>
            <div>
            {
                frameworks.map((fm) => (
                    <div key={fm.id} className={`flex gap-2 flex-row items-center text-neutral-500 cursor-pointer hover:text-neutral-700 ${framework === fm.id ? 'light:bg-white bg-neutral-800 border light:border-neutral-300 border-neutral-700 px-2 py-1.5 rounded-md light:text-neutral-700 text-neutral-200' : 'border light:border-neutral-50/60 border-neutral-950 px-2 py-1'}`}
                    onClick={() => setFramework(fm.id)}>
                        <Icon name={fm.icon} />
                        <span>{fm.label}</span>
                    </div>
                ))
            }
            </div>
        </div>
  )
}

export default Sidebar
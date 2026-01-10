import reactExamples from './react';
import angularExamples from './angular';
import vanillaExamples from './vanilla';
import { type Framework, type Usecase } from '~/context/index';

export const getList = (framework: Framework, usecase: Usecase, search: string) => {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let resp: any[] = [];
  
  if (framework === 'react') {
    resp = reactExamples.filter(x => x.usecase === usecase || x.usecase === 'all')
  }
  if (framework === 'angular') {
    resp = angularExamples.filter(x => x.usecase === usecase || x.usecase === 'all')
  }
  if (framework === 'html') {
    resp = vanillaExamples.filter(x => x.usecase === usecase || x.usecase === 'all')
  }

  return search ? resp.filter((x) => x.name.toLocaleLowerCase().includes(search?.toLocaleLowerCase())) : resp;
}

export const modes = [
  {
    id: "ui",
    icon: "docs",
  },
  {
    id: "code",
    icon: "code",
  },
];

export const getPresetName = (usecase: Usecase) => {
  if (usecase === 'audio') return 'audio_room_host';
  if (usecase === 'video') return 'group_call_host';
  if (usecase === 'livestream') return 'livestream_host';
  if (usecase === 'webinar') return 'webinar_presenter';
}

export const getGuestPreset = (usecase: Usecase) => {
  if (usecase === 'audio') return 'audio_room_viewer';
  if (usecase === 'video') return 'group_call_participant';
  if (usecase === 'livestream') return 'livestream_viewer';
  if (usecase === 'webinar') return 'webinar_viewer';
  return "group_call_participant";
}

import reactExamples from './react';
import angularExamples from './angular';
import vanillaExamples from './vanilla';
import { type Framework, type Usecase } from '~/context/index';
import { addParticipant } from '~/api';

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

export const getPresetName = (usecase: Usecase): string => {
  if (usecase === 'audio') return 'Audio Call Host Demo';
  if (usecase === 'livestream') return 'Livestream Host Demo';
  if (usecase === 'webinar') return 'Webinar Host Demo';
  return 'Video Call Host Demo';
}

export const getGuestPreset = (usecase: Usecase): string => {
  if (usecase === 'audio') return 'Audio Call Participant Demo';
  if (usecase === 'video') return 'Video Call Participant Demo';
  if (usecase === 'livestream') return 'Livestream Viewer Demo';
  if (usecase === 'webinar') return 'Webinar Participant Demo';
  return "Video Call Participant Demo";
}


export const generateUrl = async ({
    name,
    meetingId,
    presetName,
    sampleName,
    url
}: {
    name: string;
    meetingId: string;
    presetName: string;
    sampleName: string;
    url: string;
}) => {
  const participant = await addParticipant({
      name,
      meetingId,
      presetName,
    });
  const token = participant.data.token;
  let _url = `${url}?authToken=${token}`
  if (sampleName === 'Back To Back Meetings' || sampleName === 'Multi Meeting') {
    // generate another auth token
    const participant2 = await addParticipant({
      name: 'User 2',
      meetingId,
      presetName,
    });
    const token2 = participant2.data.token;
    _url = `${url}?authToken1=${token}&authToken2=${token2}`
  }
return _url;
}
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { addParticipant, createMeeting } from "~/api";
import { getPresets } from "~/api/preset";
import { Icon } from "~/components/icons";
import type { Usecase } from "~/context";
import { useSharedState } from "~/context/hook";
import { getGuestPreset } from "~/utils/utils";


const fromBase64Url = (input: string) => {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((input.length + 3) % 4);
  const json = decodeURIComponent(escape(atob(b64)));
  return json;
}

const defaultPayload = {
  name: 'default-meeting-ui',
  framework: 'react',
  usecase: 'video',
  url: 'https://react-examples.realtime.cloudflare.com/default-meeting-ui',
}

type Mode = "create" | "join";
type LoadingState = "loaded" | "loading" | "errored";

const Meeting = () => {
  const location = useLocation();
  const { theme, setTheme } = useSharedState();
  const [mode, setMode] = useState<Mode>(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("meetingId") ? "join" : "create";
  });
  const [advanced, setAdvanced] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [presets, setPresets] = useState<Awaited<ReturnType<typeof getPresets>>>([]);

  const {url, preset, name} = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const stateParam = searchParams.get("state");
    let presetParam = searchParams.get("preset");
    let payload = defaultPayload;
    if (stateParam) {
      payload = JSON.parse(fromBase64Url(stateParam));
    }
    if (!presetParam) {
      presetParam = getGuestPreset(payload.usecase as Usecase)
    }
    return {
      ...payload, 
      preset: presetParam, 
      name: payload.name.replaceAll("-", " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    };
  }, []);

  const [form, setForm] = useState({
    waitingRoom: false,
    recordOnStart: false,
    aiSummary: false,
    preset,
    meetingId: "",
    yourName: "",
    meetingName: `Demo ${name}`,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const meetingId = searchParams.get('meetingId');
    if (meetingId) {
      setForm(prev => ({ ...prev, meetingId }));
      setMode("join");
    }
  }, []);

  useEffect(() => {
    if (!preset) return;
    setForm((prev) => ({ ...prev, preset }))
  }, [preset])


  const isValid = useMemo(() => {
    if (mode === "create") return form.yourName.trim().length > 0;
    return form.meetingId.trim().length > 0 && form.yourName.trim().length > 0;
  }, [mode, form.meetingId, form.yourName]);

  const joinMeeting = async () => {
    setLoading(true);
    let meetingId = form.meetingId;
    if (!meetingId || mode === 'create') {
      const meeting = await createMeeting({
        meetingName: form.meetingName,
        recordOnStart: form.recordOnStart,
        aiSummary: form.aiSummary,
      });
      meetingId = meeting.data.id;
    }
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('meetingId', meetingId);
    window.history.replaceState(null, '', `${location.pathname}?${searchParams.toString()}`);
    const participant = await addParticipant({
      name: form.yourName,
      meetingId,
      ...(mode === 'create' ? {presetName: form.preset} : { presetName: preset })
    });
    setLoading(false);
    const token = participant.data.token;
    setToken(token);
  };

  useEffect(() => {
    getPresets()
      .then((resp) => {
        setPresets(resp);
      })
  }, []);



  if (token) {
    return <div className="fixed top-0 right-0 z-50 w-full light:bg-white bg-black h-full flex items-center justify-center">
      {loadingState === "loading" && (
        <div className="w-full min-h-screen flex absolute z-40 flex-col justify-center items-center gap-4 text-orange-200 light:text-gray-700">
          <pre className="bg-orange-900/20 border border-orange-700/20 p-2 rounded text-sm">
            Loading...
          </pre>
        </div>
      )}
      <iframe
        src={`${url}?authToken=${token}`}
        className="w-full h-[100vh] border-none"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        onError={() => setLoadingState("errored")}
        onLoad={() => setLoadingState("loaded")}
      />
    </div>
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center font-sans px-4">
      <a
          className="text-orange-500 flex items-center justify-center py-4 absolute top-4 right-12"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Icon name="dark" className="cursor-pointer " />
          ) : (
            <Icon name="light" className="cursor-pointer " />
          )}
        </a>
      <div className="w-full max-w-[400px] h-[60vh]">
        <div className="flex justify-center mb-4">
          <div className="inline-flex bg-neutral-800 light:bg-neutral-200 rounded-full p-1">
            <button
              type="button"
              onClick={() => setMode("create")}
              className={`px-4 py-1 rounded-full transition-colors cursor-pointer ${
                mode === "create"
                  ? "bg-neutral-950 text-neutral-50 light:bg-white light:text-neutral-900"
                  : "text-neutral-300 hover:text-neutral-50 light:text-neutral-700 light:hover:text-neutral-900"
              }`}
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setMode("join")}
              className={`px-4 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                mode === "join"
                  ? "bg-neutral-950 text-neutral-50 light:bg-white light:text-neutral-900"
                  : "text-neutral-300 hover:text-neutral-50 light:text-neutral-700 light:hover:text-neutral-900"
              }`}
            >
              Join
            </button>
          </div>
        </div>

        <div className="px-4">
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-neutral-50 light:text-neutral-500 mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                autoFocus
                value={form.yourName}
                onChange={(e) => setForm((prev) => ({ ...prev, yourName: e.target.value }))}
                placeholder={"Your name"}
                className="w-full p-2 rounded-md bg-neutral-800 light:bg-neutral-200 text-neutral-50 light:text-neutral-900 placeholder:text-neutral-400 light:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-300"
              />
            </div>

            {mode === "create" ? (
                <div>
                  <label className="block text-sm text-neutral-50 light:text-neutral-500 mb-1">
                    Meeting Name
                  </label>
                  <input
                    value={form.meetingName}
                    onChange={(e) => setForm((prev) => ({ ...prev, meetingName: e.target.value }))}
                    placeholder="What's your meeting about?"
                    className="w-full p-2 rounded-md bg-neutral-800 light:bg-neutral-200 text-neutral-50 light:text-neutral-900 placeholder:text-neutral-400 light:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  />
                </div>
              ) : (<div>
                <label className="block text-sm text-neutral-50 light:text-neutral-500 mb-1">
                  Meeting ID <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.meetingId}
                  onChange={(e) => setForm((prev) => ({ ...prev, meetingId: e.target.value }))}
                  placeholder="Meeting ID"
                  className="w-full p-2 rounded-md bg-neutral-800 light:bg-neutral-200 text-neutral-50 light:text-neutral-900 placeholder:text-neutral-400 light:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </div>
            )}

            {mode === "create" ? (
              <>
                <div className="border-t border-neutral-700 light:border-neutral-200" />
                <button
                  onClick={() => setAdvanced(!advanced)}
                  type="button"
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-neutral-800 light:bg-neutral-200 flex items-center justify-center">
                      <Icon name="code" />
                    </div>
                    <div>
                      <div className="text-base font-medium text-neutral-50 light:text-neutral-900">Advanced</div>
                      <div className="text-sm text-neutral-400 light:text-neutral-600">
                        Manage host controls and settings
                      </div>
                    </div>
                  </div>
                  <div className="text-neutral-300 light:text-neutral-700">
                    {advanced ? <Icon name="chevron-up" /> : <Icon name="chevron-down" />}
                  </div>
                </button>
              </>
            ) : null}

            {
              mode === "create" && advanced ? (
                <div className="border-t border-b border-neutral-700 light:border-neutral-200 py-4 flex flex-col gap-4">
                  <label className="flex items-center gap-3 text-neutral-50 light:text-neutral-900">
                    <input
                      type="checkbox"
                      checked={form.waitingRoom}
                      onChange={(e) => setForm((prev) => ({ ...prev, waitingRoom: e.target.checked }))}
                      className="h-4 w-4 rounded border cursor-pointer"
                    />
                    <span className="text-sm">Waiting Room</span>
                  </label>

                  <div className="space-y-2">
                    <div className="text-md font-semibold text-neutral-50 light:text-neutral-900">
                      Demos
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <label className="flex items-center gap-3 text-neutral-50 light:text-neutral-900">
                        <input
                          type="checkbox"
                          checked={form.recordOnStart}
                          onChange={(e) => setForm((prev) => ({ ...prev, recordOnStart: e.target.checked }))}
                          className="h-4 w-4 rounded border"
                        />
                        <span className="text-sm">Record on Start</span>
                      </label>
                      <label className="flex items-center gap-3 text-neutral-50 light:text-neutral-900">
                        <input
                          type="checkbox"
                          checked={form.aiSummary}
                          onChange={(e) => setForm((prev) => ({ ...prev, aiSummary: e.target.checked }))}
                          className="h-4 w-4 rounded border cursor-pointer"
                        />
                        <span className="text-sm">AI Summary</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-md font-semibold text-neutral-50 light:text-neutral-900">
                      Presets
                    </div>
                    <div className="relative">
                    <select
                      disabled={!presets?.length}
                      value={form.preset}
                      onChange={(e) => setForm((prev) => ({ ...prev, preset: e.target.value }))}
                      className="w-full py-2 px-3 rounded-md cursor-pointer bg-neutral-800 light:bg-neutral-200 text-neutral-50 light:text-neutral-900 focus:outline-none outline-none appearance-none"
                    >
                      <option value="none">{presets?.length ? 'None' : 'Loading...'}</option>
                      {
                        presets?.map((preset) => <option key={preset.id} value={preset.name}>{preset.name}</option>)
                      }
                    </select>
                    <Icon size={18} name="chevron-down" className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-50 light:text-neutral-500" />
                    </div>
                  </div>
                </div>
              ) : null
            }

            <button
              type="button"
              disabled={!isValid}
              onClick={joinMeeting}
              className={`w-full rounded-md py-2 font-semibold transition-colors ${
                isValid
                  ? "bg-orange-500 text-white"
                  : "bg-orange-500/40 text-white/80 cursor-not-allowed"
              }`}
            >
              {loading ? "Loading..." : mode === "create" ? "Start Meeting" : "Join meeting"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meeting;

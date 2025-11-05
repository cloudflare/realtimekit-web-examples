import { jsx, jsxs } from "react/jsx-runtime";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, useSearchParams, useNavigate, useLocation, Navigate, Link } from "react-router";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { useRef, useState, useEffect, useMemo } from "react";
async function handleRequest(request, responseStatusCode, responseHeaders, routerContext, _loadContext) {
  let shellRendered = false;
  const userAgent = request.headers.get("user-agent");
  const body = await renderToReadableStream(
    // @ts-expect-error - React 19 type compatibility issue
    /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
    {
      onError(error) {
        responseStatusCode = 500;
        if (shellRendered) {
          console.error(error);
        }
      }
    }
  );
  shellRendered = true;
  if (userAgent && isbot(userAgent) || routerContext.isSpaMode) {
    await body.allReady;
  }
  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function Logo({
  size = 45,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      fill: "#040404",
      viewBox: "-1 -1 62 29",
      ...props,
      children: /* @__PURE__ */ jsxs("g", { children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            stroke: "currentColor",
            d: "M47.927 11.725c-.2 0-.397.007-.594.014a.271.271 0 0 0-.094.022.33.33 0 0 0-.214.229l-.846 2.924c-.365 1.257-.23 2.418.383 3.27.563.789 1.498 1.251 2.634 1.305l4.589.276a.41.41 0 0 1 .326.179.44.44 0 0 1 .046.39.58.58 0 0 1-.498.384l-4.768.276c-2.59.118-5.377 2.21-6.355 4.761l-.344.9a.253.253 0 0 0 .225.343H58.84a.435.435 0 0 0 .422-.315 11.69 11.69 0 0 0 .437-3.185c0-6.5-5.266-11.766-11.764-11.766",
            vectorEffect: "non-scaling-stroke"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            stroke: "currentColor",
            d: "m40.76 26.62.304-1.057c.365-1.258.229-2.418-.384-3.271-.562-.788-1.497-1.25-2.633-1.304l-21.527-.276a.426.426 0 0 1-.34-.18.44.44 0 0 1-.047-.39.581.581 0 0 1 .502-.383l21.727-.276c2.58-.118 5.367-2.21 6.345-4.761l1.24-3.24a.814.814 0 0 0 .035-.43C44.572 4.733 38.925 0 32.172 0c-6.223 0-11.503 4.016-13.399 9.598a6.344 6.344 0 0 0-4.467-1.236 6.367 6.367 0 0 0-5.517 7.91C3.913 16.417 0 20.412 0 25.32c0 .445.032.882.097 1.308a.418.418 0 0 0 .415.362H40.268a.517.517 0 0 0 .491-.376",
            vectorEffect: "non-scaling-stroke"
          }
        )
      ] })
    }
  );
}
const generateSketchyBorderPaths = (width, height, roughness) => {
  if (width === 0 || height === 0) return [];
  const rough = (base, variance) => base + (Math.random() - 0.5) * variance * roughness;
  const refMinX = 72;
  const refMaxX = 116;
  const refMinY = 214;
  const refMaxY = 248;
  const refWidth = refMaxX - refMinX;
  const refHeight = refMaxY - refMinY;
  const extension = 0.08;
  const scaleX = width * (1 + extension * 2) / refWidth;
  const scaleY = height * (1 + extension * 2) / refHeight;
  const padding = 4;
  const offsetX = padding - width * extension;
  const offsetY = padding - height * extension;
  const transformX = (x) => rough((x - refMinX) * scaleX + offsetX, 2);
  const transformY = (y) => rough((y - refMinY) * scaleY + offsetY, 1.5);
  const paths = [
    // Top line (horizontal) - stretched to match width
    {
      d: `M${transformX(75)} ${transformY(214)} C${transformX(84)} ${transformY(
        216
      )}, ${transformX(96)} ${transformY(216)}, ${transformX(114)} ${transformY(
        216
      )}`
    },
    // Right side (vertical)
    {
      d: `M${transformX(113)} ${transformY(217)} C${transformX(
        114
      )} ${transformY(225)}, ${transformX(114)} ${transformY(
        235
      )}, ${transformX(116)} ${transformY(244)}`
    },
    // Bottom line (horizontal) - stretched to match width
    {
      d: `M${transformX(114)} ${transformY(247)} C${transformX(
        102
      )} ${transformY(245)}, ${transformX(89)} ${transformY(247)}, ${transformX(
        73
      )} ${transformY(248)}`
    },
    // Left side (vertical)
    {
      d: `M${transformX(74)} ${transformY(244)} C${transformX(75)} ${transformY(
        240
      )}, ${transformX(75)} ${transformY(230)}, ${transformX(74)} ${transformY(
        218
      )}`
    },
    // Second layer - top
    {
      d: `M${transformX(78)} ${transformY(216)} C${transformX(88)} ${transformY(
        217
      )}, ${transformX(97)} ${transformY(218)}, ${transformX(115)} ${transformY(
        217
      )}`
    },
    // Second layer - right
    {
      d: `M${transformX(115)} ${transformY(219)} C${transformX(
        116
      )} ${transformY(225)}, ${transformX(114)} ${transformY(
        238
      )}, ${transformX(111)} ${transformY(245)}`
    },
    // Second layer - bottom
    {
      d: `M${transformX(114)} ${transformY(244)} C${transformX(
        105
      )} ${transformY(249)}, ${transformX(90)} ${transformY(249)}, ${transformX(
        75
      )} ${transformY(246)}`
    },
    // Second layer - left
    {
      d: `M${transformX(78)} ${transformY(246)} C${transformX(73)} ${transformY(
        240
      )}, ${transformX(77)} ${transformY(232)}, ${transformX(76)} ${transformY(
        219
      )}`
    }
  ];
  return paths;
};
const generateSketchyUnderlinePaths = (width, height, roughness, offset) => {
  if (width === 0 || height === 0) return [];
  const rough = (base, variance) => base + (Math.random() - 0.5) * variance * roughness;
  const refMinX = 72;
  const refMaxX = 116;
  const refWidth = refMaxX - refMinX;
  const extension = 0.08;
  const scaleX = width * (1 + extension * 2) / refWidth;
  const padding = 4;
  const offsetX = padding - width * extension;
  const baseY = height + offset;
  const transformX = (x) => rough((x - refMinX) * scaleX + offsetX, 2);
  const transformY = (y) => {
    const normalizedY = (y - 246.5) * 0.3;
    return rough(baseY + normalizedY, 1.5);
  };
  const paths = [
    // Bottom line (horizontal) - same as border's bottom edge
    {
      d: `M${transformX(114)} ${transformY(247)} C${transformX(
        102
      )} ${transformY(245)}, ${transformX(89)} ${transformY(247)}, ${transformX(
        73
      )} ${transformY(248)}`
    },
    // Second layer - bottom - same as border's second layer
    {
      d: `M${transformX(114)} ${transformY(244)} C${transformX(
        105
      )} ${transformY(249)}, ${transformX(90)} ${transformY(249)}, ${transformX(
        75
      )} ${transformY(246)}`
    }
  ];
  return paths;
};
const generateSketchyCirclePaths = (width, height, roughness) => {
  if (width === 0 || height === 0) return [];
  const padding = 8;
  const centerX = width / 2 + padding;
  const centerY = height / 2 + padding;
  const baseRadiusX = width / 2 * 1.8;
  const baseRadiusY = height / 2 * 1.2;
  const baseOvals = 1;
  const numOvals = Math.max(
    2,
    Math.min(baseOvals + Math.floor(roughness * 3), 5)
  );
  const paths = [];
  const baseAngle = 15;
  const maxAngleChange = 5;
  for (let i = 0; i < numOvals; i++) {
    const randomAngleOffset = (Math.random() - 0.2) * 1.5 * maxAngleChange;
    const angle = baseAngle + randomAngleOffset;
    const angleRad = angle * Math.PI / 180;
    const radiusXVariation = (Math.random() - 0.5) * 0.45;
    const rx = baseRadiusX * (1 + radiusXVariation);
    const ry = baseRadiusY;
    const segments = 32;
    const points = [];
    for (let j = 0; j <= segments; j++) {
      const t = j / segments * 2 * Math.PI;
      const x = rx * Math.cos(t);
      const y = ry * Math.sin(t);
      const rotatedX = x * Math.cos(angleRad) - y * Math.sin(angleRad);
      const rotatedY = x * Math.sin(angleRad) + y * Math.cos(angleRad);
      points.push({
        x: centerX + rotatedX,
        y: centerY + rotatedY
      });
    }
    let pathD = `M${points[0].x} ${points[0].y}`;
    for (let j = 0; j < points.length - 1; j++) {
      const p0 = points[j];
      const p1 = points[(j + 1) % points.length];
      const p2 = points[(j + 2) % points.length];
      const cp1x = p0.x + (p1.x - p0.x) * 0.5;
      const cp1y = p0.y + (p1.y - p0.y) * 0.5;
      const cp2x = p1.x - (p2.x - p1.x) * 0.2;
      const cp2y = p1.y - (p2.y - p1.y) * 0.2;
      pathD += ` C${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    paths.push({ d: pathD });
  }
  return paths;
};
const sketchyProvider = (WrappedComponent, config = {}) => {
  return (props) => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const {
      type = "border",
      color = "#30A46C",
      strokeWidth = 2,
      roughness = 1.2,
      offset = 4
    } = config;
    useEffect(() => {
      if (containerRef.current) {
        const updateDimensions = () => {
          if (containerRef.current) {
            const { offsetWidth, offsetHeight } = containerRef.current;
            setDimensions({ width: offsetWidth, height: offsetHeight });
          }
        };
        updateDimensions();
        const resizeObserver = new ResizeObserver(updateDimensions);
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
      }
    }, []);
    const paths = type === "underline" ? generateSketchyUnderlinePaths(
      dimensions.width,
      dimensions.height,
      roughness,
      offset
    ) : type === "circle" ? generateSketchyCirclePaths(
      dimensions.width,
      dimensions.height,
      roughness
    ) : generateSketchyBorderPaths(
      dimensions.width,
      dimensions.height,
      roughness
    );
    const svgProps = type === "underline" ? {
      className: "absolute inset-0 pointer-events-none",
      width: dimensions.width,
      height: dimensions.height + offset + 10,
      style: { overflow: "visible" }
    } : type === "circle" ? {
      className: "absolute inset-0 overflow-visible pointer-events-none flex items-center justify-center",
      width: dimensions.width + 16,
      height: dimensions.height + 16,
      style: { transform: "translate(-8px, -8px)" }
    } : {
      className: "absolute top-0 left-0 overflow-visible pointer-events-none",
      width: dimensions.width + 8,
      height: dimensions.height + 8,
      style: { transform: "translate(-4px, -4px)" }
    };
    return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: "relative inline-block", children: [
      dimensions.width > 0 && dimensions.height > 0 && /* @__PURE__ */ jsx("svg", { ...svgProps, children: paths.map((path, index2) => /* @__PURE__ */ jsx(
        "path",
        {
          d: path.d,
          fill: "none",
          stroke: color,
          strokeWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round"
        },
        index2
      )) }),
      /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(WrappedComponent, { ...props }) })
    ] });
  };
};
const code = "<svg fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='m8.086 18.611 5.996-14.004a1 1 0 0 1 1.878.677l-.04.11-5.996 14.004a1 1 0 0 1-1.878-.677l.04-.11 5.996-14.004L8.086 18.61Zm-5.793-7.318 4-4a1 1 0 0 1 1.497 1.32l-.083.094L4.414 12l3.293 3.293a1 1 0 0 1-1.32 1.498l-.094-.084-4-4a1 1 0 0 1-.083-1.32l.083-.094 4-4-4 4Zm14-4.001a1 1 0 0 1 1.32-.083l.093.083 4.001 4.001a1 1 0 0 1 .083 1.32l-.083.095-4.001 3.995a1 1 0 0 1-1.497-1.32l.084-.095L19.584 12l-3.293-3.294a1 1 0 0 1 0-1.414Z' fill='#currentColor'/></svg>";
const docs = "<svg fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M18.5 20a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5h6V8a2 2 0 0 0 2 2h4.5v10Zm-5-15.379L17.378 8.5H14a.5.5 0 0 1-.5-.5V4.621Zm5.914 3.793-5.829-5.828c-.026-.026-.058-.046-.085-.07a2.072 2.072 0 0 0-.219-.18c-.04-.027-.086-.045-.128-.068-.071-.04-.141-.084-.216-.116a1.977 1.977 0 0 0-.624-.138C12.266 2.011 12.22 2 12.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9.828a2 2 0 0 0-.586-1.414Z' fill='currentColor'/></svg>";
const github = "<svg fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z'/></svg>";
const webinar = "<svg fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M13.5 11.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM2 6.316c0-1.44 1.318-2.491 2.692-2.299C6.268 4.238 8.809 4.5 12 4.5s5.732-.262 7.308-.483c1.374-.192 2.692.858 2.692 2.3v11.368c0 1.44-1.318 2.49-2.69 2.298A53.307 53.307 0 0 0 12 19.5c-3.19 0-5.732.262-7.309.483-1.373.193-2.69-.858-2.691-2.298V6.316Zm2.483-.813c-.524-.074-.983.337-.983.813v11.369c0 .476.458.886.983.813l.517-.07V16a1 1 0 0 1 1-1h2.5v3.104a57.09 57.09 0 0 1 1.5-.07V15a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3.034c.523.018 1.023.042 1.5.07V15H18a1 1 0 0 1 1 1v2.429c.182.023.355.046.517.069.525.073.983-.337.983-.813V6.316c0-.476-.459-.887-.983-.813C17.884 5.732 15.272 6 12 6c-3.272 0-5.884-.268-7.517-.497Z' fill='currentColor'/></svg>";
const conferencing = "<svg fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M19.745 4a2.25 2.25 0 0 1 2.25 2.25v11.505a2.25 2.25 0 0 1-2.25 2.25H4.25A2.25 2.25 0 0 1 2 17.755V6.25A2.25 2.25 0 0 1 4.25 4h15.495Zm0 1.5H4.25a.75.75 0 0 0-.75.75v11.505c0 .414.336.75.75.75l2.749-.001L7 15.75a1.75 1.75 0 0 1 1.606-1.744L8.75 14h6.495a1.75 1.75 0 0 1 1.744 1.607l.006.143-.001 2.754h2.751a.75.75 0 0 0 .75-.75V6.25a.75.75 0 0 0-.75-.75Zm-4.5 10H8.75a.25.25 0 0 0-.243.193l-.007.057-.001 2.754h6.995V15.75a.25.25 0 0 0-.192-.243l-.057-.007ZM12 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z' fill='currentColor'/></svg>";
const audio = "<svg fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='m18.01 12.245.504-1.187c.236-.556.801-.86 1.356-.744l.118.031.63.202c.626.2 1.104.735 1.259 1.407.367 1.598-.074 3.543-1.322 5.836-1.247 2.289-2.614 3.665-4.1 4.129a1.76 1.76 0 0 1-1.663-.342l-.124-.114-.478-.48a1.36 1.36 0 0 1-.223-1.59l.071-.117.722-1.06c.283-.417.77-.614 1.237-.515l.127.035 1.332.444a5.08 5.08 0 0 0 1.33-1.519 4.799 4.799 0 0 0 .596-1.59l.038-.27-1.109-1.052a1.354 1.354 0 0 1-.348-1.373l.047-.131.504-1.187-.503 1.187ZM19.745 4a2.25 2.25 0 0 1 2.25 2.25l.001 3.979a2.821 2.821 0 0 0-.874-.562l-.2-.073-.427-.137V6.25a.75.75 0 0 0-.75-.75H4.25a.75.75 0 0 0-.75.75v11.505c0 .414.336.75.75.75l2.749-.001L7 15.75a1.75 1.75 0 0 1 1.606-1.744L8.75 14h6.495a1.75 1.75 0 0 1 1.744 1.607l.006.143-.001 1.222-.554-.185-.166-.048a2.151 2.151 0 0 0-.78-.047v-.942a.25.25 0 0 0-.192-.243l-.057-.007H8.75a.25.25 0 0 0-.243.193l-.007.057-.001 2.754h4.854l-.142.21-.098.156c-.2.352-.302.744-.307 1.134H4.25A2.25 2.25 0 0 1 2 17.755V6.25A2.25 2.25 0 0 1 4.25 4h15.495ZM12 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z' fill='currentColor'/></svg>";
const livestream = "<svg fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M12 2c5.524 0 10.002 4.478 10.002 10.001 0 .533-.042 1.056-.122 1.567a1.561 1.561 0 0 0-.212.119l-.96.64a2.507 2.507 0 0 0-.393-.546 8.535 8.535 0 0 0-.05-3.781h-3.358a20.848 20.848 0 0 1 .072 3h-1.503a19.284 19.284 0 0 0-.079-3H8.605a18.968 18.968 0 0 0 .135 5.001h2.312c-.033.161-.05.328-.05.5v1H9.062c.46 1.704 1.16 2.997 1.939 3.61v1.39c0 .155.014.308.042.456C5.969 21.474 2 17.2 2 12 2 6.478 6.478 2 12 2ZM7.51 16.501H4.786a8.531 8.531 0 0 0 4.094 3.41c-.522-.82-.953-1.846-1.27-3.015l-.102-.395Zm-.415-6.5H3.737l-.005.017A8.524 8.524 0 0 0 3.5 12c0 1.056.192 2.067.544 3h3.173A20.3 20.3 0 0 1 7 12c0-.684.032-1.353.095-2Zm1.787-5.91-.023.008a8.53 8.53 0 0 0-4.607 4.402h3.047c.314-1.752.86-3.278 1.583-4.41Zm3.119-.591-.116.005c-1.265.116-2.488 2.118-3.055 4.996h6.342c-.566-2.87-1.783-4.869-3.045-4.995l-.126-.006Zm3.12.59.106.175c.67 1.112 1.178 2.572 1.475 4.236h3.048a8.533 8.533 0 0 0-4.338-4.29l-.291-.12ZM12 15.5a1.5 1.5 0 0 1 1.5-1.5h5a1.5 1.5 0 0 1 1.5 1.5v.5l2.222-1.481a.5.5 0 0 1 .777.416v7.13a.5.5 0 0 1-.777.417L20 21v.5a1.5 1.5 0 0 1-1.5 1.5h-5a1.5 1.5 0 0 1-1.5-1.5v-6Z' fill='currentColor'/></svg>";
const folder = "<svg fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M8.207 4c.46 0 .908.141 1.284.402l.156.12L12.022 6.5h7.728a2.25 2.25 0 0 1 2.229 1.938l.016.158.005.154v9a2.25 2.25 0 0 1-2.096 2.245L19.75 20H4.25a2.25 2.25 0 0 1-2.245-2.096L2 17.75V6.25a2.25 2.25 0 0 1 2.096-2.245L4.25 4h3.957Zm1.44 5.979a2.25 2.25 0 0 1-1.244.512l-.196.009-4.707-.001v7.251c0 .38.282.694.648.743l.102.007h15.5a.75.75 0 0 0 .743-.648l.007-.102v-9a.75.75 0 0 0-.648-.743L19.75 8h-7.729L9.647 9.979ZM8.207 5.5H4.25a.75.75 0 0 0-.743.648L3.5 6.25v2.749L8.207 9a.75.75 0 0 0 .395-.113l.085-.06 1.891-1.578-1.89-1.575a.75.75 0 0 0-.377-.167L8.207 5.5Z' fill='currentColor'/></svg>";
const light = "<svg fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M11.996 19.01a.75.75 0 0 1 .743.649l.007.102v1.5a.75.75 0 0 1-1.493.101l-.007-.101v-1.5a.75.75 0 0 1 .75-.75Zm6.022-2.072 1.06 1.06a.75.75 0 1 1-1.06 1.061l-1.06-1.06a.75.75 0 0 1 1.06-1.061Zm-10.983 0a.75.75 0 0 1 0 1.06L5.974 19.06a.75.75 0 0 1-1.06-1.06l1.06-1.061a.75.75 0 0 1 1.06 0ZM12 6.475a5.525 5.525 0 1 1 0 11.05 5.525 5.525 0 0 1 0-11.05Zm0 1.5a4.025 4.025 0 1 0 0 8.05 4.025 4.025 0 0 0 0-8.05Zm9.25 3.293a.75.75 0 0 1 .102 1.493l-.102.007h-1.5a.75.75 0 0 1-.102-1.493l.102-.007h1.5Zm-17-.029a.75.75 0 0 1 .102 1.494l-.102.006h-1.5a.75.75 0 0 1-.102-1.493l.102-.007h1.5Zm1.64-6.37.084.072 1.06 1.06a.75.75 0 0 1-.976 1.134l-.084-.073-1.06-1.06a.75.75 0 0 1 .976-1.134Zm13.188.072a.75.75 0 0 1 .073.977l-.073.084-1.06 1.06a.75.75 0 0 1-1.133-.976l.072-.084 1.06-1.061a.75.75 0 0 1 1.061 0ZM12 1.99a.75.75 0 0 1 .743.648l.007.102v1.5a.75.75 0 0 1-1.493.101l-.007-.102v-1.5a.75.75 0 0 1 .75-.75Z' fill='currentColor'/></svg>";
const dark = "<svg fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M20.026 17.001c-2.762 4.784-8.879 6.423-13.663 3.661a9.964 9.964 0 0 1-3.234-2.983.75.75 0 0 1 .365-1.131c3.767-1.348 5.785-2.911 6.956-5.146 1.232-2.353 1.551-4.93.689-8.464a.75.75 0 0 1 .769-.926 9.961 9.961 0 0 1 4.457 1.327C21.149 6.1 22.788 12.217 20.025 17Zm-8.248-4.903c-1.25 2.388-3.31 4.099-6.817 5.499a8.492 8.492 0 0 0 2.152 1.766 8.501 8.501 0 1 0 8.502-14.725 8.485 8.485 0 0 0-2.792-1.016c.647 3.384.23 6.044-1.045 8.476Z' fill='currentColor'/></svg>";
const warning = "<svg fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M10.91 2.782a2.25 2.25 0 0 1 2.975.74l.083.138 7.759 14.009a2.25 2.25 0 0 1-1.814 3.334l-.154.006H4.243a2.25 2.25 0 0 1-2.041-3.197l.072-.143L10.031 3.66a2.25 2.25 0 0 1 .878-.878Zm9.505 15.613-7.76-14.008a.75.75 0 0 0-1.254-.088l-.057.088-7.757 14.008a.75.75 0 0 0 .561 1.108l.095.006h15.516a.75.75 0 0 0 .696-1.028l-.04-.086-7.76-14.008 7.76 14.008ZM12 16.002a.999.999 0 1 1 0 1.997.999.999 0 0 1 0-1.997ZM11.995 8.5a.75.75 0 0 1 .744.647l.007.102.004 4.502a.75.75 0 0 1-1.494.103l-.006-.102-.004-4.502a.75.75 0 0 1 .75-.75Z' fill='currentColor'/></svg>";
const iconsData = {
  code,
  docs,
  github,
  webinar,
  conferencing,
  audio,
  livestream,
  folder,
  light,
  dark,
  warning
};
const Icon = ({
  name,
  size = 20,
  className = "",
  color = "currentColor"
}) => {
  const svgString = iconsData[name];
  if (!svgString || svgString.trim() === "") {
    console.warn(`Icon "${name}" not found or empty in icons.json`);
    return null;
  }
  let modifiedSvg = svgString;
  if (modifiedSvg.includes("fill='currentColor'")) {
    modifiedSvg = modifiedSvg.replace(
      /fill='currentColor'/g,
      `fill='${color}'`
    );
  } else if (modifiedSvg.includes('fill="currentColor"')) {
    modifiedSvg = modifiedSvg.replace(
      /fill="currentColor"/g,
      `fill="${color}"`
    );
  }
  modifiedSvg = modifiedSvg.replace(
    /<svg/,
    `<svg width="${size}" height="${size}" class="${className}"`
  );
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `inline-flex items-center justify-center ${className}`,
      style: { width: size, height: size },
      dangerouslySetInnerHTML: { __html: modifiedSvg }
    }
  );
};
const NavItem = ({
  children,
  className,
  onClick
}) => /* @__PURE__ */ jsx(
  "span",
  {
    className: `cursor-pointer text-[#858181] light:text-gray-700 px-3 py-5 text-sm ${className}`,
    onClick,
    children
  }
);
const SketchyNavItem = sketchyProvider(NavItem, {
  type: "border",
  color: "#fed7aa",
  strokeWidth: 2,
  roughness: 0.5
});
const Header = ({
  selected,
  setSelected,
  theme,
  setTheme
}) => {
  const [search] = useSearchParams();
  const mode = search.get("mode") ?? "editor";
  const frameworks = useMemo(() => {
    return [
      {
        label: "React",
        id: "react",
        disabled: mode === "token" && selected !== "react"
      },
      {
        label: "Vanilla",
        id: "vanilla",
        disabled: mode === "token" && selected !== "vanilla"
      },
      {
        label: "Angular",
        id: "angular",
        disabled: mode === "token" && selected !== "angular"
      }
    ];
  }, [mode, selected]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `
      z-40 sticky top-4 flex flex-row items-center mx-12 gap-8 px-4 py-0 border-[1px]
     bg-[#040404] rounded-none shadow-[0_8px_100px_rgba(12,17,62,0.76)]  border-zinc-800
     light:bg-white light:shadow-[0_8px_100px_rgba(62,57,122,0.66)] light:border-gray-300
     `,
      children: [
        /* @__PURE__ */ jsx(Logo, { className: "text-orange-500 light:fill-none" }),
        frameworks.map((el) => {
          if (selected === el.id) {
            return /* @__PURE__ */ jsx(SketchyNavItem, { children: el.label }, el.id);
          }
          return /* @__PURE__ */ jsx(
            NavItem,
            {
              className: `${el.disabled ? "opacity-40" : ""}`,
              onClick: () => {
                if (el.disabled) return;
                setSelected(el.id);
              },
              children: el.label
            },
            el.id
          );
        }),
        /* @__PURE__ */ jsxs("div", { className: "flex-grow flex-row items-center justify-end gap-4 hidden md:flex text-[#858181] light:text-gray-500", children: [
          /* @__PURE__ */ jsx("a", { target: "_blank", href: "https://realtime.cloudflare.com/", children: /* @__PURE__ */ jsx(Icon, { name: "docs", className: "cursor-pointer " }) }),
          /* @__PURE__ */ jsx(
            "a",
            {
              target: "_blank",
              href: "https://github.com/cloudflare/realtimekit-web-examples",
              children: /* @__PURE__ */ jsx(Icon, { name: "github", className: " cursor-pointer" })
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              className: "text-orange-500",
              onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
              children: theme === "dark" ? /* @__PURE__ */ jsx(Icon, { name: "dark", className: "cursor-pointer " }) : /* @__PURE__ */ jsx(Icon, { name: "light", size: 24, className: "cursor-pointer " })
            }
          )
        ] })
      ]
    }
  );
};
const Footer = () => {
  const navigationLinks = [
    { label: "Docs", href: "https://docs.realtime.cloudflare.com/" },
    { label: "Explore", href: "https://realtime.cloudflare.com/" }
  ];
  const socialLinks = [
    {
      name: "github",
      href: "https://github.com/cloudflare/realtime-kit"
    },
    {
      name: "code",
      href: "https://github.com/cloudflare/realtime-kit"
    }
  ];
  return /* @__PURE__ */ jsx("footer", { className: "w-full px-4 md:px-12 py-8 md:py-12 bg-[#040404] light:bg-white border-t border-orange-200/20 light:border-orange-300", children: /* @__PURE__ */ jsx("div", { className: "max-w-[94vw] mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between gap-8 md:gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col max-w-md gap-2", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-orange-50 light:text-neutral-700 text-2xl font-bold", children: "RealtimeKit" }),
      /* @__PURE__ */ jsx("p", { className: "text-orange-50 light:text-neutral-700 text-sm italic", children: "/ˈriːəltaɪmkɪt/" }),
      /* @__PURE__ */ jsx("p", { className: "text-orange-50 light:text-neutral-700 text-sm", children: "noun" }),
      /* @__PURE__ */ jsx("p", { className: "text-orange-50 light:text-neutral-700 text-sm leading-relaxed", children: "A toolkit for building & shipping real-time applications in minutes." }),
      /* @__PURE__ */ jsx("p", { className: "text-neutral-400 light:text-neutral-500 text-sm", children: "Copyright © Cloudflare. since 2025. All rights reserved." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsx("nav", { className: "flex flex-col gap-2", children: navigationLinks.map((link) => /* @__PURE__ */ jsxs(
        "a",
        {
          href: link.href,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-orange-50 hover:text-orange-200  light:text-neutral-700 light:hover:text-neutral-900 text-sm flex items-center gap-2 transition-colors group",
          children: [
            /* @__PURE__ */ jsx("span", { children: link.label }),
            /* @__PURE__ */ jsx(
              "svg",
              {
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                className: "opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M5 12h14m-7-7l7 7-7 7",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                  }
                )
              }
            )
          ]
        },
        link.label
      )) }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 items-center", children: socialLinks.map((social) => /* @__PURE__ */ jsx(
        "a",
        {
          href: social.href,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-orange-50 hover:text-orange-300 transition-colors light:text-neutral-700 light:hover:text-neutral-900",
          children: /* @__PURE__ */ jsx(Icon, { name: social.name, size: 22 })
        },
        social.name
      )) })
    ] })
  ] }) }) });
};
const layout = UNSAFE_withComponentProps(function Layout2() {
  const [selected, setSelected] = useState("react");
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);
  useEffect(() => {
    const path = location.pathname.substring(1) || "react";
    if (path === "vanilla" || path === "react" || path === "angular") {
      setSelected(path);
    }
  }, [location.pathname]);
  useEffect(() => {
    const currentPath = location.pathname.substring(1);
    if (currentPath.includes("meeting")) return;
    navigate(`/${selected}${location.search}`);
  }, [selected, navigate, location.search, location.pathname]);
  return /* @__PURE__ */ jsxs("div", {
    className: "dots-background w-full min-h-full flex flex-col justify-start",
    children: [location.pathname !== "/meeting" && /* @__PURE__ */ jsx(Header, {
      selected,
      setSelected,
      theme,
      setTheme
    }), /* @__PURE__ */ jsx(Outlet, {}), " ", location.pathname !== "/meeting" && /* @__PURE__ */ jsx(Footer, {})]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout
}, Symbol.toStringTag, { value: "Module" }));
const _index = UNSAFE_withComponentProps(function Index() {
  return /* @__PURE__ */ jsx(Navigate, {
    to: "/react",
    replace: true
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _index
}, Symbol.toStringTag, { value: "Module" }));
const FileTree = ({
  nodes,
  expanded,
  setExpanded,
  onFileSelect,
  selectedFile,
  level = 0
}) => {
  const toggleFolder = (folder2, firstChild) => {
    setExpanded((prev) => {
      if (prev?.name === folder2.name) {
        onFileSelect(null);
        return null;
      }
      onFileSelect(firstChild);
      return folder2;
    });
  };
  return /* @__PURE__ */ jsx("div", { children: nodes.map((node, index2) => /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `flex items-center gap-2 px-6 py-1 cursor-pointer hover:bg-orange-900/20 light:hover:bg-gray-200 ${selectedFile === node.name ? "bg-orange-700/10 light:bg-blue-100" : ""} ${node.type === "folder" || index2 === nodes.length - 1 ? "border-b border-orange-200/20 light:border-amber-600/20 " : "border-b border-orange-200/5 light:border-amber-600/10"} ${expanded?.name === node.name ? "bg-orange-700/20 light:bg-blue-200" : ""}`,
        style: { paddingLeft: `${level * 12 + 12}px` },
        onClick: () => {
          if (node.type === "folder") {
            toggleFolder(node, node?.children?.[0]);
          } else {
            onFileSelect(node);
          }
        },
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-orange-100 light:text-gray-600 text-sm", children: node.type === "folder" ? expanded?.name === node.name ? /* @__PURE__ */ jsx(Icon, { name: "folder" }) : /* @__PURE__ */ jsx(Icon, { name: "folder" }) : /* @__PURE__ */ jsx(Icon, { name: "docs" }) }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: ` text-sm ${node.type === "folder" ? "font-bold text-orange-100 light:text-gray-700" : "text-neutral-400 light:text-neutral-500"}`,
              children: node.name
            }
          )
        ]
      }
    ),
    node.type === "folder" && expanded?.name === node.name && node.children && /* @__PURE__ */ jsx(
      FileTree,
      {
        nodes: node.children,
        onFileSelect,
        selectedFile,
        expanded,
        setExpanded,
        level: level + 1
      }
    )
  ] }, node.name)) });
};
const pillsConfig = [
  "RealtimeKitClient.init",
  "meeting.self.permissions",
  "meeting.participants.joined",
  "meeting.meta.roomName",
  "meeting.plugins.enable",
  "meeting.chat.messages",
  "meetings.polls.get",
  "meeting.stage.leave",
  "meeting.stage.join",
  "meeting.joinRoom",
  "meeitng.initMedia",
  "meeting.meta.roomName",
  "meeting.plugins.enable",
  "meeting.chat.messages",
  "meetings.polls.get"
];
const createMeeting = async (name) => {
  const apiKey = void 0;
  const orgId = void 0;
  const baseUrl = void 0;
  const authHeader = btoa(`${orgId}:${apiKey}`);
  const response = await fetch(`${baseUrl}/meetings`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${authHeader}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: name
    })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `API request failed with status ${response.status}`);
  }
  return data;
};
const addParticipant = async (name, meetingId, presetName) => {
  const apiKey = void 0;
  const orgId = void 0;
  const baseUrl = void 0;
  const authHeader = btoa(`${orgId}:${apiKey}`);
  const response = await fetch(`${baseUrl}/meetings/${meetingId}/participants`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${authHeader}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      preset_name: presetName,
      custom_participant_id: (Math.random() * 1e3).toString()
    })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `API request failed with status ${response.status}`);
  }
  return data;
};
const Editor = ({
  children,
  usecase
}) => {
  const [search] = useSearchParams();
  const formRef = useRef(null);
  const [expanded, setExpanded] = useState();
  const [selectedFile, setSelectedFile] = useState(
    null
  );
  const mode = search.get("mode") ?? "editor";
  const [terminalOutput, setTerminalOutput] = useState("$ rtk ~\n");
  const navigate = useNavigate();
  useEffect(() => {
    if (!formRef.current) return;
    const input = formRef.current.querySelector("input");
    input?.focus();
    setTerminalOutput("$ rtk ~\n");
  }, [formRef.current, selectedFile]);
  const joinMeeting = async () => {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const name = data.get("name");
    const token = data.get("token");
    if (token) {
      navigate(`/meeting?authToken=${token}&url=${expanded?.url}`);
      return;
    }
    const meetingName = data.get("meeting-title");
    let meetingId = data.get("meeting-id");
    if (!meetingId && !meetingName) {
      setTerminalOutput((prev) => {
        return `${prev}$ rtk ~ <span style="color: red;">✗ error: meeting ${selectedFile?.name.includes("create") ? "name" : "id"} is required</span>
`;
      });
      return;
    }
    setTerminalOutput((prev) => {
      return `${prev}$ rtk ~ creating meeting...
`;
    });
    if (meetingName) {
      try {
        const { data: data2 } = await createMeeting(meetingName);
        setTerminalOutput((prev) => {
          return `${prev}$ rtk ~ <span style="color: green;">✓ meeting created</span>
`;
        });
        meetingId = data2.id;
      } catch (error) {
        setTerminalOutput((prev) => {
          return `${prev}$ rtk ~ <span style="color: red;">✗ error: ${error instanceof Error ? error.message : "could not create meeting"}</span>
`;
        });
      }
    }
    setTerminalOutput((prev) => {
      return `${prev}$ rtk ~ generating auth token...
`;
    });
    try {
      const { data: data2 } = await addParticipant(
        name,
        meetingId,
        selectedFile?.preset ?? "group_call_host"
      );
      setTerminalOutput((prev) => {
        return `${prev}$ rtk ~ <span style="color: green;">✓ auth token generated. Joining meeting...</span>
`;
      });
      navigate(`/meeting?authToken=${data2.token}&url=${expanded?.url}`);
    } catch (error) {
      setTerminalOutput((prev) => {
        return `${prev}$ rtk ~ <span style="color: red;">✗ error: ${error instanceof Error ? error.message : "could not join meeting"}</span>
`;
      });
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex w-full h-[80vh] lg:h-[80%] lg:w-[80%] rounded-none overflow-hidden border
        bg-black border-orange-200/20 shadow-[0_8px_180px_rgba(84,61,8,0.2)]
        light:bg-white light:border-amber-400 light:shadow-[0_8px_180px_rgba(251,191,36,0.2)]`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "w-64 bg-[#080808] light:bg-gray-50 border-r border-orange-200/20 light:border-amber-400 overflow-y-auto", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 border-b border-orange-200/20 light:border-amber-400", children: /* @__PURE__ */ jsxs("div", { className: "text-orange-100 light:text-gray-700 text-xs font-semibold", children: [
            usecase,
            " Examples"
          ] }) }),
          children(selectedFile, setSelectedFile, expanded, setExpanded)
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col", children: [
          selectedFile && /* @__PURE__ */ jsx("div", { className: "bg-[#080808] light:bg-gray-100 border-b border-orange-200/20 light:border-amber-400 px-4 py-1", children: /* @__PURE__ */ jsxs("span", { className: "text-orange-300 light:text-gray-700 text-sm", children: [
            expanded?.name,
            " / ",
            selectedFile.name
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 p-4 overflow-auto min-h-0", children: selectedFile ? mode === "editor" ? /* @__PURE__ */ jsx("form", { ref: formRef, children: /* @__PURE__ */ jsxs("div", { className: "font-mono text-white light:text-gray-500", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm mr-2", children: "1. " }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-lime-800 light:text-lime-600", children: selectedFile.content })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm gap-1 flex flex-col", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm mr-2", children: "2. " }),
                /* @__PURE__ */ jsxs("span", { className: "text-blue-400/60 light:text-blue-600", children: [
                  "const",
                  " "
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-blue-400/80 light:text-blue-500", children: "meeting" }),
                " ",
                "=",
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-blue-400/80 light:text-blue-500", children: "RealtimeKitClient" }),
                ".",
                /* @__PURE__ */ jsx("span", { className: "text-amber-200/80 light:text-amber-600", children: "config(" }),
                /* @__PURE__ */ jsx("span", { className: "text-fuchsia-300 light:text-fuchsia-700", children: `{` })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm mr-2", children: "3. " }),
                /* @__PURE__ */ jsxs("span", { className: "text-cyan-200/80 light:text-cyan-600", children: [
                  "  name:",
                  " "
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    name: "name",
                    type: "text",
                    className: "text-white italic border light:border-gray-300 border-gray-800 light:text-gray-600 text-sm placeholder:text-gray-600 cursor-text focus:outline-none bg-gray-900 light:bg-gray-200 px-1 py-0.5",
                    placeholder: "Amelia James"
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "text-sm text-lime-800 light:text-lime-600", children: [
                  " ",
                  "// input name here"
                ] })
              ] }),
              selectedFile.name.includes("create") && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm mr-2", children: "4. " }),
                /* @__PURE__ */ jsxs("span", { className: "text-cyan-200/80 light:text-cyan-600", children: [
                  "  meeting-title:",
                  " "
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    name: "meeting-title",
                    type: "text",
                    className: "text-white italic border light:border-gray-300 border-gray-800 light:text-gray-600 text-sm placeholder:text-gray-600 cursor-text focus:outline-none bg-gray-900 light:bg-gray-200 px-1 py-0.5",
                    placeholder: "Sprint Retrospective"
                  }
                )
              ] }),
              selectedFile.name.includes("join") && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm mr-2", children: "4. " }),
                /* @__PURE__ */ jsxs("span", { className: "text-cyan-200/80 light:text-cyan-600", children: [
                  "  meeting-id:",
                  " "
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    name: "meeting-id",
                    type: "text",
                    className: "text-white italic border light:border-gray-300 border-gray-800 light:text-gray-600 text-sm placeholder:text-gray-600 cursor-text focus:outline-none bg-gray-900 light:bg-gray-200 px-1 py-0.5",
                    placeholder: "****-44556"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm mr-2", children: "5. " }),
                /* @__PURE__ */ jsx("span", { className: "text-fuchsia-300 light:text-fuchsia-700", children: `}` }),
                /* @__PURE__ */ jsx("span", { className: "text-amber-200/80 light:text-amber-600", children: ")" }),
                ";"
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm mr-2", children: "6. " }),
                /* @__PURE__ */ jsx("span", { className: "text-blue-400/80 light:text-blue-500", children: "meeting" }),
                ".",
                /* @__PURE__ */ jsx("span", { className: "text-amber-200/80 light:text-amber-600", children: "join" }),
                /* @__PURE__ */ jsx("span", { className: "text-fuchsia-300 light:text-fuchsia-700", children: `()` }),
                ";"
              ] })
            ] })
          ] }) }) : /* @__PURE__ */ jsx("form", { ref: formRef, children: /* @__PURE__ */ jsxs("div", { className: "font-mono text-white light:text-gray-500", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm mr-2", children: "1. " }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-lime-800 light:text-lime-600", children: selectedFile.content })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm gap-1 flex flex-col", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm mr-2", children: "2. " }),
                /* @__PURE__ */ jsxs("span", { className: "text-blue-400/60 light:text-blue-600", children: [
                  "const",
                  " "
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-blue-400/80 light:text-blue-500", children: "meeting" }),
                " ",
                "=",
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-blue-400/80 light:text-blue-500", children: "RealtimeKitClient" }),
                ".",
                /* @__PURE__ */ jsx("span", { className: "text-amber-200/80 light:text-amber-600", children: "config(" }),
                /* @__PURE__ */ jsx("span", { className: "text-fuchsia-300 light:text-fuchsia-700", children: `{` })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm mr-2", children: "3. " }),
                /* @__PURE__ */ jsxs("span", { className: "text-cyan-200/80 light:text-cyan-600", children: [
                  "  authToken:",
                  " "
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    name: "token",
                    type: "text",
                    className: "text-white italic border light:border-gray-300 border-gray-800 light:text-gray-600 text-sm placeholder:text-gray-600 cursor-text focus:outline-none bg-gray-900 light:bg-gray-200 px-1 py-0.5",
                    placeholder: "***5ergvfd"
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "text-sm text-lime-800 light:text-lime-600", children: [
                  " ",
                  "// input auth token here"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm mr-2", children: "4. " }),
                /* @__PURE__ */ jsx("span", { className: "text-fuchsia-300 light:text-fuchsia-700", children: `}` }),
                /* @__PURE__ */ jsx("span", { className: "text-amber-200/80 light:text-amber-600", children: ")" }),
                ";"
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600 text-sm mr-2", children: "5. " }),
                /* @__PURE__ */ jsx("span", { className: "text-blue-400/80 light:text-blue-500", children: "meeting" }),
                ".",
                /* @__PURE__ */ jsx("span", { className: "text-amber-200/80 light:text-amber-600", children: "join" }),
                /* @__PURE__ */ jsx("span", { className: "text-fuchsia-300 light:text-fuchsia-700", children: `()` }),
                ";"
              ] })
            ] })
          ] }) }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center flex-col gap-4 justify-center h-full text-orange-200 light:text-gray-500 text-sm", children: [
            /* @__PURE__ */ jsx(Logo, { size: 60, className: "text-orange-500 light:fill-none" }),
            /* @__PURE__ */ jsx("p", { className: "w-[50%] text-center text-thin", children: "Get started with RealtimeKit examples. Select an example to try." })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "grow border-t border-orange-200/20 light:border-amber-400 bg-[#040404] light:bg-slate-800 flex flex-col", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-4 py-1 border-b border-orange-200/20 light:border-gray-300 bg-[#080808] light:bg-slate-700 flex flex-row items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-orange-100 light:text-gray-200 text-xs font-semibold", children: "Terminal" }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-center gap-2", children: [
                expanded?.githubUrl && /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: expanded?.githubUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-orange-50 cursor-pointer hover:text-orange-300 transition-colors light:text-neutral-700 light:hover:text-neutral-900",
                    children: /* @__PURE__ */ jsx(Icon, { name: "github" })
                  }
                ),
                expanded?.docsUrl && /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: expanded?.docsUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-orange-50 cursor-pointer hover:text-orange-300 transition-colors light:text-neutral-700 light:hover:text-neutral-900",
                    children: /* @__PURE__ */ jsx(Icon, { name: "docs" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 p-4 overflow-auto flex flex-col gap-3", children: [
              /* @__PURE__ */ jsx(
                "pre",
                {
                  className: "text-orange-200 light:text-green-400 font-mono text-xs whitespace-pre-wrap",
                  dangerouslySetInnerHTML: { __html: terminalOutput }
                }
              ),
              selectedFile && /* @__PURE__ */ jsx(
                "button",
                {
                  className: "cursor-pointer px-4 py-2 font-mono text-xs bg-orange-900/30 hover:bg-orange-800/40 light:bg-slate-600 light:hover:bg-slate-500 text-orange-100 light:text-gray-100 border border-orange-700/50 light:border-slate-500 rounded transition-colors w-fit",
                  onClick: joinMeeting,
                  children: "$ join now"
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
};
const pillColors = [
  {
    border: "border-blue-500/10 light:border-blue-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-200/20"
  },
  {
    border: "border-purple-500/10 light:border-purple-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-200/50"
  },
  {
    border: "border-pink-500/10 light:border-pink-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-300/50"
  },
  {
    border: "border-green-500/10 light:border-green-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-300/50"
  },
  {
    border: "border-yellow-500/10 light:border-yellow-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-300/50"
  },
  {
    border: "border-orange-500/10 light:border-orange-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-300/50"
  },
  {
    border: "border-red-500/10 light:border-red-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-300/50"
  },
  {
    border: "border-cyan-500/10 light:border-cyan-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-300/50"
  },
  {
    border: "border-indigo-500/10 light:border-indigo-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-300/50"
  },
  {
    border: "border-teal-500/10 light:border-teal-500/20",
    text: "text-gray-400/30 light:text-gray-400/60",
    bg: "bg-black/20 light:bg-gray-300/50"
  }
];
const SketchyComponent = sketchyProvider(
  () => /* @__PURE__ */ jsx("i", { className: "text-orange-200 light:text-orange-500", children: "lowest" }),
  {
    type: "underline",
    color: "#fed7aa",
    offset: 0,
    strokeWidth: 2,
    roughness: 1.5
  }
);
const usecases = [
  {
    label: "Video",
    id: "video",
    icon: "conferencing"
  },
  {
    label: "Audio",
    id: "audio",
    icon: "audio"
  },
  {
    label: "Webinar",
    id: "webinar",
    icon: "webinar"
  },
  {
    label: "Livestream",
    id: "livestream",
    icon: "livestream"
  }
];
const Hero = ({
  children
}) => {
  const [pills, setPills] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const usecaseParam = searchParams.get("usecase");
  const [selected, setSelected] = useState(() => {
    if (usecaseParam && usecases.some((u) => u.id === usecaseParam)) {
      return usecaseParam;
    }
    return usecases[0].id;
  });
  useEffect(() => {
    setSearchParams({ usecase: selected }, { replace: true });
  }, [selected, setSearchParams]);
  useEffect(() => {
    const generatedPills = pillsConfig.map((text) => {
      return {
        text,
        top: `${Math.random() * 85 + 5}%`,
        // 5% to 90%
        left: `${Math.random() * 60 + 15}%`,
        // 15% to 75%
        delay: Math.random() * 4,
        // 0s to 4s delay
        colorIndex: Math.floor(Math.random() * pillColors.length)
      };
    });
    setPills(generatedPills);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "relative py-18 px-12 w-full h-full min-h-[80vh] overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0", children: pills.map((pill, index2) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute animate-pill-pop",
        style: {
          top: pill.top,
          left: pill.left,
          animationDelay: `${pill.delay}s`
        },
        children: /* @__PURE__ */ jsx(
          "span",
          {
            className: `inline-block px-5 py-2.5 rounded-full border text-sm font-mono backdrop-blur-sm whitespace-nowrap ${pillColors[pill.colorIndex].border} ${pillColors[pill.colorIndex].text} ${pillColors[pill.colorIndex].bg}`,
            children: pill.text
          }
        )
      },
      index2
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 text-white flex lg:flex-row flex-col h-full gap-2 px-0 min-h-[80vh]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-col gap-4 flex-1 flex lg:items-start items-center justify-center min-h-[40vh]", children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl font-bold text-orange-50 light:text-neutral-700", children: [
          /* @__PURE__ */ jsxs("span", { className: "font-handwritten font-normal italic text-orange-500", children: [
            "Cloudflare's",
            " "
          ] }),
          "RealtimeKit"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-lg text-orange-50 light:text-neutral-500", children: [
          "Build Realtime AI apps with ",
          /* @__PURE__ */ jsx(SketchyComponent, {}),
          " latency – at any scale!"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center md:justify-start justify-center gap-4 my-4 flex-wrap", children: usecases.map((usecase) => {
          return /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setSelected(usecase.id),
              className: `${selected === usecase.id ? "shadow-[0_0px_140px_rgba(104,62,80,0.86)] border-[#423745] light:border-[#dbb3e6] light:shadow-[0_4px_24px_rgba(219,179,230,0.6)]" : "shadow-[0_0px_140px_rgba(104,62,100,0.46)] border-[#1d1d21] light:border-gray-300 light:shadow-[0_4px_24px_rgba(219,179,230,0.3)]"} cursor-pointer px-4 py-2 gap-2 flex flex-row items-center rounded-full bg-black light:bg-neutral-100 border-solid border-[1px]`,
              children: [
                /* @__PURE__ */ jsx(
                  Icon,
                  {
                    name: usecase.icon,
                    className: "text-neutral-400 light:text-neutral-500"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "text-neutral-400 light:text-neutral-500", children: usecase.label })
              ]
            },
            usecase.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-2 min-h-[60vh] min-w-[400px] lg:items-end lg:justify-center items-start justify-start", children: /* @__PURE__ */ jsx(
        Editor,
        {
          usecase: usecases.find((u) => u.id === selected)?.label || "Examples",
          children
        }
      ) })
    ] })
  ] });
};
const sampleFiles$2 = [
  {
    name: "active-speaker-ui",
    id: "react-examples/active-speaker-ui",
    type: "folder",
    url: "https://react-examples.cf-realtime.workers.dev/active-speaker-ui",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/react-examples/examples/active-speaker-ui",
    docsUrl: "",
    usecase: "webinar",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  },
  {
    name: "async-video-survey",
    id: "react-examples/async-video-survey",
    type: "folder",
    url: "https://react-examples.cf-realtime.workers.dev/async-video-survey",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/react-examples/examples/async-video-survey",
    docsUrl: "",
    usecase: "video",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  },
  {
    name: "audio-room",
    id: "react-examples/audio-room",
    type: "folder",
    url: "https://react-examples.cf-realtime.workers.dev/audio-room",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/react-examples/examples/audio-room",
    docsUrl: "",
    usecase: "audio",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  },
  {
    name: "back-to-back-meetings",
    id: "react-examples/back-to-back-meetings",
    type: "folder",
    url: "https://react-examples.cf-realtime.workers.dev/back-to-back-meetings",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/react-examples/examples/back-to-back-meetings",
    docsUrl: "",
    usecase: "video",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  },
  {
    name: "clubhouse",
    id: "react-examples/clubhouse",
    type: "folder",
    url: "https://react-examples.cf-realtime.workers.dev/clubhouse",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/react-examples/examples/clubhouse",
    docsUrl: "",
    usecase: "livestream",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  },
  {
    name: "create-your-own-ui",
    id: "react-examples/create-your-own-ui",
    type: "folder",
    url: "https://react-examples.cf-realtime.workers.dev/create-your-own-ui",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/react-examples/examples/create-your-own-ui",
    docsUrl: "",
    usecase: "video",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  },
  {
    name: "default-meeting",
    id: "react-examples/default-meeting-ui",
    type: "folder",
    url: "https://react-examples.cf-realtime.workers.dev/default-meeting-ui",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/react-examples/examples/default-meeting",
    docsUrl: "",
    usecase: "all",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  },
  {
    name: "facetime",
    id: "react-examples/facetime",
    type: "folder",
    url: "https://react-examples.cf-realtime.workers.dev/facetime",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/react-examples/examples/facetime",
    docsUrl: "",
    usecase: "video",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  },
  {
    name: "live-auction",
    id: "react-examples/live-auction",
    type: "folder",
    url: "https://react-examples.cf-realtime.workers.dev/live-auction",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/react-examples/examples/live-auction",
    docsUrl: "",
    usecase: "livestream",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  },
  {
    name: "multi-meeitng",
    id: "react-examples/multi-meeitng",
    type: "folder",
    url: "https://react-examples.cf-realtime.workers.dev/multi-meeitng",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/react-examples/examples/multi-meeting",
    docsUrl: "",
    usecase: "video",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  },
  {
    name: "background-effects",
    id: "react-examples/with-background-effects",
    type: "folder",
    url: "https://react-examples.cf-realtime.workers.dev/with-background-effects",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/react-examples/examples/with-background-transformer",
    docsUrl: "",
    usecase: "all",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  }
];
const sampleFiles$1 = [
  {
    name: "background-effects",
    usecase: "all",
    id: "html-examples/with-background-transformer",
    url: "http://html-examples.cf-realtime.workers.dev/with-background-transformer",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/html-examples/examples/with-background-transformer",
    docsUrl: "",
    type: "folder",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  },
  {
    name: "default-meeting",
    usecase: "all",
    id: "html-examples/default-meeting-ui",
    url: "http://html-examples.cf-realtime.workers.dev/default-meeting-ui",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/html-examples/examples/default-meeting",
    docsUrl: "",
    type: "folder",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  },
  {
    name: "create-your-own-ui",
    usecase: "video",
    id: "html-examples/create-your-own-ui",
    url: "http://html-examples.cf-realtime.workers.dev/create-your-own-ui",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/html-examples/examples/create-your-own-ui",
    docsUrl: "",
    type: "folder",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  },
  {
    name: "ui-kit-addons",
    usecase: "all",
    id: "html-examples/with-ui-addons",
    url: "http://html-examples.cf-realtime.workers.dev/with-ui-addons",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/html-examples/examples/with-ui-addons",
    docsUrl: "",
    type: "folder",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  }
];
const sampleFiles = [
  {
    name: "create-your-own-ui",
    id: "angular-examples/create-your-own-ui",
    type: "folder",
    url: "https://angular-examples.cf-realtime.workers.dev/create-your-own-ui",
    usecase: "video",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/angular-examples/examples/create-your-own-ui",
    docsUrl: "",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  },
  {
    name: "default-meeting",
    id: "angular-examples/default-meeting-ui",
    type: "folder",
    url: "https:/angular-examples.cf-realtime.workers.dev/default-meeting-ui",
    usecase: "all",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/angular-examples/examplesdefault-meeting",
    docsUrl: "",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  },
  {
    name: "background-effects",
    id: "angular-examples/with-video-transformer",
    type: "folder",
    url: "https://angular-examples.cf-realtime.workers.dev/with-video-transformer",
    usecase: "all",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/angular-examples/examples/with-video-transformer",
    docsUrl: "",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting"
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting"
      }
    ]
  }
];
const getFiles = (framework, usecase = "video", mode = "editor") => {
  const files = framework === "react" ? sampleFiles$2 : framework === "angular" ? sampleFiles : sampleFiles$1;
  const filteredFiles = files.filter((file) => file.usecase === usecase || file.usecase === "all");
  if (mode === "token") {
    return filteredFiles.map((file) => ({
      ...file,
      children: file.children?.filter((child) => child.name === "join.ts")
    }));
  }
  return filteredFiles;
};
const VanillaExamples = () => {
  const [searchParams] = useSearchParams();
  const usecaseParam = searchParams.get("usecase") ?? "video";
  const mode = searchParams.get("mode") ?? "editor";
  const files = useMemo(() => {
    return getFiles("vanilla", usecaseParam, mode);
  }, [usecaseParam, mode]);
  return /* @__PURE__ */ jsx("div", {
    className: "w-full h-full",
    children: /* @__PURE__ */ jsx(Hero, {
      children: (selectedFile, setSelectedFile, expanded, setExpanded) => {
        const handleFileSelect = (file) => {
          setSelectedFile(file ?? null);
        };
        return /* @__PURE__ */ jsx(FileTree, {
          nodes: files,
          onFileSelect: handleFileSelect,
          selectedFile: selectedFile?.name || null,
          expanded,
          setExpanded
        });
      }
    })
  });
};
const index$3 = UNSAFE_withComponentProps(VanillaExamples);
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$3
}, Symbol.toStringTag, { value: "Module" }));
const ReactExamples = () => {
  const [searchParams] = useSearchParams();
  const usecaseParam = searchParams.get("usecase") ?? "video";
  const mode = searchParams.get("mode") ?? "editor";
  const files = useMemo(() => {
    return getFiles("react", usecaseParam, mode);
  }, [usecaseParam, mode]);
  return /* @__PURE__ */ jsx("div", {
    className: "w-full h-full",
    children: /* @__PURE__ */ jsx(Hero, {
      children: (selectedFile, setSelectedFile, expanded, setExpanded) => {
        const handleFileSelect = (file) => {
          setSelectedFile(file ?? null);
        };
        return /* @__PURE__ */ jsx(FileTree, {
          nodes: files,
          onFileSelect: handleFileSelect,
          selectedFile: selectedFile?.name || null,
          expanded,
          setExpanded
        });
      }
    })
  });
};
const index$2 = UNSAFE_withComponentProps(ReactExamples);
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$2
}, Symbol.toStringTag, { value: "Module" }));
const AngularExamples = () => {
  const [searchParams] = useSearchParams();
  const usecaseParam = searchParams.get("usecase") ?? "video";
  const mode = searchParams.get("mode") ?? "editor";
  const files = useMemo(() => {
    return getFiles("angular", usecaseParam, mode);
  }, [usecaseParam, mode]);
  return /* @__PURE__ */ jsx("div", {
    className: "w-full h-full",
    children: /* @__PURE__ */ jsx(Hero, {
      children: (selectedFile, setSelectedFile, expanded, setExpanded) => {
        const handleFileSelect = (file) => {
          setSelectedFile(file ?? null);
        };
        return /* @__PURE__ */ jsx(FileTree, {
          nodes: files,
          onFileSelect: handleFileSelect,
          selectedFile: selectedFile?.name || null,
          expanded,
          setExpanded
        });
      }
    })
  });
};
const index$1 = UNSAFE_withComponentProps(AngularExamples);
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$1
}, Symbol.toStringTag, { value: "Module" }));
const Meeting = () => {
  const [search] = useSearchParams();
  const token = search.get("token");
  const url = search.get("url") ?? "";
  const [loadingState, setLoadingState] = useState("loading");
  const isValidUrl = async () => {
    try {
      await fetch(url);
      setLoadingState("loaded");
    } catch (e) {
      setLoadingState("errored");
    }
  };
  useEffect(() => {
    isValidUrl();
  }, [url]);
  if (loadingState === "loading") {
    return /* @__PURE__ */ jsx("div", {
      className: "w-full min-h-screen flex flex-col justify-center items-center gap-4 text-orange-200 light:text-gray-700",
      children: /* @__PURE__ */ jsx("pre", {
        className: "bg-orange-900/20 border border-orange-700/20 p-2 rounded text-sm",
        children: "Loading..."
      })
    });
  }
  if (!token || !url || loadingState === "errored") {
    return /* @__PURE__ */ jsxs("div", {
      className: "w-full min-h-screen flex flex-col justify-center items-center gap-4 text-orange-200 light:text-gray-700",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-xl font-bold gap-2 text-orange-100 light:text-gray-900 flex items-center justify-center",
        children: "Uh Oh! Invalid Meeting URL"
      }), /* @__PURE__ */ jsxs("pre", {
        className: "bg-orange-900/20 border border-orange-700/20 p-2 rounded text-sm",
        children: ["Error: ", !token && "missing authentication token. ", !url && "missing example url.", loadingState === "errored" && "The example you are trying to run does not exist."]
      }), /* @__PURE__ */ jsx(Link, {
        to: "/",
        className: "px-4 py-2 bg-orange-900/30 hover:bg-orange-800/40 light:bg-amber-500 light:hover:bg-amber-600 \n          text-orange-100 light:text-white border border-orange-700/50 light:border-amber-600 \n          rounded transition-colors font-medium",
        children: "← Back to Examples"
      })]
    });
  }
  return /* @__PURE__ */ jsx("div", {
    className: "w-full h-full flex items-center justify-center",
    children: /* @__PURE__ */ jsx("iframe", {
      src: url,
      className: "w-full h-full border-none",
      sandbox: "allow-same-origin allow-scripts allow-forms allow-popups allow-modals",
      onError: () => setLoadingState("errored"),
      onLoad: () => setLoadingState("loaded")
    })
  });
};
const index = UNSAFE_withComponentProps(Meeting);
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-D_sjRfv7.js", "imports": ["/assets/chunk-UIGDSWPH-BMXOTfwR.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-DLSKQUqr.js", "imports": ["/assets/chunk-UIGDSWPH-BMXOTfwR.js"], "css": ["/assets/root-ziGy0Q3E.css", "/assets/App-D1BXAHVO.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "layout": { "id": "layout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/layout-BrYJlYF7.js", "imports": ["/assets/chunk-UIGDSWPH-BMXOTfwR.js", "/assets/Icon-BdsLgJuJ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "layout", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_index-D8Sr3Gtx.js", "imports": ["/assets/chunk-UIGDSWPH-BMXOTfwR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/vanilla/index": { "id": "pages/vanilla/index", "parentId": "layout", "path": "vanilla", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-BwstutL7.js", "imports": ["/assets/chunk-UIGDSWPH-BMXOTfwR.js", "/assets/utils-DWTb47dx.js", "/assets/Icon-BdsLgJuJ.js"], "css": ["/assets/utils-COODlGPp.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/react/index": { "id": "pages/react/index", "parentId": "layout", "path": "react", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-FUWKXAtk.js", "imports": ["/assets/chunk-UIGDSWPH-BMXOTfwR.js", "/assets/utils-DWTb47dx.js", "/assets/Icon-BdsLgJuJ.js"], "css": ["/assets/utils-COODlGPp.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/angular/index": { "id": "pages/angular/index", "parentId": "layout", "path": "angular", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-qw6ncLTy.js", "imports": ["/assets/chunk-UIGDSWPH-BMXOTfwR.js", "/assets/utils-DWTb47dx.js", "/assets/Icon-BdsLgJuJ.js"], "css": ["/assets/utils-COODlGPp.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/meeting/index": { "id": "pages/meeting/index", "parentId": "layout", "path": "meeting", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-Bk9HRyy0.js", "imports": ["/assets/chunk-UIGDSWPH-BMXOTfwR.js"], "css": ["/assets/App-D1BXAHVO.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-e7ff5422.js", "version": "e7ff5422", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v8_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": true };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "layout": {
    id: "layout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "layout",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "pages/vanilla/index": {
    id: "pages/vanilla/index",
    parentId: "layout",
    path: "vanilla",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "pages/react/index": {
    id: "pages/react/index",
    parentId: "layout",
    path: "react",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "pages/angular/index": {
    id: "pages/angular/index",
    parentId: "layout",
    path: "angular",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "pages/meeting/index": {
    id: "pages/meeting/index",
    parentId: "layout",
    path: "meeting",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};

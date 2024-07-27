"use client";
import { redirect } from "next/navigation";
import GradientCircle from "./components/GradientCircle";
import Links from "./components/Links";
import MainMenuLinkButton from "./components/MainMenuLinkButton";
import TextTransition from "./components/TextTransition";
import { useEffect, useState } from "react";
import Background from "./math/[id]/components/main/Grid/Background";
import Background2 from "./components/Background2";

// export default function Home() {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) {
//     return null;
//   }

//   return <div
//     suppressHydrationWarning
//     style={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '100vh',
//       fontFamily: 'Poppins',
//       textAlign: 'center',
//       flexDirection: 'column',
//     }}
//   >
//     <GradientCircle
//       x={0}
//       y={-.4}
//       size={1}
//       color="rgba(18, 35, 191, 0.35)"
//     />
//     <GradientCircle
//       x={.3}
//       y={-.2}
//       size={.8}
//       color="rgba(48, 6, 104, 0.5)"
//     />
//     <h1
//       style={{
//         fontWeight: 'bolder',
//         fontSize: '10vh',
//         marginBottom: '-3vh',
//         textShadow: "0px 2px 40px rgba(255, 255, 255, .4)",
//         marginTop: '10vh',
//       }}
//     >8GRID</h1>


//     <TextTransition
//       initial="We don't visualize. We interact."
//       after="Created by Nita Andrei and Matei Oprea"
//       style={{
//         fontWeight: 300,
//         fontSize: '1.4vh',
//         width: '30vh'
//       }}
//       gapWords={5}
//     />

//     <Links
//       style={{
//         width: '50vh',
//         height: '10vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: '20vh',
//         marginTop: '10vh',
//       }}
//     />

//   </div>
// }

export default function Home() {

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <>
    <GradientCircle
      x={.07}
      y={-.4}
      size={1}
      zIndex={2}
      color="rgba(3, 7, 45, 0.45)"
    />
    <Background2
      x={0.33}
      y={0}
      opacity={1}
    />
    <Background2
      x={-0.20}
      opacity={.9}
      offset={95}
      y={0}
    />
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Poppins',
        textAlign: 'center',
        flexDirection: 'column',
      }}

    >

      <h1
        style={{
          fontWeight: 'bolder',
          fontSize: '13vh',
          marginBottom: '-4vh',
          textShadow: "0px 2px 20px rgba(255, 255, 255, .4)",
          marginTop: '10vh',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      >8GRID</h1>
      <TextTransition
        initial="We don't visualize. We interact."
        after="Created by Nita Andrei and Oprea Matei"
        style={{
          fontWeight: 300,
          fontSize: '1.6vh',
          width: '19vw'
        }}
        gapWords={5}
      />
      <GradientCircle
        x={.07}
        y={-.4}
        size={1}
        zIndex={2}
        color="rgba(18, 35, 191, 0.55)"
      />

      <Links
        style={{
          zIndex: 2,
          width: '50vh',
          height: '10vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20vh',
          marginTop: '10vh',
        }}
      />
    </div >
  </>
}
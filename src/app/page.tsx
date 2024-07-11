import Links from "./components/Links";
import MainMenuLinkButton from "./components/MainMenuLinkButton";
import { TextTransition } from "./components/TextTransition";

export default function Home() {

  return <div
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
        fontSize: '10vh',
        marginBottom: '-3vh',
        textShadow: "0px 2px 40px rgba(255, 255, 255, .4)",
        marginTop: '10vh',
      }}
    >8GRID</h1>


    <TextTransition
      initial="We don't visualize. We interact."
      after="Created by Nita Andrei and Matei Oprea"
      style={{
        fontWeight: 300,
        fontSize: '1.4vh',
        width: '30vh'
      }}
      gapWords={5}
    />

    <Links
      style={{
        width: '50vh',
        height: '10vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20vh',
        marginTop: '10vh',
      }}
    />

  </div>
}
